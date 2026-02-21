import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { DailyOperationProduction, Operation } from '../backend';

export interface EnrichedDailyProductionReport extends DailyOperationProduction {
  operation: Operation;
  totalCompleted: bigint;
}

export function useGetAllDailyProductionReports() {
  const { actor, isFetching } = useActor();

  return useQuery<EnrichedDailyProductionReport[]>({
    queryKey: ['dailyProductionReports'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Fetch both operations and production records
      const [operations, reports] = await Promise.all([
        actor.getAllOperations(),
        actor.getAllDailyProductionReports(),
      ]);

      // Create a map of operations by ID for quick lookup
      const operationsMap = new Map(
        operations.map((op) => [op.operationId.toString(), op])
      );

      // Enrich each report with operation details and calculate totalCompleted
      const enrichedReports = await Promise.all(
        reports.map(async (report) => {
          const operation = operationsMap.get(report.operationId.toString());
          if (!operation) {
            throw new Error(`Operation not found for ID: ${report.operationId}`);
          }

          // Get dynamically calculated total completed from backend
          const totalCompleted = await actor.calculateTotalCompleted(
            report.operationId,
            report.date
          );

          return {
            ...report,
            operation,
            totalCompleted,
          };
        })
      );

      return enrichedReports;
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}
