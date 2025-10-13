import { useState } from "react";
import { useCVContext } from "@/contexts/CVContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Palette, Download, Star, Check } from "lucide-react";
import { CVData } from "@/types/cv";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  color: string;
  popularity: number;
  isNew?: boolean;
  isPremium?: boolean;
}

const templateOptions: TemplateOption[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, contemporary design perfect for most industries",
    category: "professional",
    preview: "Clean layout with accent colors and modern typography",
    features: [
      "ATS-friendly",
      "Mobile responsive",
      "Color accents",
      "Modern typography",
    ],
    color: "bg-blue-500",
    popularity: 95,
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description:
      "Traditional format that works well for conservative industries",
    category: "professional",
    preview: "Centered layout with traditional formatting",
    features: [
      "Traditional layout",
      "Conservative design",
      "Wide compatibility",
      "Professional look",
    ],
    color: "bg-gray-600",
    popularity: 88,
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    description: "Bold design for creative professionals and designers",
    category: "creative",
    preview: "Bold colors and creative layout for standout applications",
    features: [
      "Creative layout",
      "Colorful design",
      "Portfolio focus",
      "Visual impact",
    ],
    color: "bg-purple-500",
    popularity: 76,
    isNew: true,
  },
  {
    id: "academic",
    name: "Academic Scholar",
    description: "Formal layout ideal for academic and research positions",
    category: "academic",
    preview: "Formal academic formatting with emphasis on publications",
    features: [
      "Academic focus",
      "Publication emphasis",
      "Formal layout",
      "Research-oriented",
    ],
    color: "bg-green-600",
    popularity: 82,
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Ultra-clean design focusing on content over decoration",
    category: "minimal",
    preview: "Minimalist design with maximum content focus",
    features: [
      "Ultra-clean",
      "Content-focused",
      "Fast loading",
      "Universal appeal",
    ],
    color: "bg-slate-500",
    popularity: 91,
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description: "Premium template for senior executives and C-level positions",
    category: "executive",
    preview: "Sophisticated design for leadership roles",
    features: [
      "Executive focus",
      "Leadership emphasis",
      "Premium design",
      "Strategic positioning",
    ],
    color: "bg-amber-600",
    popularity: 67,
    isPremium: true,
  },
];

const colorThemes = [
  { name: "Blue", value: "blue", color: "bg-blue-500" },
  { name: "Green", value: "green", color: "bg-green-500" },
  { name: "Purple", value: "purple", color: "bg-purple-500" },
  { name: "Red", value: "red", color: "bg-red-500" },
  { name: "Orange", value: "orange", color: "bg-orange-500" },
  { name: "Teal", value: "teal", color: "bg-teal-500" },
];

export const InteractiveTemplateSelector = () => {
  const { cvData, updateTemplate, updateSettings } = useCVContext();
  const [selectedTemplate, setSelectedTemplate] = useState(cvData.template);
  const [selectedColor, setSelectedColor] = useState(
    cvData.settings?.themeColor || "blue"
  );
  const [previewMode, setPreviewMode] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId as "modern" | "classic");
    updateTemplate(templateId as "modern" | "classic");
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    updateSettings({ ...cvData.settings, themeColor: color });
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const selectedTemplateData = templateOptions.find(
    (t) => t.id === selectedTemplate
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Choose Your Template
          </h2>
          <p className="text-muted-foreground">
            Select a professional template that matches your industry and style
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? "Hide Preview" : "Live Preview"}
          </Button>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateOptions.map((template) => (
          <Card
            key={template.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className="space-y-4">
              {/* Template Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${template.color}`} />
                  <h3 className="font-semibold text-foreground">
                    {template.name}
                  </h3>
                </div>
                <div className="flex gap-1">
                  {template.isNew && (
                    <Badge variant="secondary" className="text-xs">
                      New
                    </Badge>
                  )}
                  {template.isPremium && (
                    <Badge variant="outline" className="text-xs">
                      Premium
                    </Badge>
                  )}
                </div>
              </div>

              {/* Popularity */}
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-muted-foreground">
                  {template.popularity}% popular
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">
                  Features:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="secondary"
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Select Button */}
              <Button
                className="w-full"
                variant={
                  selectedTemplate === template.id ? "default" : "outline"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect(template.id);
                }}
              >
                {selectedTemplate === template.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  "Select Template"
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Color Customization */}
      {selectedTemplateData && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Customize Colors
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose a color theme that matches your personal brand
            </p>
            <div className="grid grid-cols-6 gap-3">
              {colorThemes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleColorSelect(theme.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    selectedColor === theme.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${theme.color}`} />
                  <span className="text-xs text-foreground">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Live Preview */}
      {previewMode && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Live Preview
            </h3>
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <div className="text-center text-sm text-muted-foreground">
                Preview of {selectedTemplateData?.name} template with{" "}
                {selectedColor} theme
              </div>
              <div className="mt-4 p-4 bg-white rounded border">
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full ${
                      colorThemes.find((t) => t.value === selectedColor)
                        ?.color || "bg-blue-500"
                    } mx-auto mb-2`}
                  />
                  <h4 className="font-bold text-lg">Your Name</h4>
                  <p className="text-sm text-muted-foreground">
                    Your Professional Title
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Template Stats */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">6</div>
            <div className="text-sm text-muted-foreground">
              Professional Templates
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted-foreground">ATS Compatible</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">∞</div>
            <div className="text-sm text-muted-foreground">
              Customization Options
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

