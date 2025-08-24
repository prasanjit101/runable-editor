import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createUpdateSchema, createInsertSchema } from 'drizzle-zod';
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";

export const component = sqliteTable("component", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  code: text('code').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export type Component = typeof component.$inferSelect;
export const selectComponentSchema = createSelectSchema(component);
export const insertComponentSchema = createInsertSchema(component);
export const updateComponentSchema = createUpdateSchema(component);
export type ComponentInsert = z.infer<typeof insertComponentSchema>;
export type ComponentUpdate = z.infer<typeof updateComponentSchema>;
export type ComponentSelect = z.infer<typeof selectComponentSchema>;
