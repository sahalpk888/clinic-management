import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";



export const clinic=pgTable("clinic",{
    id:uuid("id").defaultRandom().primaryKey(),
    clinicName:varchar("clinic_name").notNull(),
    slug:varchar("slug").notNull().unique(),
    email:varchar("email").notNull(),
    phone:varchar("phone").notNull(),
    address:text("address").notNull(),
    logoUrl:text("logo_url").notNull(),
    logoPublicId: text("logo_public_id"), ///needed when deletein image form cloudinary
    gstin:text("gstin").notNull(),
    pharmacyLicense:varchar("pharmacy_license"),
    clinicLicense:varchar("clinic_license"),
   

})