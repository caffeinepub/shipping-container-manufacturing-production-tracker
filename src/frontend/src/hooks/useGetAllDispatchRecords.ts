import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DispatchRecord } from '../backend';

export function useGetAllDispatchRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DispatchRecord[]>({
    queryKey: ['dispatchRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDispatchRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}
