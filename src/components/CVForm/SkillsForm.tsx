import { useState } from "react";
import { useCVContext } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

export const SkillsForm = () => {
  const { cvData, updateSkills } = useCVContext();
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !cvData.skills.includes(skillInput.trim())) {
      updateSkills([...cvData.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateSkills(cvData.skills.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Skills</h2>

      <div className="space-y-2">
        <Label htmlFor="skill-input">Add Skills</Label>
        <div className="flex gap-2">
          <Input
            id="skill-input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Waiter, Customer service, Food hygiene"
          />
          <Button onClick={addSkill} size="icon" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Press Enter or click + to add a skill
        </p>
      </div>

      {cvData.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-sm px-3 py-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-destructive"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
