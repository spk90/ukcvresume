import { useCVContext } from "@/contexts/CVContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react";

export const CVAnalytics = () => {
  const { cvData } = useCVContext();

  const getCompletionScore = () => {
    let total = 0;
    let completed = 0;

    // Personal details
    const personalFields = [
      cvData.personalDetails.fullName,
      cvData.personalDetails.email,
      cvData.personalDetails.phone,
      cvData.personalDetails.location,
    ];
    total += personalFields.length;
    completed += personalFields.filter(Boolean).length;

    // Professional summary
    total += 1;
    completed += cvData.professionalSummary ? 1 : 0;

    // Work experience
    total += 1;
    completed += cvData.workExperience.length > 0 ? 1 : 0;

    // Education
    total += 1;
    completed += cvData.education.length > 0 ? 1 : 0;

    // Skills
    total += 1;
    completed += cvData.skills.length >= 5 ? 1 : 0;

    return Math.round((completed / total) * 100);
  };

  const getAnalytics = () => {
    const completion = getCompletionScore();
    const wordCount = cvData.professionalSummary.split(" ").length;
    const experienceCount = cvData.workExperience.length;
    const educationCount = cvData.education.length;
    const skillsCount = cvData.skills.length;

    const tips = [];
    const warnings = [];

    // Completion tips
    if (completion < 100) {
      tips.push("Complete all sections to maximize your CV's impact");
    }

    // Professional summary tips
    if (wordCount < 20) {
      tips.push("Consider expanding your professional summary (aim for 20-50 words)");
    } else if (wordCount > 100) {
      warnings.push("Your professional summary is quite long. Consider condensing it");
    }

    // Experience tips
    if (experienceCount === 0) {
      tips.push("Add your work experience to showcase your professional background");
    } else if (experienceCount < 2) {
      tips.push("Consider adding more work experience if available");
    }

    // Education tips
    if (educationCount === 0) {
      tips.push("Include your education to provide context about your qualifications");
    }

    // Skills tips
    if (skillsCount < 5) {
      tips.push("Add more skills to demonstrate your capabilities (aim for 5-10)");
    } else if (skillsCount > 15) {
      warnings.push("You have many skills listed. Consider focusing on the most relevant ones");
    }

    // ATS optimization tips
    tips.push("Use action verbs in your descriptions (e.g., 'managed', 'developed', 'achieved')");
    tips.push("Include quantifiable achievements where possible (e.g., 'increased sales by 20%')");

    return {
      completion,
      wordCount,
      experienceCount,
      educationCount,
      skillsCount,
      tips,
      warnings,
    };
  };

  const analytics = getAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">CV Analytics</h2>
      </div>

      {/* Completion Score */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Completion Score</span>
            <Badge variant={analytics.completion >= 80 ? "default" : "secondary"}>
              {analytics.completion}%
            </Badge>
          </div>
          <Progress value={analytics.completion} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {analytics.completion >= 80
              ? "Great! Your CV is well-structured"
              : "Keep going! Complete more sections to improve your CV"}
          </p>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{analytics.experienceCount}</div>
          <div className="text-xs text-muted-foreground">Experience</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{analytics.educationCount}</div>
          <div className="text-xs text-muted-foreground">Education</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{analytics.skillsCount}</div>
          <div className="text-xs text-muted-foreground">Skills</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-primary">{analytics.wordCount}</div>
          <div className="text-xs text-muted-foreground">Summary Words</div>
        </Card>
      </div>

      {/* Tips and Warnings */}
      <div className="space-y-4">
        {analytics.warnings.length > 0 && (
          <Card className="p-4 border-amber-200 bg-amber-50">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-2">Areas to Review</h3>
                <ul className="space-y-1">
                  {analytics.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-amber-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {analytics.tips.length > 0 && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Optimization Tips</h3>
                <ul className="space-y-1">
                  {analytics.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-700">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {analytics.completion >= 80 && (
          <Card className="p-4 border-green-200 bg-green-50">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-800 mb-1">Well Done!</h3>
                <p className="text-sm text-green-700">
                  Your CV is well-structured and ready for applications. Consider reviewing the tips above for further optimization.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
