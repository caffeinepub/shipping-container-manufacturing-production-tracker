import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface CreateReportParams {
  date: string;
  operationId: bigint;
  todayProduction: bigint;
  despatched: bigint;
  inHand: bigint;
}

export function useCreateDailyProductionReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateReportParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDailyProductionReport(
        params.date,
        params.operationId,
        params.todayProduction,
        params.despatched,
        params.inHand
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
    },
  });
}
