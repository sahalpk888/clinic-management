


export const ROLES=["admin","receptionist","doctor","pharmacist"]as const;  ///here we write "as const" beacuse it amke readonly so that new role cannot be add like if we try role.push("manager") not work..useful

export type Role=(typeof ROLES)[number]  ///(make like this union) readonly ["apple", "mango", "orange"]  ----->  type Fruit = "apple" | "mango" | "orange";