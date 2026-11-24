import type { Role } from "./roles";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {                 
        id: string;
        clinicId: string;
        role: Role;
      };
    }
  }
}

