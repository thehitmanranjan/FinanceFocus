import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema from the template
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "income" or "expense"
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  isDefault: boolean("is_default").default(false),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories, {
  name: (schema) => schema.min(1, "Category name is required"),
  type: (schema) => 
    schema.refine(val => ["income", "expense"].includes(val), {
      message: "Type must be either income or expense",
    }),
  icon: (schema) => schema.min(1, "Icon is required"),
  color: (schema) => schema.min(1, "Color is required"),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Transactions schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow().notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  amount: (schema) => schema.min(0.01, "Amount must be greater than 0"),
  date: (schema) => schema.default(new Date()),
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Budgets schema
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

export const insertBudgetSchema = createInsertSchema(budgets, {
  amount: (schema) => schema.min(0, "Budget amount cannot be negative"),
  month: (schema) => schema.min(1, "Month must be between 1 and 12").max(12, "Month must be between 1 and 12"),
  year: (schema) => schema.min(2000, "Year must be valid").max(2100, "Year must be valid"),
});

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

// Schema for extended transaction that includes category info
export const transactionWithCategorySchema = z.object({
  id: z.number(),
  amount: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) : val
  ),
  description: z.string().nullable(),
  date: z.date(),
  categoryId: z.number(),
  userId: z.number().nullable(),
  createdAt: z.date(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    type: z.string(),
    icon: z.string(),
    color: z.string(),
    isDefault: z.boolean(),
    userId: z.number().nullable(),
    createdAt: z.date(),
  }),
});

export type TransactionWithCategory = z.infer<typeof transactionWithCategorySchema>;
