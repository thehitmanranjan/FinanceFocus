import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { useCategories } from "@/hooks/use-categories";
import { formatCurrency } from "@/lib/formatters";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CategoryIcon from "@/components/CategoryIcon";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

// Define the budget form schema
const budgetFormSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    {
      message: "Amount must be a positive number",
    }
  ),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export default function Budget() {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Get expense categories for the budget form
  const { data: categories } = useCategories("expense");
  
  // Fetch budgets for the selected month and year
  const { data: budgets, isLoading: isBudgetsLoading } = useQuery({
    queryKey: ['/api/budgets', `month=${selectedMonth}&year=${selectedYear}`],
  });

  // Initialize the form
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      categoryId: "",
      amount: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: BudgetFormValues) => {
    try {
      await apiRequest("POST", "/api/budgets", {
        categoryId: parseInt(values.categoryId),
        amount: parseFloat(values.amount),
        month: selectedMonth,
        year: selectedYear,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      
      toast({
        title: "Success",
        description: "Budget set successfully",
      });
      
      form.reset({
        categoryId: "",
        amount: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set budget",
        variant: "destructive",
      });
    }
  };

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return { value: year, label: year.toString() };
  });

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Budget Planning</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Set Monthly Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Month</label>
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(val) => setSelectedMonth(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Year</label>
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(val) => setSelectedYear(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value.toString()}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!categories ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-neutral-700">$</span>
                          </div>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Set Budget
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <h2 className="text-xl font-semibold mb-3">Current Budgets</h2>
        {isBudgetsLoading ? (
          <p>Loading budgets...</p>
        ) : !budgets || budgets.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center text-neutral-700">
              No budgets set for this month.
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget: any) => (
            <Card key={budget.id} className="mb-3">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CategoryIcon 
                    name={budget.category.icon} 
                    color={budget.category.color} 
                    className="mr-3" 
                  />
                  <div className="flex-1">
                    <p className="font-medium">{budget.category.name}</p>
                    <p className="text-lg font-semibold">{formatCurrency(parseFloat(budget.amount))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  );
}
