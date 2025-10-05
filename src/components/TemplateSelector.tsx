import { useCVContext } from "@/contexts/CVContext";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TemplateSelector = () => {
  const { cvData, updateTemplate, updateSettings } = useCVContext();

  const templates = [
    {
      id: "modern" as const,
      name: "Modern",
      description: "Clean layout with accent colours",
    },
    {
      id: "classic" as const,
      name: "Classic",
      description: "Traditional centred format",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Choose Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              cvData.template === template.id
                ? "border-primary ring-2 ring-primary"
                : "border-border"
            }`}
            onClick={() => updateTemplate(template.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
              {cvData.template === template.id && (
                <div className="bg-primary rounded-full p-1">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Density</Label>
          <Select
            value={cvData.settings?.density || "comfortable"}
            onValueChange={(v) =>
              updateSettings({ ...cvData.settings!, density: v as any })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Density" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
                <SelectItem value="spacious">Spacious</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Theme Color</Label>
          <Select
            value={cvData.settings?.themeColor || "blue"}
            onValueChange={(v) =>
              updateSettings({ ...cvData.settings!, themeColor: v as any })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Theme Color" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="emerald">Emerald</SelectItem>
                <SelectItem value="violet">Violet</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Font</Label>
          <Select
            value={cvData.settings?.fontFamily || "system"}
            onValueChange={(v) =>
              updateSettings({ ...cvData.settings!, fontFamily: v as any })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
