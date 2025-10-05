import { useCVContext } from '@/contexts/CVContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const PersonalDetailsForm = () => {
  const { cvData, updatePersonalDetails } = useCVContext();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Personal Details</h2>
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={cvData.personalDetails.fullName}
          onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
          placeholder="John Smith"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={cvData.personalDetails.email}
            onChange={(e) => updatePersonalDetails({ email: e.target.value })}
            placeholder="john.smith@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={cvData.personalDetails.phone}
            onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
            placeholder="07123 456789"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={cvData.personalDetails.location}
          onChange={(e) => updatePersonalDetails({ location: e.target.value })}
          placeholder="London, UK"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn (optional)</Label>
          <Input
            id="linkedIn"
            value={cvData.personalDetails.linkedIn}
            onChange={(e) => updatePersonalDetails({ linkedIn: e.target.value })}
            placeholder="linkedin.com/in/johnsmith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            value={cvData.personalDetails.website}
            onChange={(e) => updatePersonalDetails({ website: e.target.value })}
            placeholder="johnsmith.com"
          />
        </div>
      </div>
    </div>
  );
};
