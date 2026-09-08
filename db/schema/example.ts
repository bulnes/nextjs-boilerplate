import { sql } from "drizzle-orm";
import { pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Referência ao schema `auth` gerenciado pelo Supabase Auth (não migrado por
 * este projeto — apenas usado para a foreign key de `owner_id`).
 */
const authSchema = pgSchema("auth");
const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

/**
 * Única tabela de dados do boilerplate: demonstra RLS default-deny (FR-026)
 * + Drizzle ORM de ponta a ponta (FR-028). Ver data-model.md §5 e
 * supabase/policies/example.sql.
 */
export const exampleItems = pgTable("example_items", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
