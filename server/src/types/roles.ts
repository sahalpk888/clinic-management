


export const ROLES=["admin","receptionist","doctor","pharmacist"]as const; 

export type Role=(typeof ROLES)[number]  