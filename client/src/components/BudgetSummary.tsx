import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { formatCurrency } from "@/lib/formatters";
import { useSummary } from "@/hooks/use-transactions";
import { useDate } from "@/contexts/DateContext";
import { getQueryTimeFormat } from "@/lib/date-utils";
import { Skeleton } from "@/components/ui/skeleton";

Chart.register(...registerables);

export default function BudgetSummary() {
  const { timeRange, startDate, endDate } = useDate();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const startDateStr = getQueryTimeFormat(startDate);
  const endDateStr = getQueryTimeFormat(endDate);
  
  const { data: summary, isLoading } = useSummary(
    timeRange,
    startDateStr,
    endDateStr
  );

  useEffect(() => {
    if (!chartRef.current || !summary) return;

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const expenseCategories = summary.categoryData.filter(
      (cat) => cat.type === "expense"
    );

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: expenseCategories.map((cat) => cat.name),
        datasets: [
          {
            data: expenseCategories.map((cat) => cat.amount),
            backgroundColor: expenseCategories.map((cat) => cat.color),
            borderWidth: 0,
            cutout: "70%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw as number;
                const percentage = ((value / summary.expense) * 100).toFixed(1);
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [summary]);

  if (isLoading) {
    return (
      <div className="py-6 px-4 relative flex flex-col items-center">
        <div className="aspect-square w-[280px] relative">
          <Skeleton className="h-full w-full rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="text-center">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 relative">
      <div className="aspect-square max-w-[280px] mx-auto relative">
        <canvas ref={chartRef} width="280" height="280"></canvas>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-sm text-neutral-700">Balance</p>
          <p className="text-2xl font-bold">
            {summary ? formatCurrency(summary.balance) : "$0.00"}
          </p>
          <div className="flex justify-center gap-6 mt-2">
            <div className="text-center">
              <p className="text-xs text-neutral-700">Income</p>
              <p className="text-sm font-semibold text-primary">
                {summary ? formatCurrency(summary.income) : "$0.00"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-700">Expense</p>
              <p className="text-sm font-semibold text-secondary">
                {summary ? formatCurrency(summary.expense) : "$0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
