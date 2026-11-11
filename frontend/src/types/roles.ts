



export const ROLES = [
  "admin",
  "doctor",
  "receptionist",
  "pharmacist",
] as const;

export type Role = (typeof ROLES)[number];