import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Operation } from '../backend';

export function useGetAllOperations() {
  const { actor, isFetching } = useActor();

  return useQuery<Operation[]>({
    queryKey: ['operations'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllOperations();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
