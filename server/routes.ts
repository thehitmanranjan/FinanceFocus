import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as schema from "@shared/schema";
import { z } from "zod";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO } from "date-fns";
import { ZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Helper function to handle errors
  const handleError = (res: any, error: any) => {
    console.error("API Error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.errors 
      });
    }
    return res.status(500).json({ 
      message: error.message || "Internal server error" 
    });
  };

  // User routes - simplified for demo
  app.get("/api/user", async (req, res) => {
    try {
      // For demo purposes, we'll just use the demo user
      const user = { id: 1, username: "demo" };
      return res.json(user);
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const type = req.query.type as string | undefined;
      let categories;
      
      if (type && (type === "income" || type === "expense")) {
        categories = await storage.getCategoriesByType(type, userId);
      } else {
        categories = await storage.getCategories(userId);
      }
      
      return res.json(categories);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json(category);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const data = schema.insertCategorySchema.parse({ ...req.body, userId });
      const category = await storage.createCategory(data);
      return res.status(201).json(category);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = schema.insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, data);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json(category);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.deleteCategory(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json({ message: "Category deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const { timeRange, startDate, endDate } = req.query;
      
      let start: Date;
      let end: Date;
      
      if (startDate && endDate) {
        // Custom date range
        start = startOfDay(parseISO(startDate as string));
        end = endOfDay(parseISO(endDate as string));
      } else {
        // Default time ranges
        const now = new Date();
        
        switch (timeRange) {
          case "day":
            start = startOfDay(now);
            end = endOfDay(now);
            break;
          case "week":
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
          case "month":
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
          case "year":
            start = startOfYear(now);
            end = endOfYear(now);
            break;
          default:
            // Default to current month
            start = startOfMonth(now);
            end = endOfMonth(now);
        }
      }
      
      const transactions = await storage.getTransactionsByDateRange(start, end, userId);
      return res.json(transactions);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransactionById(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      return res.json(transaction);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const data = schema.insertTransactionSchema.parse({ ...req.body, userId });
      const transaction = await storage.createTransaction(data);
      return res.status(201).json(transaction);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = schema.insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(id, data);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      return res.json(transaction);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.deleteTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      return res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Budget routes
  app.get("/api/budgets", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      
      const budgets = await storage.getBudgets(userId, month, year);
      return res.json(budgets);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const data = schema.insertBudgetSchema.parse({ ...req.body, userId });
      const budget = await storage.createBudget(data);
      return res.status(201).json(budget);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.put("/api/budgets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = schema.insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(id, data);
      
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      return res.json(budget);
    } catch (error) {
      return handleError(res, error);
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const budget = await storage.deleteBudget(id);
      
      if (!budget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      
      return res.json({ message: "Budget deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  });

  // Summary routes
  app.get("/api/summary", async (req, res) => {
    try {
      const userId = 1; // Demo user ID
      const { timeRange, startDate, endDate } = req.query;
      
      let start: Date;
      let end: Date;
      
      if (startDate && endDate) {
        // Custom date range
        start = startOfDay(parseISO(startDate as string));
        end = endOfDay(parseISO(endDate as string));
      } else {
        // Default time ranges
        const now = new Date();
        
        switch (timeRange) {
          case "day":
            start = startOfDay(now);
            end = endOfDay(now);
            break;
          case "week":
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
          case "month":
            start = startOfMonth(now);
            end = endOfMonth(now);
            break;
          case "year":
            start = startOfYear(now);
            end = endOfYear(now);
            break;
          default:
            // Default to current month
            start = startOfMonth(now);
            end = endOfMonth(now);
        }
      }
      
      const summary = await storage.getSummaryByDateRange(start, end, userId);
      return res.json(summary);
    } catch (error) {
      return handleError(res, error);
    }
  });

  return httpServer;
}
