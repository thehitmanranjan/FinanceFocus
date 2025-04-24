import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, and, or, desc, between, gte, lte, SQL } from "drizzle-orm";
import { format } from "date-fns";

export const storage = {
  // Category operations
  async getCategories(userId: number | null) {
    return await db.query.categories.findMany({
      where: userId ? eq(schema.categories.userId, userId) : undefined,
      orderBy: [desc(schema.categories.isDefault), schema.categories.name],
    });
  },

  async getCategoriesByType(type: string, userId: number | null) {
    return await db.query.categories.findMany({
      where: and(
        eq(schema.categories.type, type),
        userId ? eq(schema.categories.userId, userId) : undefined
      ),
      orderBy: [desc(schema.categories.isDefault), schema.categories.name],
    });
  },

  async getCategoryById(id: number) {
    return await db.query.categories.findFirst({
      where: eq(schema.categories.id, id),
    });
  },

  async createCategory(data: schema.InsertCategory) {
    const [category] = await db.insert(schema.categories).values(data).returning();
    return category;
  },

  async updateCategory(id: number, data: Partial<schema.InsertCategory>) {
    const [updatedCategory] = await db
      .update(schema.categories)
      .set(data)
      .where(eq(schema.categories.id, id))
      .returning();
    return updatedCategory;
  },

  async deleteCategory(id: number) {
    // First check if there are transactions associated with this category
    const transactions = await db.query.transactions.findMany({
      where: eq(schema.transactions.categoryId, id),
      limit: 1,
    });

    if (transactions.length > 0) {
      throw new Error("Cannot delete category with associated transactions");
    }

    const [deletedCategory] = await db
      .delete(schema.categories)
      .where(eq(schema.categories.id, id))
      .returning();
    return deletedCategory;
  },

  // Transaction operations
  async getTransactions(userId: number | null) {
    return await db.query.transactions.findMany({
      where: userId ? eq(schema.transactions.userId, userId) : undefined,
      with: {
        category: true,
      },
      orderBy: desc(schema.transactions.date),
    });
  },

  async getTransactionsByDateRange(startDate: Date, endDate: Date, userId: number | null) {
    return await db.query.transactions.findMany({
      where: and(
        userId ? eq(schema.transactions.userId, userId) : undefined,
        gte(schema.transactions.date, startDate),
        lte(schema.transactions.date, endDate)
      ),
      with: {
        category: true,
      },
      orderBy: desc(schema.transactions.date),
    });
  },

  async getTransactionById(id: number) {
    return await db.query.transactions.findFirst({
      where: eq(schema.transactions.id, id),
      with: {
        category: true,
      },
    });
  },

  async createTransaction(data: schema.InsertTransaction) {
    const [transaction] = await db.insert(schema.transactions).values(data).returning();
    return transaction;
  },

  async updateTransaction(id: number, data: Partial<schema.InsertTransaction>) {
    const [updatedTransaction] = await db
      .update(schema.transactions)
      .set(data)
      .where(eq(schema.transactions.id, id))
      .returning();
    return updatedTransaction;
  },

  async deleteTransaction(id: number) {
    const [deletedTransaction] = await db
      .delete(schema.transactions)
      .where(eq(schema.transactions.id, id))
      .returning();
    return deletedTransaction;
  },

  // Budget operations
  async getBudgets(userId: number | null, month: number, year: number) {
    return await db.query.budgets.findMany({
      where: and(
        userId ? eq(schema.budgets.userId, userId) : undefined,
        eq(schema.budgets.month, month),
        eq(schema.budgets.year, year)
      ),
      with: {
        category: true,
      },
    });
  },

  async getBudgetById(id: number) {
    return await db.query.budgets.findFirst({
      where: eq(schema.budgets.id, id),
      with: {
        category: true,
      },
    });
  },

  async createBudget(data: schema.InsertBudget) {
    // Check if a budget for this category, month, and year already exists
    const existingBudget = await db.query.budgets.findFirst({
      where: and(
        eq(schema.budgets.categoryId, data.categoryId),
        eq(schema.budgets.month, data.month),
        eq(schema.budgets.year, data.year),
        data.userId ? eq(schema.budgets.userId, data.userId) : undefined
      ),
    });

    if (existingBudget) {
      // Update existing budget instead of creating a new one
      const [updatedBudget] = await db
        .update(schema.budgets)
        .set({ amount: data.amount })
        .where(eq(schema.budgets.id, existingBudget.id))
        .returning();
      return updatedBudget;
    } else {
      // Create new budget
      const [budget] = await db.insert(schema.budgets).values(data).returning();
      return budget;
    }
  },

  async updateBudget(id: number, data: Partial<schema.InsertBudget>) {
    const [updatedBudget] = await db
      .update(schema.budgets)
      .set(data)
      .where(eq(schema.budgets.id, id))
      .returning();
    return updatedBudget;
  },

  async deleteBudget(id: number) {
    const [deletedBudget] = await db
      .delete(schema.budgets)
      .where(eq(schema.budgets.id, id))
      .returning();
    return deletedBudget;
  },

  // Summary operations
  async getSummaryByDateRange(startDate: Date, endDate: Date, userId: number | null) {
    const transactions = await this.getTransactionsByDateRange(startDate, endDate, userId);
    
    // Calculate totals
    let income = 0;
    let expense = 0;
    const categoryTotals: Record<number, { 
      id: number, 
      name: string, 
      type: string, 
      color: string, 
      icon: string, 
      amount: number 
    }> = {};

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount as any);
      if (transaction.category.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }

      // Add to category totals
      if (!categoryTotals[transaction.categoryId]) {
        categoryTotals[transaction.categoryId] = {
          id: transaction.categoryId,
          name: transaction.category.name,
          type: transaction.category.type,
          color: transaction.category.color,
          icon: transaction.category.icon,
          amount: 0
        };
      }
      categoryTotals[transaction.categoryId].amount += amount;
    });

    // Convert categoryTotals to array
    const categoryData = Object.values(categoryTotals).sort((a, b) => b.amount - a.amount);

    return {
      income,
      expense,
      balance: income - expense,
      categoryData,
      transactions,
      period: {
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd')
      }
    };
  }
};
