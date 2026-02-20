import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, ProductionRecord, DispatchRecord } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// Production Record Queries
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

// Dispatch Record Queries
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

// Work in Hand Status Query
export function useGetWorkInHandStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['workInHandStatus'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkInHandStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}
