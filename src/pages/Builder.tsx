import { CVProvider, useCVContext } from "@/contexts/CVContext";
import { PersonalDetailsForm } from "@/components/CVForm/PersonalDetailsForm";
import { ProfessionalSummaryForm } from "@/components/CVForm/ProfessionalSummaryForm";
import { WorkExperienceForm } from "@/components/CVForm/WorkExperienceForm";
import { EducationForm } from "@/components/CVForm/EducationForm";
import { SkillsForm } from "@/components/CVForm/SkillsForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { CVPreview } from "@/components/CVPreview/CVPreview";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const BuilderHeader = () => {
  const { canUndo, canRedo, undo, redo, saveVersion, cvData } = useCVContext();

  const completion = (() => {
    let total = 0;
    let done = 0;
    const d = cvData;
    const req = [
      d.personalDetails.fullName,
      d.personalDetails.email,
      d.personalDetails.phone,
      d.professionalSummary,
    ];
    total += req.length;
    done += req.filter(Boolean).length;
    total += 1;
    done += d.workExperience.length > 0 ? 1 : 0;
    total += 1;
    done += d.education.length > 0 ? 1 : 0;
    total += 1;
    done += d.skills.length >= 5 ? 1 : 0;
    return Math.round((done / total) * 100);
  })();

  return (
    <div className="border-b border-border/40 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full">
          <Progress value={completion} className="w-48" />
          <span className="text-xs text-muted-foreground">
            Completion {completion}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => saveVersion("Manual save")}>
            Save version
          </Button>
          <Button variant="ghost" disabled={!canUndo} onClick={undo}>
            Undo
          </Button>
          <Button variant="ghost" disabled={!canRedo} onClick={redo}>
            Redo
          </Button>
        </div>
      </div>
    </div>
  );
};

const Builder = () => {
  return (
    <CVProvider>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="flex-1 w-full">
          <BuilderHeader />
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Editor
                  </h2>
                  <p className="text-muted-foreground">
                    Fill in your details to create a professional UK-standard CV
                  </p>
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <PersonalDetailsForm />
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <ProfessionalSummaryForm />
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <WorkExperienceForm />
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <EducationForm />
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <SkillsForm />
                </div>

                <div className="glass-effect p-6 rounded-xl card-hover">
                  <TemplateSelector />
                </div>
              </div>

              {/* Preview Section */}
              <div className="xl:sticky xl:top-24 xl:self-start animate-fade-in">
                <CVPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </CVProvider>
  );
};

export default Builder;
