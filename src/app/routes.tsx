import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ClienteDashboard from "./pages/ClienteDashboard";
import TrabajadorDashboard from "./pages/TrabajadorDashboard";
import Catalogo from "./pages/Catalogo";
import SolicitarTrabajador from "./pages/SolicitarTrabajador";
import TrabajadorPerfil from "./pages/TrabajadorPerfil";
import TrabajadorSolicitudes from "./pages/TrabajadorSolicitudes";
import TrabajadorOnboarding from "./pages/TrabajadorOnboarding";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/cliente/dashboard",
    Component: ClienteDashboard,
  },
  {
    path: "/trabajador/dashboard",
    Component: TrabajadorDashboard,
  },
  {
    path: "/trabajador/solicitudes",
    Component: TrabajadorSolicitudes,
  },
  {
    path: "/catalogo",
    Component: Catalogo,
  },
  {
    path: "/trabajador/onboarding",
    Component: TrabajadorOnboarding,
  },
  {
    path: "/trabajador/:id",
    Component: TrabajadorPerfil,
  },
  {
    path: "/solicitar-trabajador",
    Component: SolicitarTrabajador,
  },
  {
    path: "*",
    Component: () => (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#011C40' }}>
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl">Página no encontrada</p>
          <a href="/" className="mt-4 inline-block text-[#A7EBF2] hover:underline">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);
