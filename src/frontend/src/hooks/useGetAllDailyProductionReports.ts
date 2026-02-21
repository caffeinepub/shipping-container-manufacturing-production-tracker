import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DailyProductionReport } from '../backend';

export function useGetAllDailyProductionReports() {
  const { actor, isFetching } = useActor();

  return useQuery<DailyProductionReport[]>({
    queryKey: ['dailyProductionReports'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDailyProductionReports();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}
