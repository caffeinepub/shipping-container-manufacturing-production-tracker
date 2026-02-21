import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDailyProductionReport } from '../hooks/useCreateDailyProductionReport';
import { useUpdateDailyProductionReport } from '../hooks/useUpdateDailyProductionReport';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import { useGetAllOperations } from '../hooks/useGetAllOperations';
import { useGetAllDailyProductionReports } from '../hooks/useGetAllDailyProductionReports';
import { Loader2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { DailyProductionReport } from '../backend';

interface DailyProductionReportFormProps {
  editingReport?: DailyProductionReport | null;
  onCancelEdit?: () => void;
}

export default function DailyProductionReportForm({ editingReport, onCancelEdit }: DailyProductionReportFormProps) {
  const [date, setDate] = useState('');
  const [operationId, setOperationId] = useState('');
  const [todayProduction, setTodayProduction] = useState('');
  const [despatched, setDespatched] = useState('');
  const [batchDispatch, setBatchDispatch] = useState('');

  const createReport = useCreateDailyProductionReport();
  const updateReport = useUpdateDailyProductionReport();
  const { data: role } = useGetCallerRole();
  const { data: operations = [], isLoading: operationsLoading } = useGetAllOperations();
  const { data: allReports = [], isLoading: reportsLoading } = useGetAllDailyProductionReports();

  // Calculate Total Completed based on cumulative production for selected operation
  const totalCompleted = useMemo(() => {
    if (!operationId) return 0;
    
    // Sum all previous today_production values for this operation
    const previousTotal = allReports
      .filter((report) => report.operation.id.toString() === operationId)
      .reduce((sum, report) => sum + Number(report.todayProduction), 0);
    
    // Add current today_production value
    const currentProduction = parseInt(todayProduction) || 0;
    
    return previousTotal + currentProduction;
  }, [operationId, allReports, todayProduction]);

  // Calculate In Hand automatically
  const inHand = useMemo(() => {
    const despatchedNum = parseInt(despatched) || 0;
    return Math.max(0, totalCompleted - despatchedNum);
  }, [totalCompleted, despatched]);

  useEffect(() => {
    if (editingReport) {
      setDate(editingReport.date);
      setOperationId(editingReport.operation.id.toString());
      setTodayProduction(editingReport.todayProduction.toString());
      setDespatched(editingReport.despatched.toString());
    }
  }, [editingReport]);

  // Apply batch dispatch to all operations when batch dispatch value changes
  useEffect(() => {
    if (batchDispatch && !editingReport) {
      setDespatched(batchDispatch);
    }
  }, [batchDispatch, editingReport]);

  const resetForm = () => {
    setDate('');
    setOperationId('');
    setTodayProduction('');
    setDespatched('');
    setBatchDispatch('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !operationId || !todayProduction || !despatched) {
      toast.error('Please fill in all required fields');
      return;
    }

    const todayProductionNum = parseInt(todayProduction);
    const despatchedNum = parseInt(despatched);

    if (
      isNaN(todayProductionNum) ||
      isNaN(despatchedNum) ||
      todayProductionNum < 0 ||
      despatchedNum < 0
    ) {
      toast.error('Please enter valid numbers (0 or greater)');
      return;
    }

    if (editingReport) {
      // Update existing report - only numeric values can be changed
      const reportData: DailyProductionReport = {
        date: editingReport.date,
        operation: editingReport.operation,
        todayProduction: BigInt(todayProductionNum),
        totalCompleted: BigInt(totalCompleted),
        despatched: BigInt(despatchedNum),
        inHand: BigInt(inHand),
      };

      updateReport.mutate(
        { report: reportData },
        {
          onSuccess: () => {
            toast.success('Production report updated successfully');
            resetForm();
          },
          onError: (error) => {
            toast.error(`Failed to update production report: ${error.message}`);
          },
        }
      );
    } else {
      // Create new report - backend will calculate totalCompleted automatically
      createReport.mutate(
        {
          date,
          operationId: BigInt(operationId),
          todayProduction: BigInt(todayProductionNum),
          despatched: BigInt(despatchedNum),
          inHand: BigInt(inHand),
        },
        {
          onSuccess: () => {
            toast.success('Production report added successfully');
            resetForm();
          },
          onError: (error) => {
            toast.error(`Failed to add production report: ${error.message}`);
          },
        }
      );
    }
  };

  const isSubmitting = createReport.isPending || updateReport.isPending;
  const isDisabled = role === 'viewer';
  const isEditMode = !!editingReport;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingReport ? 'Edit Production Report' : 'Admin Production Update Panel'}
          </div>
          {editingReport && !isDisabled && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Dispatch Entry - Only show when not editing */}
          {!isEditMode && !isDisabled && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="space-y-2">
                <Label htmlFor="batchDispatch" className="text-base font-semibold">
                  Apply Same Dispatch to All Operations (Optional)
                </Label>
                <Input
                  id="batchDispatch"
                  type="number"
                  min="0"
                  value={batchDispatch}
                  onChange={(e) => setBatchDispatch(e.target.value)}
                  placeholder="Enter dispatch quantity to apply to all operations"
                  disabled={isDisabled}
                  className="max-w-md"
                />
                <p className="text-xs text-muted-foreground">
                  If you enter a value here, it will automatically populate the Dispatch field below. Leave empty to enter dispatch manually.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isDisabled || isEditMode}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationId">
                Operation <span className="text-destructive">*</span>
              </Label>
              {isEditMode ? (
                <Input
                  id="operationId"
                  type="text"
                  value={editingReport?.operation.name || ''}
                  readOnly
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              ) : (
                <Select 
                  value={operationId} 
                  onValueChange={setOperationId} 
                  required 
                  disabled={isDisabled || operationsLoading}
                >
                  <SelectTrigger id="operationId">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    {operations.map((operation) => (
                      <SelectItem key={operation.id.toString()} value={operation.id.toString()}>
                        {operation.id}. {operation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="todayProduction">
                Today's Production <span className="text-destructive">*</span>
              </Label>
              <Input
                id="todayProduction"
                type="number"
                min="0"
                value={todayProduction}
                onChange={(e) => setTodayProduction(e.target.value)}
                placeholder="0"
                required
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCompleted">
                Total Completed (Auto-calculated)
              </Label>
              <Input
                id="totalCompleted"
                type="number"
                value={totalCompleted}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed tabular-nums"
              />
              <p className="text-xs text-muted-foreground">
                Cumulative total from database + today's production
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="despatched">
                Dispatch <span className="text-destructive">*</span>
              </Label>
              <Input
                id="despatched"
                type="number"
                min="0"
                value={despatched}
                onChange={(e) => setDespatched(e.target.value)}
                placeholder="0"
                required
                disabled={isDisabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inHand">In Hand (Auto-calculated)</Label>
              <Input
                id="inHand"
                type="number"
                value={inHand}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed tabular-nums"
              />
              <p className="text-xs text-muted-foreground">
                Total Completed - Dispatch
              </p>
            </div>
          </div>

          {!isDisabled && (
            <Button type="submit" disabled={isSubmitting || reportsLoading} className="w-full md:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingReport ? 'Updating...' : 'Saving...'}
                </>
              ) : editingReport ? (
                'Update Report'
              ) : (
                'Add Report'
              )}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
