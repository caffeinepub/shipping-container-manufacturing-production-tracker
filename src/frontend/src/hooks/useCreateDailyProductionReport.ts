import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface CreateReportParams {
  date: string;
  operationId: bigint;
  todayProduction: bigint;
  despatch: bigint;
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
        params.despatch
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
    },
    onError: (error) => {
      console.error('Create report error:', error);
      toast.error(`Failed to create report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
}
