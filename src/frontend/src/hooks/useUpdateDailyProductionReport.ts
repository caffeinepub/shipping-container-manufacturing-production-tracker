import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DailyProductionReport } from '../backend';

export function useUpdateDailyProductionReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ report }: { report: DailyProductionReport }) => {
      if (!actor) throw new Error('Actor not available');
      const allReports = await actor.getAllDailyProductionReports();
      const existingReport = allReports.find(
        (r) => r.date === report.date && r.operationName === report.operationName
      );
      if (!existingReport) {
        throw new Error('Report not found');
      }
      const reportId = allReports.indexOf(existingReport) + 1;
      return actor.updateDailyProductionReport(BigInt(reportId), report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
    },
  });
}
