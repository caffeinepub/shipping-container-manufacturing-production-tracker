import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ProductionRecord } from '../backend';

export function useAddProductionRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: ProductionRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProductionRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productionRecords'] });
      queryClient.invalidateQueries({ queryKey: ['workInHandStatus'] });
    },
  });
}
