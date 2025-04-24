import { db } from "./index";
import * as schema from "@shared/schema";
import { eq, and } from "drizzle-orm";

const defaultCategories = [
  // Income categories
  { name: "Salary", type: "income", icon: "banknote", color: "#4CAF50", isDefault: true },
  { name: "Business", type: "income", icon: "briefcase", color: "#4CAF50", isDefault: true },
  { name: "Investments", type: "income", icon: "trending-up", color: "#4CAF50", isDefault: true },
  { name: "Extra Income", type: "income", icon: "plus-circle", color: "#4CAF50", isDefault: true },
  { name: "Gifts", type: "income", icon: "gift", color: "#4CAF50", isDefault: true },
  
  // Expense categories
  { name: "Food & Drinks", type: "expense", icon: "utensils", color: "#FF5722", isDefault: true },
  { name: "Shopping", type: "expense", icon: "shopping-bag", color: "#E91E63", isDefault: true },
  { name: "Transport", type: "expense", icon: "map", color: "#2196F3", isDefault: true },
  { name: "Home", type: "expense", icon: "home", color: "#795548", isDefault: true },
  { name: "Bills & Utilities", type: "expense", icon: "credit-card", color: "#673AB7", isDefault: true },
  { name: "Entertainment", type: "expense", icon: "film", color: "#009688", isDefault: true },
  { name: "Health", type: "expense", icon: "activity", color: "#F44336", isDefault: true },
  { name: "Education", type: "expense", icon: "book", color: "#3F51B5", isDefault: true },
];

const sampleTransactions = [
  {
    amount: 2500.00,
    description: "Monthly salary",
    date: new Date(2023, 4, 1, 9, 0), // May 1, 9:00 AM
    categoryName: "Salary",
  },
  {
    amount: -45.80,
    description: "Grocery shopping",
    date: new Date(2023, 4, 15, 10, 30), // May 15, 10:30 AM
    categoryName: "Food & Drinks",
  },
  {
    amount: -85.40,
    description: "Electricity bill",
    date: new Date(2023, 4, 3, 14, 15), // May 3, 2:15 PM
    categoryName: "Bills & Utilities",
  },
  {
    amount: -24.50,
    description: "Uber ride",
    date: new Date(2023, 4, 5, 20, 20), // May 5, 8:20 PM
    categoryName: "Transport",
  },
];

async function seed() {
  try {
    // Create demo user if it doesn't exist
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.username, "demo"),
    });

    let userId: number;
    if (!existingUser) {
      const [user] = await db
        .insert(schema.users)
        .values({
          username: "demo",
          password: "demo", // In a real app, this would be hashed
        })
        .returning();
      userId = user.id;
      console.log("Created demo user");
    } else {
      userId = existingUser.id;
      console.log("Using existing demo user");
    }

    // Seed default categories if they don't exist
    for (const category of defaultCategories) {
      const existingCategory = await db.query.categories.findFirst({
        where: and(
          eq(schema.categories.name, category.name),
          eq(schema.categories.userId, userId)
        ),
      });

      if (!existingCategory) {
        await db.insert(schema.categories).values({
          ...category,
          userId,
        });
        console.log(`Created category: ${category.name}`);
      }
    }

    // Seed sample transactions
    for (const transaction of sampleTransactions) {
      // Find the category by name
      const category = await db.query.categories.findFirst({
        where: and(
          eq(schema.categories.name, transaction.categoryName),
          eq(schema.categories.userId, userId)
        ),
      });

      if (category) {
        // Check if transaction already exists to avoid duplicates
        const existingTransaction = await db.query.transactions.findFirst({
          where: and(
            eq(schema.transactions.amount, String(Math.abs(transaction.amount)) as any),
            eq(schema.transactions.description, transaction.description || ""),
            eq(schema.transactions.userId, userId)
          ),
        });

        if (!existingTransaction) {
          await db.insert(schema.transactions).values({
            amount: String(Math.abs(transaction.amount)) as any, // Store absolute value
            description: transaction.description,
            date: transaction.date,
            categoryId: category.id,
            userId,
          });
          console.log(`Created transaction: ${transaction.description}`);
        }
      }
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
