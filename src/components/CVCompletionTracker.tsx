import { useCVContext } from "@/contexts/CVContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Circle,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  Users,
} from "lucide-react";

interface CompletionItem {
  id: string;
  label: string;
  description: string;
  weight: number;
  isCompleted: boolean;
  icon: React.ReactNode;
  tips?: string[];
}

export const CVCompletionTracker = () => {
  const { cvData } = useCVContext();

  const completionItems: CompletionItem[] = [
    {
      id: "personalDetails",
      label: "Personal Details",
      description: "Basic contact information",
      weight: 15,
      isCompleted: !!(
        cvData.personalDetails.fullName && cvData.personalDetails.email
      ),
      icon: <Users className="h-4 w-4" />,
      tips: [
        "Include professional email",
        "Add LinkedIn profile",
        "Use current phone number",
      ],
    },
    {
      id: "professionalSummary",
      label: "Professional Summary",
      description: "Compelling career overview",
      weight: 20,
      isCompleted: cvData.professionalSummary.length > 50,
      icon: <Target className="h-4 w-4" />,
      tips: [
        "Keep it 2-3 sentences",
        "Use action verbs",
        "Highlight key achievements",
      ],
    },
    {
      id: "workExperience",
      label: "Work Experience",
      description: "Professional history and achievements",
      weight: 30,
      isCompleted: cvData.workExperience.length > 0,
      icon: <TrendingUp className="h-4 w-4" />,
      tips: [
        "Quantify achievements",
        "Use bullet points",
        "Include relevant keywords",
      ],
    },
    {
      id: "education",
      label: "Education",
      description: "Academic qualifications and training",
      weight: 15,
      isCompleted: cvData.education.length > 0,
      icon: <Award className="h-4 w-4" />,
      tips: [
        "Include relevant degrees",
        "Add certifications",
        "List academic achievements",
      ],
    },
    {
      id: "skills",
      label: "Skills",
      description: "Technical and soft skills",
      weight: 20,
      isCompleted: cvData.skills.length >= 5,
      icon: <Zap className="h-4 w-4" />,
      tips: [
        "List relevant skills",
        "Include proficiency levels",
        "Match job requirements",
      ],
    },
  ];

  const totalWeight = completionItems.reduce(
    (sum, item) => sum + item.weight,
    0
  );
  const completedWeight = completionItems
    .filter((item) => item.isCompleted)
    .reduce((sum, item) => sum + item.weight, 0);

  const completionPercentage = Math.round(
    (completedWeight / totalWeight) * 100
  );
  const completedItems = completionItems.filter(
    (item) => item.isCompleted
  ).length;
  const totalItems = completionItems.length;

  const getCompletionLevel = () => {
    if (completionPercentage >= 90)
      return {
        level: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-100",
      };
    if (completionPercentage >= 70)
      return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (completionPercentage >= 50)
      return {
        level: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      };
    return {
      level: "Needs Work",
      color: "text-red-600",
      bgColor: "bg-red-100",
    };
  };

  const completionLevel = getCompletionLevel();

  const getNextSteps = () => {
    const incompleteItems = completionItems.filter((item) => !item.isCompleted);
    if (incompleteItems.length === 0) {
      return [
        "Your CV is complete! Consider adding more achievements or skills.",
        "Review and optimize your content for ATS systems.",
      ];
    }
    return incompleteItems
      .slice(0, 2)
      .map((item) => `Complete your ${item.label.toLowerCase()}`);
  };

  const getMotivationalMessage = () => {
    if (completionPercentage === 100) {
      return "🎉 Congratulations! Your CV is complete and ready to impress employers.";
    }
    if (completionPercentage >= 80) {
      return "🚀 You're almost there! Just a few more details to make your CV perfect.";
    }
    if (completionPercentage >= 60) {
      return "💪 Great progress! Keep adding details to strengthen your CV.";
    }
    if (completionPercentage >= 40) {
      return "📈 You're making good progress. Focus on the most important sections first.";
    }
    return "🎯 Let's get started! Begin with your personal details and work experience.";
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                CV Completion
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedItems} of {totalItems} sections completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {completionPercentage}%
              </div>
              <Badge
                className={`${completionLevel.bgColor} ${completionLevel.color} border-0`}
              >
                {completionLevel.level}
              </Badge>
            </div>
          </div>

          <Progress value={completionPercentage} className="w-full" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </Card>

      {/* Section Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Section Progress
        </h3>
        <div className="space-y-3">
          {completionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div className="flex-shrink-0">
                {item.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <h4 className="font-medium text-foreground">{item.label}</h4>
                  <Badge variant="outline" className="text-xs">
                    {item.weight}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {!item.isCompleted && item.tips && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {item.tips.map((tip, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Next Steps
        </h3>
        <div className="space-y-2">
          {getNextSteps().map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="justify-start">
            <Target className="h-4 w-4 mr-2" />
            Add Work Experience
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Zap className="h-4 w-4 mr-2" />
            Add Skills
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Award className="h-4 w-4 mr-2" />
            Add Education
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Users className="h-4 w-4 mr-2" />
            Update Contact Info
          </Button>
        </div>
      </Card>

      {/* Achievement Badges */}
      {completionPercentage >= 50 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Progress Achievement!
            </h3>
            <p className="text-sm text-muted-foreground">
              You've completed {completionPercentage}% of your CV. Keep up the
              great work!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

