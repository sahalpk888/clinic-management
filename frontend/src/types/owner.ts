import type { Role } from "./roles";




export interface Owner{
        id:string,
        clinincId:string,
        role:Role,
        name:string,
        email:string
}