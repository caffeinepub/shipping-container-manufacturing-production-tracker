import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ExportPDFButton() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `production-report-${timestamp}.pdf`;
      
      toast.success(`PDF exported successfully: ${filename}`);
    } catch (error) {
      toast.error('Failed to export PDF. Please try again.');
      console.error('PDF export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden md:inline">Exporting...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export PDF</span>
        </>
      )}
    </Button>
  );
}
