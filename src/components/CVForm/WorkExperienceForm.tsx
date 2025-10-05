import { useCVContext } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { WorkExperience } from "@/types/cv";
import { TextLints } from "@/components/TextLints";
import { useState } from "react";
import { suggestBullets } from "@/lib/ai";
import { getEffectiveApiKey, saveApiKey } from "@/lib/apiKey";
import { isAiEnabled } from "@/lib/flags";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const WorkExperienceForm = () => {
  const { cvData, updateWorkExperience } = useCVContext();

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    updateWorkExperience([...cvData.workExperience, newExperience]);
  };

  const removeExperience = (id: string) => {
    updateWorkExperience(cvData.workExperience.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    updateWorkExperience(
      cvData.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Work Experience
        </h2>
        <Button onClick={addExperience} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {cvData.workExperience.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No work experience added yet. Click "Add Experience" to begin.
        </p>
      ) : (
        <div className="space-y-6">
          {cvData.workExperience.map((exp, index) => (
            <div
              key={exp.id}
              className="p-4 border border-border rounded-lg space-y-4 bg-card"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">
                  Position {index + 1}
                </h3>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={exp.jobTitle}
                    onChange={(e) =>
                      updateExperience(exp.id, { jobTitle: e.target.value })
                    }
                    placeholder="Chef, cleaner, waiter"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, { company: e.target.value })
                    }
                    placeholder="AT burger"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) =>
                    updateExperience(exp.id, { location: e.target.value })
                  }
                  placeholder="London, UK"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { startDate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.value })
                    }
                    disabled={exp.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    updateExperience(exp.id, {
                      current: checked as boolean,
                      endDate: checked ? "" : exp.endDate,
                    })
                  }
                />
                <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                  I currently work here
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) =>
                    updateExperience(exp.id, { description: e.target.value })
                  }
                  placeholder="Describe your key responsibilities and achievements..."
                  rows={4}
                  className="resize-none"
                />
                {isAiEnabled() && (
                  <div className="flex items-center gap-2">
                    <AiBulletsDialog
                      jobTitle={exp.jobTitle}
                      company={exp.company}
                      description={exp.description}
                      onInsert={(text) =>
                        updateExperience(exp.id, { description: text })
                      }
                    />
                  </div>
                )}
                <TextLints
                  text={exp.description}
                  onApplyFix={(t) =>
                    updateExperience(exp.id, { description: t })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface AiBulletsDialogProps {
  jobTitle: string;
  company?: string;
  description?: string;
  onInsert: (updated: string) => void;
}

const AiBulletsDialog = ({
  jobTitle,
  company,
  description,
  onInsert,
}: AiBulletsDialogProps) => {
  const { cvData } = useCVContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getEffectiveApiKey() || "");
  const [bullets, setBullets] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const insertSelected = () => {
    const chosen = bullets.filter((_, i) => selected[i]);
    if (chosen.length === 0) return;
    const base = (description || "").trim();
    const sep = base ? "\n" : "";
    onInsert(
      [base, ...chosen.map((b) => (b.startsWith("• ") ? b : `• ${b}`))].join(
        sep
      )
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="secondary">
          Suggest bullets (AI)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Bullet Suggestions</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {!getEffectiveApiKey() && (
            <input
              type="password"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Enter OpenAI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          )}
          <div className="text-xs text-muted-foreground">
            <button
              type="button"
              className="underline"
              onClick={() => {
                const k = prompt("Enter OpenAI API Key", apiKey || "");
                if (typeof k === "string") {
                  setApiKey(k);
                  saveApiKey(k);
                }
              }}
            >
              {getEffectiveApiKey()
                ? "Change saved API key"
                : "Save key for later"}
            </button>
          </div>
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                const res = await suggestBullets({
                  experience: { jobTitle, company, description },
                  cv: cvData,
                  apiKey: apiKey || getEffectiveApiKey() || "",
                });
                setBullets(res);
                setSelected({});
              } catch (e) {
                setBullets([
                  "Error generating suggestions. Check API key and try again.",
                ]);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading || !(apiKey || getEffectiveApiKey())}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
          <div className="space-y-2 max-h-64 overflow-auto pr-1">
            {bullets.map((b, i) => (
              <label
                key={i}
                className="flex items-start gap-2 p-2 border border-border rounded-md"
              >
                <input
                  type="checkbox"
                  checked={!!selected[i]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [i]: e.target.checked }))
                  }
                />
                <span className="text-sm leading-snug">{b}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={insertSelected}>
              Insert selected
            </Button>
            <Button
              size="sm"
              onClick={() => {
                onInsert(
                  bullets
                    .map((b) => (b.startsWith("• ") ? b : `• ${b}`))
                    .join("\n")
                );
                setOpen(false);
              }}
              disabled={bullets.length === 0}
            >
              Insert all
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
