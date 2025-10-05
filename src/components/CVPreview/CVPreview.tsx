import { useCVContext } from '@/contexts/CVContext';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

export const CVPreview = () => {
  const { cvData } = useCVContext();

  const downloadPDF = async () => {
    const element = document.getElementById('cv-preview-content');
    if (!element) return;

    try {
      toast({
        title: 'Generating PDF...',
        description: 'Please wait while we create your CV.',
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = cvData.personalDetails.fullName
        ? `${cvData.personalDetails.fullName.replace(/\s+/g, '_')}_CV.pdf`
        : 'My_CV.pdf';
      
      pdf.save(fileName);

      toast({
        title: 'Success!',
        description: 'Your CV has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-4">
        <h2 className="text-xl font-semibold text-foreground">Preview</h2>
        <Button onClick={downloadPDF} className="bg-accent hover:bg-accent/90">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div id="cv-preview-content" className="bg-white rounded-lg overflow-hidden">
        {cvData.template === 'modern' ? (
          <ModernTemplate data={cvData} />
        ) : (
          <ClassicTemplate data={cvData} />
        )}
      </div>
    </div>
  );
};
