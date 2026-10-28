import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp
} from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", {
    length: 100
  }).notNull(),

  age: integer("age"),

  gender: varchar("gender", {
    length: 20
  }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull()
}); 