import { formatTransactionDate } from "@/lib/date-utils";
import { formatTransactionAmount } from "@/lib/formatters";
import { useSummary } from "@/hooks/use-transactions";
import { useDate } from "@/contexts/DateContext";
import { getQueryTimeFormat } from "@/lib/date-utils";
import CategoryIcon from "./CategoryIcon";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsList() {
  const { timeRange, startDate, endDate } = useDate();
  const startDateStr = getQueryTimeFormat(startDate);
  const endDateStr = getQueryTimeFormat(endDate);
  
  const { data: summary, isLoading } = useSummary(
    timeRange,
    startDateStr,
    endDateStr
  );

  if (isLoading) {
    return (
      <div className="flex-1 px-4 pb-20">
        <Skeleton className="h-7 w-40 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-3 mb-3 flex items-center">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary || summary.transactions.length === 0) {
    return (
      <div className="flex-1 px-4 pb-20">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <div className="bg-white rounded-lg shadow-sm p-5 text-center">
          <p className="text-neutral-700">No transactions found for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 pb-20">
      <h2 className="text-lg font-semibold mb-2">Transactions</h2>
      
      {summary.transactions.map((transaction) => (
        <div key={transaction.id} className="bg-white rounded-lg shadow-sm p-3 mb-3 flex items-center">
          <CategoryIcon 
            name={transaction.category.icon} 
            color={transaction.category.color} 
            className="mr-3"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-medium">{transaction.category.name}</p>
              <p className={`font-semibold ${transaction.category.type === "income" ? "text-primary" : "text-secondary"}`}>
                {formatTransactionAmount(transaction.amount as number, transaction.category.type)}
              </p>
            </div>
            <div className="flex justify-between text-sm text-neutral-700">
              <p>{transaction.description || transaction.category.name}</p>
              <p>{formatTransactionDate(transaction.date)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
