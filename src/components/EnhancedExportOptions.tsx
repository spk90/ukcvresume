import { useState } from "react";
import { useCVContext } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Mail,
  Share2,
  Printer,
  FileImage,
  FileCode,
  Cloud,
  Smartphone,
  Monitor,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CVData } from "@/types/cv";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fileExtension: string;
  mimeType: string;
  features: string[];
  recommended: boolean;
}

const exportFormats: ExportFormat[] = [
  {
    id: "pdf",
    name: "PDF Document",
    description: "High-quality PDF perfect for job applications",
    icon: <FileText className="h-5 w-5" />,
    fileExtension: "pdf",
    mimeType: "application/pdf",
    features: ["Print-ready", "ATS-friendly", "Universal compatibility"],
    recommended: true,
  },
  {
    id: "docx",
    name: "Word Document",
    description: "Editable Word document for further customization",
    icon: <FileText className="h-5 w-5" />,
    fileExtension: "docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    features: ["Editable", "Track changes", "Comments support"],
    recommended: false,
  },
  {
    id: "html",
    name: "HTML Web Page",
    description: "Web-friendly format for online portfolios",
    icon: <FileCode className="h-5 w-5" />,
    fileExtension: "html",
    mimeType: "text/html",
    features: ["Web-ready", "Responsive", "SEO-friendly"],
    recommended: false,
  },
  {
    id: "json",
    name: "JSON Data",
    description: "Raw data format for backup and integration",
    icon: <FileCode className="h-5 w-5" />,
    fileExtension: "json",
    mimeType: "application/json",
    features: ["Data backup", "API integration", "Version control"],
    recommended: false,
  },
];

export const EnhancedExportOptions = () => {
  const { cvData } = useCVContext();
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [exportOptions, setExportOptions] = useState({
    includeContact: true,
    includePhoto: false,
    includeReferences: false,
    pageSize: "a4",
    quality: "high",
    watermark: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportHistory, setExportHistory] = useState<
    Array<{
      id: string;
      format: string;
      timestamp: Date;
      size: string;
    }>
  >([]);

  const downloadPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(10);

      toast({
        title: "Generating PDF...",
        description: "Creating high-quality PDF from your CV data.",
      });

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: exportOptions.pageSize as "a4" | "letter",
      });

      setExportProgress(20);

      // Get page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let currentY = margin;

      // Set font
      pdf.setFont("helvetica");

      // Helper function to add text with word wrapping
      const addText = (
        text: string,
        fontSize: number,
        isBold: boolean = false,
        color: string = "#000000"
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        pdf.setTextColor(color);

        const lines = pdf.splitTextToSize(text, contentWidth);
        pdf.text(lines, margin, currentY);
        currentY += lines.length * (fontSize * 0.35) + 2;
      };

      // Helper function to add section header
      const addSectionHeader = (text: string) => {
        currentY += 8;
        addText(text.toUpperCase(), 12, true, "#2c3e50");
        currentY += 3;
        // Add underline
        pdf.setDrawColor(44, 62, 80);
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 5;
      };

      // Header Section
      if (cvData.personalDetails.fullName) {
        addText(cvData.personalDetails.fullName, 20, true, "#2c3e50");
        currentY += 2;
      }

      // Contact Information
      const contactInfo = [];
      if (cvData.personalDetails.email)
        contactInfo.push(cvData.personalDetails.email);
      if (cvData.personalDetails.phone)
        contactInfo.push(cvData.personalDetails.phone);
      if (cvData.personalDetails.location)
        contactInfo.push(cvData.personalDetails.location);
      if (cvData.personalDetails.linkedin)
        contactInfo.push(cvData.personalDetails.linkedin);

      if (contactInfo.length > 0) {
        addText(contactInfo.join(" • "), 10, false, "#7f8c8d");
        currentY += 5;
      }

      setExportProgress(40);

      // Professional Summary
      if (cvData.professionalSummary) {
        addSectionHeader("Professional Summary");
        addText(cvData.professionalSummary, 10);
        currentY += 3;
      }

      setExportProgress(60);

      // Work Experience
      if (cvData.workExperience && cvData.workExperience.length > 0) {
        addSectionHeader("Professional Experience");

        cvData.workExperience.forEach((exp, index) => {
          // Job title and company
          const titleCompany = `${exp.jobTitle}${
            exp.company ? ` at ${exp.company}` : ""
          }`;
          addText(titleCompany, 11, true);

          // Dates and location
          const dateLocation = [];
          if (exp.startDate || exp.endDate) {
            const startDate = exp.startDate
              ? new Date(exp.startDate).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "";
            const endDate = exp.endDate
              ? new Date(exp.endDate).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "Present";
            dateLocation.push(`${startDate} - ${endDate}`);
          }
          if (exp.location) dateLocation.push(exp.location);

          if (dateLocation.length > 0) {
            addText(dateLocation.join(" • "), 9, false, "#7f8c8d");
          }

          // Description
          if (exp.description) {
            addText(exp.description, 10);
          }

          // Add space between experiences
          if (index < cvData.workExperience.length - 1) {
            currentY += 3;
          }
        });
      }

      setExportProgress(80);

      // Education
      if (cvData.education && cvData.education.length > 0) {
        addSectionHeader("Education");

        cvData.education.forEach((edu, index) => {
          // Degree and institution
          const degreeInstitution = `${edu.degree}${
            edu.institution ? `, ${edu.institution}` : ""
          }`;
          addText(degreeInstitution, 11, true);

          // Dates and location
          const dateLocation = [];
          if (edu.startDate || edu.endDate) {
            const startDate = edu.startDate
              ? new Date(edu.startDate).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "";
            const endDate = edu.endDate
              ? new Date(edu.endDate).toLocaleDateString("en-GB", {
                  month: "short",
                  year: "numeric",
                })
              : "Present";
            dateLocation.push(`${startDate} - ${endDate}`);
          }
          if (edu.location) dateLocation.push(edu.location);

          if (dateLocation.length > 0) {
            addText(dateLocation.join(" • "), 9, false, "#7f8c8d");
          }

          // Description
          if (edu.description) {
            addText(edu.description, 10);
          }

          // Add space between education entries
          if (index < cvData.education.length - 1) {
            currentY += 3;
          }
        });
      }

      // Skills
      if (cvData.skills && cvData.skills.length > 0) {
        addSectionHeader("Skills");
        const skillsText = cvData.skills.join(" • ");
        addText(skillsText, 10);
      }

      setExportProgress(90);

      // Add page numbers if content spans multiple pages
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor("#7f8c8d");
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
      }

      setExportProgress(95);

      const fileName = cvData.personalDetails.fullName
        ? `${cvData.personalDetails.fullName.replace(/\s+/g, "_")}_CV.pdf`
        : "My_CV.pdf";

      pdf.save(fileName);

      setExportProgress(100);

      // Add to export history
      const newExport = {
        id: Date.now().toString(),
        format: "PDF",
        timestamp: new Date(),
        size: `${pageCount} pages`,
      };
      setExportHistory((prev) => [newExport, ...prev.slice(0, 4)]);

      toast({
        title: "Success!",
        description: "Your high-quality CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(cvData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${cvData.personalDetails.fullName || "My_CV"}_data.json`;
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your CV data has been downloaded as JSON.",
    });
  };

  const downloadHighQualityPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      setExportProgress(10);

      toast({
        title: "Generating High-Quality PDF...",
        description: "Creating print-ready PDF with enhanced formatting.",
      });

      const element = document.getElementById("cv-preview-content");
      if (!element) throw new Error("CV preview not found");

      setExportProgress(20);

      // Create a temporary container with optimized styles for PDF
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "210mm"; // A4 width
      tempContainer.style.backgroundColor = "white";
      tempContainer.style.padding = "20mm";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "12px";
      tempContainer.style.lineHeight = "1.4";
      tempContainer.style.color = "#333";

      // Clone and optimize the content
      const clonedElement = element.cloneNode(true) as HTMLElement;

      // Apply PDF-optimized styles
      const style = document.createElement("style");
      style.textContent = `
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        h1, h2, h3 { color: #2c3e50; margin: 0 0 10px 0; }
        h1 { font-size: 24px; font-weight: bold; }
        h2 { font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #2c3e50; padding-bottom: 5px; }
        h3 { font-size: 14px; font-weight: bold; }
        p { margin: 0 0 8px 0; line-height: 1.4; }
        ul { margin: 0; padding-left: 20px; }
        li { margin-bottom: 4px; }
        .contact-info { color: #7f8c8d; font-size: 11px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .job-title { font-weight: bold; color: #2c3e50; }
        .company { color: #7f8c8d; }
        .date { color: #7f8c8d; font-size: 10px; }
        .description { margin-top: 5px; }
        @media print {
          body { -webkit-print-color-adjust: exact; color-adjust: exact; }
        }
      `;

      tempContainer.appendChild(style);
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      setExportProgress(40);

      // Generate high-quality canvas
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: tempContainer.offsetWidth,
        height: tempContainer.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      setExportProgress(70);

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: exportOptions.pageSize as "a4" | "letter",
        compress: true,
      });

      setExportProgress(85);

      const imgWidth = exportOptions.pageSize === "a4" ? 210 : 216;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF with proper scaling
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );

      setExportProgress(95);

      const fileName = cvData.personalDetails.fullName
        ? `${cvData.personalDetails.fullName.replace(
            /\s+/g,
            "_"
          )}_CV_HighQuality.pdf`
        : "My_CV_HighQuality.pdf";

      pdf.save(fileName);

      setExportProgress(100);

      // Add to export history
      const newExport = {
        id: Date.now().toString(),
        format: "High-Quality PDF",
        timestamp: new Date(),
        size: `${Math.round(pdf.internal.getNumberOfPages())} pages`,
      };
      setExportHistory((prev) => [newExport, ...prev.slice(0, 4)]);

      toast({
        title: "Success!",
        description: "Your high-quality CV has been downloaded successfully.",
      });
    } catch (error) {
      console.error("High-quality PDF generation error:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate high-quality PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const downloadHTML = () => {
    const element = document.getElementById("cv-preview-content");
    if (!element) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${cvData.personalDetails.fullName || "CV"} - Resume</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .cv-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        @media print { body { background: white; } .cv-container { box-shadow: none; } }
    </style>
</head>
<body>
    <div class="cv-container">
        ${element.innerHTML}
    </div>
</body>
</html>`;

    const dataBlob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${cvData.personalDetails.fullName || "My_CV"}.html`;
    link.click();

    URL.revokeObjectURL(url);

    toast({
      title: "HTML Exported",
      description: "Your CV has been downloaded as an HTML file.",
    });
  };

  const shareCV = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cvData.personalDetails.fullName || "My"} CV`,
          text: "Check out my professional CV",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "CV link has been copied to clipboard.",
      });
    }
  };

  const printCV = () => {
    const element = document.getElementById("cv-preview-content");
    if (!element) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print CV</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            @media print { body { margin: 0; padding: 0; } }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const handleExport = () => {
    switch (selectedFormat) {
      case "pdf":
        downloadPDF();
        break;
      case "json":
        downloadJSON();
        break;
      case "html":
        downloadHTML();
        break;
      default:
        toast({
          title: "Format Not Available",
          description: "This export format is coming soon.",
          variant: "destructive",
        });
    }
  };

  const selectedFormatData = exportFormats.find((f) => f.id === selectedFormat);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Export Your CV
        </h2>
        <p className="text-muted-foreground">
          Download your CV in various formats for different purposes
        </p>
      </div>

      {/* Format Selection */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Choose Export Format
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exportFormats.map((format) => (
            <div
              key={format.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedFormat === format.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedFormat(format.id)}
            >
              <div className="flex items-start gap-3">
                <div className="text-primary">{format.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">
                      {format.name}
                    </h4>
                    {format.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {format.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {format.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="outline"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeContact"
                checked={exportOptions.includeContact}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeContact: !!checked,
                  }))
                }
              />
              <Label htmlFor="includeContact">
                Include Contact Information
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includePhoto"
                checked={exportOptions.includePhoto}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includePhoto: !!checked,
                  }))
                }
              />
              <Label htmlFor="includePhoto">Include Photo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="watermark"
                checked={exportOptions.watermark}
                onCheckedChange={(checked) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    watermark: !!checked,
                  }))
                }
              />
              <Label htmlFor="watermark">Add Watermark</Label>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pageSize">Page Size</Label>
              <Select
                value={exportOptions.pageSize}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({ ...prev, pageSize: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                  <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quality">Quality</Label>
              <Select
                value={exportOptions.quality}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({ ...prev, quality: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (2x scale)</SelectItem>
                  <SelectItem value="medium">Medium (1.5x scale)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Progress */}
      {isExporting && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-foreground">
                Exporting your CV...
              </span>
            </div>
            <Progress value={exportProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {exportProgress < 30 && "Preparing document..."}
              {exportProgress >= 30 &&
                exportProgress < 70 &&
                "Generating content..."}
              {exportProgress >= 70 &&
                exportProgress < 100 &&
                "Finalizing export..."}
              {exportProgress === 100 && "Complete!"}
            </p>
          </div>
        </Card>
      )}

      {/* Export Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Export Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button
            onClick={handleExport}
            className="w-full justify-start"
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            Download {selectedFormatData?.name}
          </Button>

          {selectedFormat === "pdf" && (
            <Button
              onClick={downloadHighQualityPDF}
              variant="outline"
              className="w-full justify-start"
              disabled={isExporting}
            >
              <FileText className="h-4 w-4 mr-2" />
              High-Quality PDF
            </Button>
          )}

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

          <Button
            onClick={() =>
              navigator.clipboard.writeText(JSON.stringify(cvData, null, 2))
            }
            variant="outline"
            className="w-full justify-start"
          >
            <Cloud className="h-4 w-4 mr-2" />
            Copy Data
          </Button>
        </div>
      </Card>

      {/* Export History */}
      {exportHistory.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Exports</h3>
          <div className="space-y-2">
            {exportHistory.map((export_) => (
              <div
                key={export_.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {export_.format} Export
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {export_.timestamp.toLocaleString()} • {export_.size}
                    </p>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Export Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • <strong>Standard PDF:</strong> Fast generation, good for most
                applications
              </li>
              <li>
                • <strong>High-Quality PDF:</strong> Print-ready, perfect for
                professional use
              </li>
              <li>• A4 size is standard in most countries</li>
              <li>• Keep file size under 5MB for email attachments</li>
              <li>
                • High-quality PDFs are optimized for both screen and print
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
