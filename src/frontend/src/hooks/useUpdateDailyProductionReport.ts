import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DailyProductionReport } from '../backend';

interface UpdateReportParams {
  report: DailyProductionReport;
}

export function useUpdateDailyProductionReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ report }: UpdateReportParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // Find the report ID by matching date and operation
      const allReports = await actor.getAllDailyProductionReports();
      const existingReport = allReports.find(
        (r) => r.date === report.date && r.operation.id === report.operation.id
      );
      
      if (!existingReport) {
        throw new Error('Report not found');
      }
      
      // Calculate the report ID (1-based index)
      const reportId = BigInt(allReports.indexOf(existingReport) + 1);
      
      return actor.updateDailyProductionReport(
        reportId,
        report.todayProduction,
        report.despatched,
        report.inHand
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
    },
  });
}
