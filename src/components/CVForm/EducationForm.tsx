import { useCVContext } from '@/contexts/CVContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types/cv';

export const EducationForm = () => {
  const { cvData, updateEducation } = useCVContext();

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      grade: '',
    };
    updateEducation([...cvData.education, newEducation]);
  };

  const removeEducation = (id: string) => {
    updateEducation(cvData.education.filter((edu) => edu.id !== id));
  };

  const updateEducationItem = (id: string, updates: Partial<Education>) => {
    updateEducation(
      cvData.education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Education</h2>
        <Button onClick={addEducation} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {cvData.education.length === 0 ? (
        <p className="text-muted-foreground text-sm">No education added yet. Click "Add Education" to begin.</p>
      ) : (
        <div className="space-y-6">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-border rounded-lg space-y-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Education {index + 1}</h3>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Degree / Qualification</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                    placeholder="BSc Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                    placeholder="University of London"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => updateEducationItem(edu.id, { location: e.target.value })}
                  placeholder="London, UK"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducationItem(edu.id, { startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducationItem(edu.id, { endDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grade (optional)</Label>
                  <Input
                    value={edu.grade}
                    onChange={(e) => updateEducationItem(edu.id, { grade: e.target.value })}
                    placeholder="First Class Honours"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
