import { useState } from "react";
import Header from "@/components/Header";
import DateSelector from "@/components/DateSelector";
import TimeRangeSelector from "@/components/TimeRangeSelector";
import BudgetSummary from "@/components/BudgetSummary";
import TransactionsList from "@/components/TransactionsList";
import AddTransactionSheet from "@/components/AddTransactionSheet";
import { Minus, Plus } from "lucide-react";

export default function Home() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");

  const handleAddExpense = () => {
    setTransactionType("expense");
    setIsAddTransactionOpen(true);
  };

  const handleAddIncome = () => {
    setTransactionType("income");
    setIsAddTransactionOpen(true);
  };

  const handleCloseSheet = () => {
    setIsAddTransactionOpen(false);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white relative">
      <Header />
      <DateSelector />
      <TimeRangeSelector />
      <BudgetSummary />
      <TransactionsList />

      {/* Action Buttons */}
      <div className="fixed bottom-5 inset-x-0 flex justify-center gap-4 px-4 max-w-md mx-auto">
        <button
          onClick={handleAddExpense}
          className="bg-secondary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <Minus className="w-6 h-6" />
        </button>
        <button
          onClick={handleAddIncome}
          className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Add Transaction Sheet */}
      <AddTransactionSheet
        isOpen={isAddTransactionOpen}
        transactionType={transactionType}
        onClose={handleCloseSheet}
      />
    </div>
  );
}
