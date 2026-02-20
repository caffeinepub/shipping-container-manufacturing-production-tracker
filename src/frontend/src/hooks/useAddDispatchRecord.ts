import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DispatchRecord } from '../backend';

export function useAddDispatchRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: DispatchRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDispatchRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispatchRecords'] });
      queryClient.invalidateQueries({ queryKey: ['workInHandStatus'] });
    },
  });
}
