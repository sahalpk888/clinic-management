import type { Role } from "./roles";

export {};

declare global {
  namespace Express {
    interface Request {
      user?: {                 //// for req.user
        id: string;
        clinicId: string;
        role: Role;
      };
    }
  }
}



/*   EXPLANATION ***    


                        Express already provides a Request interface.

                        For example, when you write:
                        import { Request } from "express";


                        Express provides the type definition for its request object.

                        That request object contains properties like:
                        req.body
                        req.params
                        req.query
                        req.headers


                        Now, in your authentication middleware, you want to add another property:
                        req.user


                        But Express doesn't know about your custom user property.

                        So we extend the existing Express Request interface.

                        We do that using:
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


                        This is called Declaration Merging.

                        In simple words:

                        You are telling TypeScript:

                        "Express already has a Request interface. Add my user property to it."


*/