import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
  tipo: 'cliente' | 'trabajador';
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '30d'
  });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  return jwt.verify(token, secret) as TokenPayload;
};
