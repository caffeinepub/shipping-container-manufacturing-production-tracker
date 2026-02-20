import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DailyProductionReport } from '../backend';

export function useCreateDailyProductionReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: DailyProductionReport) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDailyProductionReport(report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
    },
  });
}
