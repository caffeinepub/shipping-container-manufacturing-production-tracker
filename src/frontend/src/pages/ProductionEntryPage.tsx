import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddProductionRecord } from '../hooks/useAddProductionRecord';
import { useGetCallerRole } from '../hooks/useGetCallerRole';
import { Loader2, ClipboardList, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductionEntryPage() {
  const [date, setDate] = useState('');
  const [containerType, setContainerType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shift, setShift] = useState('');
  const [notes, setNotes] = useState('');

  const addProduction = useAddProductionRecord();
  const { data: role, isLoading: roleLoading } = useGetCallerRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !containerType || !quantity || !shift) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    addProduction.mutate(
      {
        date,
        containerType: containerType.trim(),
        quantity: BigInt(quantityNum),
        shift,
        notes: notes.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Production record added successfully');
          setDate('');
          setContainerType('');
          setQuantity('');
          setShift('');
          setNotes('');
        },
        onError: (error) => {
          toast.error(`Failed to add production record: ${error.message}`);
        },
      }
    );
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show read-only message for viewers
  if (role === 'viewer') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Production Data Entry</h1>
          <p className="text-muted-foreground mt-1">Record daily production metrics</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Read-Only Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You have viewer access and cannot add production records. Please contact an administrator if you need to make changes.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Production Data Entry</h1>
        <p className="text-muted-foreground mt-1">Record daily production metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            New Production Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Production Date <span className="text-destructive">*</span>
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
                <Label htmlFor="containerType">
                  Container Type <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="containerType"
                  value={containerType}
                  onChange={(e) => setContainerType(e.target.value)}
                  placeholder="e.g., 20ft Standard, 40ft HC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity Produced <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift">
                  Shift <span className="text-destructive">*</span>
                </Label>
                <Select value={shift} onValueChange={setShift} required>
                  <SelectTrigger id="shift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Production Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes about this production run..."
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={addProduction.isPending} className="w-full md:w-auto">
              {addProduction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Production Record'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
