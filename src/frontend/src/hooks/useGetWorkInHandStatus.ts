import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WorkInHandRecord } from '../backend';

export function useGetWorkInHandStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkInHandRecord[]>({
    queryKey: ['workInHandStatus'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkInHandStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}
