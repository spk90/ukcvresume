import { useCVContext } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, Mail, Share2, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ExportOptions = () => {
  const { cvData } = useCVContext();
  const [exportFormat, setExportFormat] = useState("pdf");
  const [includeContact, setIncludeContact] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(false);
  const [pageSize, setPageSize] = useState("a4");

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
        format: pageSize as any,
      });

      const imgWidth = pageSize === 'a4' ? 210 : 216; // A4 or Letter width in mm
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

  const downloadJSON = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cvData.personalDetails.fullName || 'CV'}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Data Exported',
      description: 'Your CV data has been saved as JSON.',
    });
  };

  const downloadWord = () => {
    // This would require a more complex implementation
    // For now, we'll show a message about the limitation
    toast({
      title: 'Word Export',
      description: 'Word export requires additional setup. Please use PDF for now.',
      variant: 'destructive',
    });
  };

  const printCV = () => {
    const element = document.getElementById('cv-preview-content');
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>CV - ${cvData.personalDetails.fullName || 'My CV'}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  const shareCV = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cvData.personalDetails.fullName || 'My'} CV`,
          text: 'Check out my professional CV',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'CV link has been copied to clipboard.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Export Options</h2>
        <p className="text-muted-foreground">
          Download your CV in various formats or share it with others
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Settings */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-4">Export Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="word">Word Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Page Size</Label>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-contact"
                  checked={includeContact}
                  onCheckedChange={setIncludeContact}
                />
                <Label htmlFor="include-contact">Include contact information</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-photo"
                  checked={includePhoto}
                  onCheckedChange={setIncludePhoto}
                />
                <Label htmlFor="include-photo">Include photo placeholder</Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Export Actions */}
        <Card className="p-4">
          <h3 className="font-medium text-foreground mb-4">Export Actions</h3>
          <div className="space-y-3">
            <Button
              onClick={downloadPDF}
              className="w-full justify-start"
              disabled={exportFormat !== "pdf"}
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>

            <Button
              onClick={downloadJSON}
              variant="outline"
              className="w-full justify-start"
              disabled={exportFormat !== "json"}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export JSON Data
            </Button>

            <Button
              onClick={downloadWord}
              variant="outline"
              className="w-full justify-start"
              disabled={exportFormat !== "word"}
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Word
            </Button>

            <Button
              onClick={printCV}
              variant="outline"
              className="w-full justify-start"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print CV
            </Button>

            <Button
              onClick={shareCV}
              variant="outline"
              className="w-full justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share CV
            </Button>
          </div>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Export Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>PDF:</strong> Best for job applications and professional use</li>
          <li>• <strong>JSON:</strong> Save your data for backup or importing later</li>
          <li>• <strong>Print:</strong> Use browser's print function for physical copies</li>
          <li>• <strong>Share:</strong> Send a link to your CV (requires internet connection)</li>
        </ul>
      </div>
    </div>
  );
};
