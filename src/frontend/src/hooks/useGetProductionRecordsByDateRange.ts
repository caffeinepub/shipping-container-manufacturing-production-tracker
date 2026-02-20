import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProductionRecord } from '../backend';

export function useGetProductionRecordsByDateRange(startDate: string, endDate: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductionRecord[]>({
    queryKey: ['productionRecords', startDate, endDate],
    queryFn: async () => {
      if (!actor) return [];
      if (!startDate || !endDate) {
        return actor.getAllProductionRecords();
      }
      return actor.getProductionRecordsByDateRange(startDate, endDate);
    },
    enabled: !!actor && !actorFetching,
  });
}
