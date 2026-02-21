import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

interface UpdateReportParams {
  id: bigint;
  date: string;
  todayProduction: bigint;
  despatch: bigint;
}

export function useUpdateDailyProductionReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateReportParams) => {
      if (!actor) throw new Error('Actor not available');
      
      return actor.updateDailyProductionReport(
        params.id,
        params.date,
        params.todayProduction,
        params.despatch
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyProductionReports'] });
    },
    onError: (error) => {
      console.error('Update report error:', error);
      toast.error(`Failed to update report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    },
  });
}
