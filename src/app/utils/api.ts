const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper para mapear _id a id (MongoDB a frontend)
function mapMongoDoc(doc: any): any {
  if (!doc) return doc;
  if (Array.isArray(doc)) {
    return doc.map(mapMongoDoc);
  }
  if (doc._id) {
    const { _id, ...rest } = doc;
    return { id: _id, ...rest };
  }
  return doc;
}

// Helper para hacer peticiones a la API
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = localStorage.getItem("access_token");

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Intentar parsear JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // Si no es JSON válido
      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`,
        );
      }
      data = {};
    }

    if (!response.ok) {
      const errorMsg =
        data.error ||
        data.message ||
        `Error HTTP ${response.status}`;
      console.error(
        `API Error en ${endpoint}:`,
        errorMsg,
        data,
      );
      throw new Error(errorMsg);
    }

    return data;
  } catch (error: any) {
    // Si es un error de red o fetch
    if (error.message.includes("fetch")) {
      console.error("Error de conexión:", error);
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    }
    console.error(`Error en ${endpoint}:`, error.message);
    throw error;
  }
}

// Autenticación
export const auth = {
  signup: async (
    email: string,
    password: string,
    nombre: string,
    tipo: "cliente" | "trabajador",
    telefono?: string,
  ) => {
    const normalizedEmail = email.trim().toLowerCase();
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        nombre,
        tipo,
        telefono,
      }),
    });
  },

  login: async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (data.access_token && data.user) {
      localStorage.setItem("access_token", data.access_token);
      const mappedUser = mapMongoDoc(data.user);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }

    return data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getSession: async () => {
    return apiRequest("/auth/session");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Trabajadores
export const trabajadores = {
  getAll: async () => {
    const response = await apiRequest("/trabajadores");
    return {
      success: response.success,
      trabajadores: mapMongoDoc(response.data || [])
    };
  },

  getById: async (id: string) => {
    const response = await apiRequest(`/trabajadores/${id}`);
    return {
      success: response.success,
      trabajador: mapMongoDoc(response.data)
    };
  },

  getMyData: async () => {
    const response = await apiRequest('/trabajadores/mis-datos');
    return {
      success: response.success,
      trabajador: mapMongoDoc(response.data)
    };
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest(`/trabajadores/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return {
      success: response.success,
      trabajador: mapMongoDoc(response.data)
    };
  },

  search: async (query: string) => {
    const response = await apiRequest(
      `/trabajadores/buscar/${encodeURIComponent(query)}`,
    );
    return {
      success: response.success,
      trabajadores: mapMongoDoc(response.data || [])
    };
  },
};

// Reseñas
export const reseñas = {
  create: async (
    trabajador_id: string,
    puntuacion: number,
    comentario: string,
  ) => {
    const response = await apiRequest("/reseñas", {
      method: "POST",
      body: JSON.stringify({
        trabajador_id,
        puntuacion,
        comentario,
      }),
    });
    return {
      success: response.success,
      reseña: mapMongoDoc(response.data)
    };
  },

  getByTrabajador: async (trabajador_id: string) => {
    const response = await apiRequest(
      `/reseñas/${trabajador_id}`,
    );
    return {
      success: response.success,
      reseñas: mapMongoDoc(response.data || [])
    };
  },
};

// Solicitudes de servicio
export const solicitudes = {
  getTrabajador: async () => {
    const response = await apiRequest('/solicitudes/trabajador');
    return {
      success: response.success,
      solicitudes: mapMongoDoc(response.data || [])
    };
  },

  update: async (id: string, data: any) => {
    const response = await apiRequest(`/solicitudes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return {
      success: response.success,
      solicitud: mapMongoDoc(response.data)
    };
  }
};

// Perfil
export const perfil = {
  update: async (data: any) => {
    const response = await apiRequest("/perfil", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (response.user) {
      const mappedUser = mapMongoDoc(response.user);
      localStorage.setItem("user", JSON.stringify(mappedUser));
    }
    return response;
  },
};