import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { TransactionWithCategory } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useTransactions(timeRange: string, startDateStr?: string, endDateStr?: string) {
  let queryParams = `timeRange=${timeRange}`;
  
  if (startDateStr && endDateStr) {
    queryParams += `&startDate=${startDateStr}&endDate=${endDateStr}`;
  }

  return useQuery<TransactionWithCategory[]>({
    queryKey: ['/api/transactions', queryParams],
  });
}

export function useTransaction(id: number) {
  return useQuery<TransactionWithCategory>({
    queryKey: ['/api/transactions', id],
    enabled: !!id,
  });
}

export function useSummary(timeRange: string, startDateStr?: string, endDateStr?: string) {
  let queryParams = `timeRange=${timeRange}`;
  
  if (startDateStr && endDateStr) {
    queryParams += `&startDate=${startDateStr}&endDate=${endDateStr}`;
  }

  return useQuery<{
    income: number;
    expense: number;
    balance: number;
    categoryData: {
      id: number;
      name: string;
      type: string;
      color: string;
      icon: string;
      amount: number;
    }[];
    transactions: TransactionWithCategory[];
    period: {
      start: string;
      end: string;
    };
  }>({
    queryKey: ['/api/summary', queryParams],
  });
}

export function useCreateTransaction() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary"] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add transaction",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTransaction() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest("PUT", `/api/transactions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary"] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTransaction() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/transactions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/summary"] });
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });
}
