import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDailyProductionReport } from '../hooks/useCreateDailyProductionReport';
import { useUpdateDailyProductionReport } from '../hooks/useUpdateDailyProductionReport';
import { Loader2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';
import { DailyProductionReport } from '../backend';

const DEFAULT_OPERATIONS = [
  'Boxing',
  'Welding/Finishing',
  'Rear Wall',
  'Front Wall',
  'Side Wall',
  'Roof',
  'Rear Door',
  'Blasting & Primer',
  'Final Paint',
  'Gasket',
  'DLM',
  'Plywood',
  'Floor Screw',
  'Decal',
  'Data Plate',
  'Sikha',
  'Black Paint',
];

interface DailyProductionReportFormProps {
  editingReport?: DailyProductionReport | null;
  onCancelEdit?: () => void;
}

export default function DailyProductionReportForm({ editingReport, onCancelEdit }: DailyProductionReportFormProps) {
  const [date, setDate] = useState('');
  const [operationName, setOperationName] = useState('');
  const [todayProduction, setTodayProduction] = useState('');
  const [totalCompleted, setTotalCompleted] = useState('');
  const [despatched, setDespatched] = useState('');

  const createReport = useCreateDailyProductionReport();
  const updateReport = useUpdateDailyProductionReport();

  // Calculate In Hand automatically
  const calculateInHand = (): number => {
    const totalCompletedNum = parseInt(totalCompleted) || 0;
    const despatchedNum = parseInt(despatched) || 0;
    return Math.max(0, totalCompletedNum - despatchedNum);
  };

  const inHand = calculateInHand();

  useEffect(() => {
    if (editingReport) {
      setDate(editingReport.date);
      setOperationName(editingReport.operationName);
      setTodayProduction(editingReport.todayProduction.toString());
      setTotalCompleted(editingReport.totalCompleted.toString());
      setDespatched(editingReport.despatched.toString());
    }
  }, [editingReport]);

  const resetForm = () => {
    setDate('');
    setOperationName('');
    setTodayProduction('');
    setTotalCompleted('');
    setDespatched('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !operationName || !todayProduction || !totalCompleted || !despatched) {
      toast.error('Please fill in all required fields');
      return;
    }

    const todayProductionNum = parseInt(todayProduction);
    const totalCompletedNum = parseInt(totalCompleted);
    const despatchedNum = parseInt(despatched);

    if (
      isNaN(todayProductionNum) ||
      isNaN(totalCompletedNum) ||
      isNaN(despatchedNum) ||
      todayProductionNum < 0 ||
      totalCompletedNum < 0 ||
      despatchedNum < 0
    ) {
      toast.error('Please enter valid numbers (0 or greater)');
      return;
    }

    const reportData: DailyProductionReport = {
      date,
      operationName,
      todayProduction: BigInt(todayProductionNum),
      totalCompleted: BigInt(totalCompletedNum),
      despatched: BigInt(despatchedNum),
      inHand: BigInt(inHand),
    };

    if (editingReport) {
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
      createReport.mutate(reportData, {
        onSuccess: () => {
          toast.success('Production report added successfully');
          resetForm();
        },
        onError: (error) => {
          toast.error(`Failed to add production report: ${error.message}`);
        },
      });
    }
  };

  const isSubmitting = createReport.isPending || updateReport.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {editingReport ? 'Edit Production Report' : 'Admin Production Update Panel'}
          </div>
          {editingReport && (
            <Button variant="ghost" size="sm" onClick={resetForm}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationName">
                Operation Name <span className="text-destructive">*</span>
              </Label>
              <Select value={operationName} onValueChange={setOperationName} required>
                <SelectTrigger id="operationName">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_OPERATIONS.map((operation) => (
                    <SelectItem key={operation} value={operation}>
                      {operation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCompleted">
                Total Completed <span className="text-destructive">*</span>
              </Label>
              <Input
                id="totalCompleted"
                type="number"
                min="0"
                value={totalCompleted}
                onChange={(e) => setTotalCompleted(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="despatched">
                Despatched Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                id="despatched"
                type="number"
                min="0"
                value={despatched}
                onChange={(e) => setDespatched(e.target.value)}
                placeholder="0"
                required
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
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Calculated as: Total Completed - Despatched
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
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
        </form>
      </CardContent>
    </Card>
  );
}
