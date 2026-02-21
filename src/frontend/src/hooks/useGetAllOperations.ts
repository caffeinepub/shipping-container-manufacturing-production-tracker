import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Operation } from '../backend';

export function useGetAllOperations() {
  const { actor, isFetching } = useActor();

  return useQuery<Operation[]>({
    queryKey: ['operations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOperations();
    },
    enabled: !!actor && !isFetching,
  });
}
