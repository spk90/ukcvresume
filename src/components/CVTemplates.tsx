import { useCVContext } from "@/contexts/CVContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Eye, Download } from "lucide-react";
import { CVData } from "@/types/cv";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  category: "professional" | "creative" | "academic" | "minimal";
  preview: string;
  features: string[];
}

const templateOptions: TemplateOption[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, contemporary design perfect for most industries",
    category: "professional",
    preview: "Clean layout with accent colors and modern typography",
    features: ["ATS-friendly", "Mobile responsive", "Color accents", "Modern typography"],
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description: "Traditional format that works well for conservative industries",
    category: "professional",
    preview: "Centered layout with traditional formatting",
    features: ["Traditional layout", "Conservative design", "Wide compatibility", "Professional look"],
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description: "Bold design for creative professionals and designers",
    category: "creative",
    preview: "Bold colors and creative layout for standout applications",
    features: ["Creative layout", "Colorful design", "Portfolio focus", "Visual impact"],
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Formal layout ideal for academic and research positions",
    category: "academic",
    preview: "Formal academic formatting with emphasis on publications",
    features: ["Academic focus", "Publication emphasis", "Formal layout", "Research-oriented"],
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Ultra-clean design focusing on content over decoration",
    category: "minimal",
    preview: "Minimalist design with maximum content focus",
    features: ["Ultra-clean", "Content-focused", "Fast loading", "Universal appeal"],
  },
];

export const CVTemplates = () => {
  const { cvData, updateTemplate } = useCVContext();

  const handleTemplateSelect = (templateId: string) => {
    updateTemplate(templateId as any);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "professional":
        return "bg-blue-100 text-blue-800";
      case "creative":
        return "bg-purple-100 text-purple-800";
      case "academic":
        return "bg-green-100 text-green-800";
      case "minimal":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Choose Template</h2>
        <p className="text-muted-foreground">
          Select a template that best represents your professional style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateOptions.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              cvData.template === template.id
                ? "border-primary ring-2 ring-primary"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getCategoryColor(template.category)}`}
                  >
                    {template.category}
                  </Badge>
                </div>
                {cvData.template === template.id && (
                  <div className="bg-primary rounded-full p-1">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground italic">
                  "{template.preview}"
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant={cvData.template === template.id ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template.id);
                  }}
                >
                  {cvData.template === template.id ? "Selected" : "Select"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Preview functionality could be added here
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-2">Template Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• <strong>Professional:</strong> Best for corporate, business, and traditional industries</li>
          <li>• <strong>Creative:</strong> Perfect for designers, artists, and creative professionals</li>
          <li>• <strong>Academic:</strong> Ideal for research, education, and academic positions</li>
          <li>• <strong>Minimal:</strong> Great for tech, startups, and modern companies</li>
        </ul>
      </div>
    </div>
  );
};
