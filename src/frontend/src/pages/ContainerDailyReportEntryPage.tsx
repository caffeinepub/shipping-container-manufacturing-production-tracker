import { useState, useMemo, useEffect } from 'react';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { useCreateDailyProductionReport } from '../hooks/useCreateDailyProductionReport';
import { useUpdateDailyProductionReport } from '../hooks/useUpdateDailyProductionReport';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePresentationMode } from '../contexts/PresentationModeContext';

export default function ContainerDailyReportEntryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [globalDespatch, setGlobalDespatch] = useState('');
  const [productionData, setProductionData] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: operations = [], isLoading: operationsLoading, error: operationsError } = useGetAllOperations();
  const { data: allReports = [], isLoading: reportsLoading, error: reportsError } = useGetAllDailyProductionReports();
  const createMutation = useCreateDailyProductionReport();
  const updateMutation = useUpdateDailyProductionReport();
  const { actor } = useActor();
  const { isPresentationMode } = usePresentationMode();

  const existingReports = useMemo(() => {
    return allReports.filter((report) => report.date === selectedDate);
  }, [allReports, selectedDate]);

  const reportsByOperation = useMemo(() => {
    const map = new Map();
    existingReports.forEach((report) => {
      map.set(Number(report.operationId), report);
    });
    return map;
  }, [existingReports]);

  const [totalCompletedData, setTotalCompletedData] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchTotalCompleted = async () => {
      if (!actor || operations.length === 0) return;

      const totals: Record<number, number> = {};
      for (const operation of operations) {
        try {
          const total = await actor.calculateTotalCompleted(operation.operationId, selectedDate);
          totals[Number(operation.operationId)] = Number(total);
        } catch (error) {
          console.error(`Error fetching total for operation ${operation.operationId}:`, error);
          totals[Number(operation.operationId)] = 0;
        }
      }
      setTotalCompletedData(totals);
    };

    fetchTotalCompleted();
  }, [actor, operations, selectedDate, allReports]);

  useEffect(() => {
    // Pre-populate production data from existing reports
    const initialData: Record<number, string> = {};
    existingReports.forEach((report) => {
      initialData[Number(report.operationId)] = String(report.todayProduction);
    });
    setProductionData(initialData);

    // Pre-populate global despatch if all operations have the same despatch value
    if (existingReports.length > 0) {
      const firstDespatch = existingReports[0].despatch;
      const allSame = existingReports.every((r) => r.despatch === firstDespatch);
      if (allSame) {
        setGlobalDespatch(String(firstDespatch));
      }
    }
  }, [existingReports]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const despatchValue = globalDespatch ? parseInt(globalDespatch) : 0;

      if (isNaN(despatchValue) || despatchValue < 0) {
        toast.error('Invalid despatch value');
        setIsSaving(false);
        return;
      }

      // Validate all operation IDs are between 1-17
      for (const operation of operations) {
        const operationId = Number(operation.operationId);
        if (operationId < 1 || operationId > 17) {
          toast.error(`Invalid operation ID: ${operationId}. Must be between 1 and 17.`);
          setIsSaving(false);
          return;
        }
      }

      for (const operation of operations) {
        const operationId = Number(operation.operationId);
        const todayProductionStr = productionData[operationId] || '0';
        const todayProduction = parseInt(todayProductionStr);

        if (isNaN(todayProduction) || todayProduction < 0) {
          toast.error(`Invalid production value for ${operation.operationName}`);
          setIsSaving(false);
          return;
        }

        const existingReport = reportsByOperation.get(operationId);

        if (existingReport) {
          await updateMutation.mutateAsync({
            id: existingReport.id,
            date: selectedDate,
            todayProduction: BigInt(todayProduction),
            despatch: BigInt(despatchValue),
          });
        } else if (todayProduction > 0 || despatchValue > 0) {
          await createMutation.mutateAsync({
            date: selectedDate,
            operationId: BigInt(operationId),
            todayProduction: BigInt(todayProduction),
            despatch: BigInt(despatchValue),
          });
        }
      }

      toast.success('Production report saved successfully');
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error(`Failed to save production report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (operationsLoading || reportsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading report entry...</p>
        </div>
      </div>
    );
  }

  if (operationsError || reportsError) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {operationsError ? `Operations: ${operationsError}` : ''}
            {reportsError ? `Reports: ${reportsError}` : ''}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isPresentationMode) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Presentation Mode Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Report entry is hidden in presentation mode. Exit presentation mode to edit production data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Container Daily Report Entry</h1>
        <p className="text-muted-foreground mt-1">Excel-style production data entry for all 17 operations</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Production Entry Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Report Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Global Despatch (applies to all operations)
              </label>
              <Input
                type="number"
                min="0"
                value={globalDespatch}
                onChange={(e) => setGlobalDespatch(e.target.value)}
                placeholder="Enter despatch quantity"
                className="bg-background border-border font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="excel-table w-full">
              <thead>
                <tr className="bg-accent/50">
                  <th className="excel-cell excel-header text-left">Operation</th>
                  <th className="excel-cell excel-header text-right">Today Production</th>
                  <th className="excel-cell excel-header text-right">Total Completed</th>
                  <th className="excel-cell excel-header text-right">Despatch</th>
                  <th className="excel-cell excel-header text-right">In Hand</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((operation) => {
                  const operationId = Number(operation.operationId);
                  const todayProduction = productionData[operationId] || '0';
                  const totalCompleted = totalCompletedData[operationId] || 0;
                  const despatch = globalDespatch || '0';
                  const inHand = Math.max(0, totalCompleted - parseInt(despatch || '0'));

                  return (
                    <tr key={operationId} className="hover:bg-accent/30 transition-colors">
                      <td className="excel-cell font-medium">{operation.operationName}</td>
                      <td className="excel-cell text-right">
                        <Input
                          type="number"
                          min="0"
                          value={todayProduction}
                          onChange={(e) =>
                            setProductionData((prev) => ({
                              ...prev,
                              [operationId]: e.target.value,
                            }))
                          }
                          className="text-right border-0 bg-transparent focus:bg-accent/20 font-mono tabular-nums"
                        />
                      </td>
                      <td className="excel-cell text-right font-mono tabular-nums">{totalCompleted.toLocaleString()}</td>
                      <td className="excel-cell text-right font-mono tabular-nums">{parseInt(despatch || '0').toLocaleString()}</td>
                      <td className="excel-cell text-right font-mono tabular-nums text-primary font-semibold">
                        {inHand.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
