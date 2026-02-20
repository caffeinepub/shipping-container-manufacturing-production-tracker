import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddDispatchRecord } from '../hooks/useAddDispatchRecord';
import { Loader2, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function DispatchEntryForm() {
  const [dispatchDate, setDispatchDate] = useState('');
  const [containerType, setContainerType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [destination, setDestination] = useState('');
  const [trackingReference, setTrackingReference] = useState('');

  const addDispatch = useAddDispatchRecord();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dispatchDate || !containerType || !quantity || !destination || !trackingReference) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    addDispatch.mutate(
      {
        dispatchDate,
        containerType: containerType.trim(),
        quantity: BigInt(quantityNum),
        destination: destination.trim(),
        trackingReference: trackingReference.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Dispatch record added successfully');
          setDispatchDate('');
          setContainerType('');
          setQuantity('');
          setDestination('');
          setTrackingReference('');
        },
        onError: (error) => {
          toast.error(`Failed to add dispatch record: ${error.message}`);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Record Dispatch
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dispatchDate">
                Dispatch Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dispatchDate"
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
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
                Quantity <span className="text-destructive">*</span>
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
              <Label htmlFor="destination">
                Destination <span className="text-destructive">*</span>
              </Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Port of Mumbai"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="trackingReference">
                Tracking Reference <span className="text-destructive">*</span>
              </Label>
              <Input
                id="trackingReference"
                value={trackingReference}
                onChange={(e) => setTrackingReference(e.target.value)}
                placeholder="e.g., TRK-2024-001"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={addDispatch.isPending} className="w-full md:w-auto">
            {addDispatch.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Dispatch Record'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
