import { useMemo } from 'react';
import { useGetAllDailyProductionReports } from './useGetAllDailyProductionReports';

export interface MonthlyProductionMetrics {
  totalProducedThisMonth: number;
  remainingToTarget: number;
  completionPercentage: number;
  dailyAverage: number;
}

const MONTHLY_TARGET = 100;

export function useMonthlyProductionMetrics() {
  const { data: reports = [], isLoading, error } = useGetAllDailyProductionReports();

  const metrics = useMemo<MonthlyProductionMetrics>(() => {
    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();

    // Filter reports for current month
    const currentMonthReports = reports.filter((report) => {
      if (!report.date) return false;
      const reportDate = new Date(report.date);
      return (
        reportDate.getMonth() === currentMonth &&
        reportDate.getFullYear() === currentYear
      );
    });

    // Calculate total containers produced this month
    const totalProducedThisMonth = currentMonthReports.reduce(
      (sum, report) => sum + Number(report.todayProduction),
      0
    );

    // Calculate remaining to achieve target
    const remainingToTarget = Math.max(0, MONTHLY_TARGET - totalProducedThisMonth);

    // Calculate completion percentage
    const completionPercentage = Math.min(100, (totalProducedThisMonth / MONTHLY_TARGET) * 100);

    // Calculate daily average (total produced / days elapsed in current month)
    const dailyAverage = currentDay > 0 ? totalProducedThisMonth / currentDay : 0;

    return {
      totalProducedThisMonth,
      remainingToTarget,
      completionPercentage,
      dailyAverage,
    };
  }, [reports]);

  return {
    metrics,
    isLoading,
    error,
  };
}
