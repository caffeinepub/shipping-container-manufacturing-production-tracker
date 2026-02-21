import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useGetAllDailyProductionReports } from './useGetAllDailyProductionReports';

interface MonthlyMetrics {
  totalProduced: number;
  remainingToTarget: number;
  completionPercentage: number;
  dailyAverage: number;
  capacityUtilization: number;
  productionEfficiency: number;
  estimatedMonthlyOutput: number;
}

export function useMonthlyProductionMetrics() {
  const { data: allReports = [], isLoading } = useGetAllDailyProductionReports();

  const metrics = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Filter reports for current month
    const monthlyReports = allReports.filter((report) => {
      const reportDate = new Date(report.date);
      return (
        reportDate.getMonth() === currentMonth &&
        reportDate.getFullYear() === currentYear
      );
    });

    // Calculate total production for the month
    const totalProduced = monthlyReports.reduce(
      (sum, report) => sum + Number(report.todayProduction),
      0
    );

    // Monthly target is 100 containers
    const monthlyTarget = 100;
    const remainingToTarget = Math.max(0, monthlyTarget - totalProduced);
    const completionPercentage = Math.min(100, Math.round((totalProduced / monthlyTarget) * 100));

    // Calculate daily average
    const dailyAverage = currentDay > 0 ? totalProduced / currentDay : 0;

    // Calculate capacity utilization (assuming max capacity of 150 containers/month)
    const maxCapacity = 150;
    const capacityUtilization = Math.min(100, Math.round((totalProduced / maxCapacity) * 100));

    // Calculate production efficiency (consistency metric)
    // Based on variance from target daily production (100/30 = 3.33 per day)
    const targetDailyProduction = monthlyTarget / daysInMonth;
    const efficiency = dailyAverage > 0 
      ? Math.min(100, Math.round((Math.min(dailyAverage, targetDailyProduction) / targetDailyProduction) * 100))
      : 0;

    // Estimated monthly output projection
    const estimatedMonthlyOutput = dailyAverage * daysInMonth;

    return {
      totalProduced,
      remainingToTarget,
      completionPercentage,
      dailyAverage,
      capacityUtilization,
      productionEfficiency: efficiency,
      estimatedMonthlyOutput,
    };
  }, [allReports]);

  return useQuery<MonthlyMetrics>({
    queryKey: ['monthlyProductionMetrics', metrics],
    queryFn: async () => metrics,
    enabled: !isLoading,
  });
}
