import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProductionRecord } from '../backend';

export function useGetAllProductionRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ProductionRecord[]>({
    queryKey: ['productionRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductionRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}
