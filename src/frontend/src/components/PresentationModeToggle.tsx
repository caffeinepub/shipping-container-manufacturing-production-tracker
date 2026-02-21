import { Button } from '@/components/ui/button';
import { Presentation, Eye } from 'lucide-react';
import { usePresentationMode } from '../contexts/PresentationModeContext';

export default function PresentationModeToggle() {
  const { isPresentationMode, togglePresentationMode } = usePresentationMode();

  return (
    <Button
      onClick={togglePresentationMode}
      variant={isPresentationMode ? 'default' : 'outline'}
      size="sm"
      className="gap-2"
    >
      {isPresentationMode ? <Eye className="h-4 w-4" /> : <Presentation className="h-4 w-4" />}
      <span className="hidden md:inline">
        {isPresentationMode ? 'Presentation Mode: ON' : 'Presentation Mode'}
      </span>
    </Button>
  );
}
