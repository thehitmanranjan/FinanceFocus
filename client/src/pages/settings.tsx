import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import { useCategories, useCreateCategory } from "@/hooks/use-categories";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryIcon from "@/components/CategoryIcon";

// Define the category form schema
const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  icon: z.string().min(1, "Icon is required"),
  color: z.string().min(1, "Color is required"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("categories");
  const { data: allCategories } = useCategories();
  const { data: incomeCategories } = useCategories("income");
  const { data: expenseCategories } = useCategories("expense");
  const createCategory = useCreateCategory();
  
  // Initialize the form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      type: "expense",
      icon: "activity",
      color: "#FF5722",
    },
  });

  // Handle form submission
  const onSubmit = async (values: CategoryFormValues) => {
    try {
      await createCategory.mutateAsync(values);
      form.reset({
        name: "",
        type: "expense",
        icon: "activity",
        color: "#FF5722",
      });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const icons = [
    { value: "activity", label: "Health" },
    { value: "book", label: "Education" },
    { value: "briefcase", label: "Work" },
    { value: "credit-card", label: "Bills" },
    { value: "film", label: "Entertainment" },
    { value: "gift", label: "Gift" },
    { value: "home", label: "Home" },
    { value: "map", label: "Transport" },
    { value: "shopping-bag", label: "Shopping" },
    { value: "utensils", label: "Food" },
    { value: "banknote", label: "Salary" },
    { value: "plus-circle", label: "Other Income" },
    { value: "trending-up", label: "Investments" },
  ];

  const colors = [
    { value: "#FF5722", label: "Orange" },
    { value: "#E91E63", label: "Pink" },
    { value: "#9C27B0", label: "Purple" },
    { value: "#673AB7", label: "Deep Purple" },
    { value: "#3F51B5", label: "Indigo" },
    { value: "#2196F3", label: "Blue" },
    { value: "#03A9F4", label: "Light Blue" },
    { value: "#00BCD4", label: "Cyan" },
    { value: "#009688", label: "Teal" },
    { value: "#4CAF50", label: "Green" },
    { value: "#8BC34A", label: "Light Green" },
    { value: "#CDDC39", label: "Lime" },
    { value: "#FFC107", label: "Amber" },
    { value: "#FF9800", label: "Orange" },
    { value: "#795548", label: "Brown" },
    { value: "#607D8B", label: "Blue Grey" },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Add New Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Groceries, Rent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="expense">Expense</SelectItem>
                              <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {icons.map((icon) => (
                                <SelectItem key={icon.value} value={icon.value}>
                                  {icon.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {colors.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center">
                                    <div 
                                      className="w-4 h-4 rounded-full mr-2" 
                                      style={{ backgroundColor: color.value }}
                                    ></div>
                                    {color.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createCategory.isPending}
                    >
                      {createCategory.isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-semibold mb-3">Income Categories</h2>
            {!incomeCategories ? (
              <p>Loading categories...</p>
            ) : incomeCategories.length === 0 ? (
              <p className="text-neutral-700">No income categories found.</p>
            ) : (
              <div className="space-y-3 mb-6">
                {incomeCategories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <CategoryIcon 
                          name={category.icon} 
                          color={category.color} 
                          size={18}
                          className="mr-3 w-8 h-8" 
                        />
                        <div className="flex-1">
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-neutral-700">{category.isDefault ? "Default" : "Custom"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-3">Expense Categories</h2>
            {!expenseCategories ? (
              <p>Loading categories...</p>
            ) : expenseCategories.length === 0 ? (
              <p className="text-neutral-700">No expense categories found.</p>
            ) : (
              <div className="space-y-3">
                {expenseCategories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <CategoryIcon 
                          name={category.icon} 
                          color={category.color} 
                          size={18}
                          className="mr-3 w-8 h-8" 
                        />
                        <div className="flex-1">
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-neutral-700">{category.isDefault ? "Default" : "Custom"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Currency</h3>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Theme</h3>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full mt-4">Clear All Data</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all your transactions, categories, and budget settings.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Yes, clear all data</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
