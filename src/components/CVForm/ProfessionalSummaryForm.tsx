import { useCVContext } from "@/contexts/CVContext";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextLints } from "@/components/TextLints";
import AIRealTimeFeedback from "@/components/AIRealTimeFeedback";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { suggestSummary } from "@/lib/ai";
import {
  getEffectiveApiKey,
  saveApiKey,
  clearStoredApiKey,
} from "@/lib/apiKey";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { isAiEnabled } from "@/lib/flags";

export const ProfessionalSummaryForm = () => {
  const { cvData, updateProfessionalSummary } = useCVContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string>(getEffectiveApiKey() || "");
  const hasPresetKey = !!getEffectiveApiKey();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Professional Summary
      </h2>
      <div className="space-y-2">
        <Label htmlFor="summary">
          Brief overview of your professional background and key skills
        </Label>
        <Textarea
          id="summary"
          value={cvData.professionalSummary}
          onChange={(e) => updateProfessionalSummary(e.target.value)}
          placeholder="Experienced professional with a strong background in..."
          rows={5}
          className="resize-none"
        />
        <TextLints
          text={cvData.professionalSummary}
          onApplyFix={(t) => updateProfessionalSummary(t)}
        />
        <AIRealTimeFeedback
          content={cvData.professionalSummary}
          sectionType="summary"
          onSuggestionApply={(suggestion) => updateProfessionalSummary(suggestion)}
        />
        <p className="text-sm text-muted-foreground">
          Keep it concise - 2-3 sentences highlighting your key achievements and
          expertise.
        </p>
        {isAiEnabled() && (
          <div className="pt-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  Suggest summary (AI)
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>AI Suggestions</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {!hasPresetKey && (
                    <input
                      type="password"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      placeholder="Enter OpenAI API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <button
                      type="button"
                      className="underline"
                      onClick={() => {
                        if (hasPresetKey) {
                          // allow switching from env to custom key by clearing stored and prompting
                          clearStoredApiKey();
                        }
                        const k = prompt("Enter OpenAI API Key", apiKey || "");
                        if (typeof k === "string") {
                          setApiKey(k);
                          saveApiKey(k);
                        }
                      }}
                    >
                      {hasPresetKey
                        ? "Use a different API key"
                        : "Save key for later"}
                    </button>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const effective = apiKey || getEffectiveApiKey() || "";
                        if (!effective) throw new Error("Missing API key");
                        const res = await suggestSummary({
                          cv: cvData,
                          apiKey: effective,
                        });
                        setOptions(res);
                      } catch (e) {
                        setOptions([
                          "Error generating suggestions. Check API key and try again.",
                        ]);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !(apiKey || hasPresetKey)}
                  >
                    {loading ? "Generating..." : "Generate"}
                  </Button>
                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <div
                        key={i}
                        className="p-3 border border-border rounded-md"
                      >
                        <p className="text-sm mb-2">{opt}</p>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateProfessionalSummary(opt);
                            setOpen(false);
                          }}
                        >
                          Use this
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};
