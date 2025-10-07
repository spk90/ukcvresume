import { useCVContext } from "@/contexts/CVContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface SavedVersion {
  id: string;
  label?: string;
  data: any;
  date: string;
}

export const VersionManager = () => {
  const { cvData, saveVersion, updatePersonalDetails, updateProfessionalSummary, updateWorkExperience, updateEducation, updateSkills, updateTemplate } = useCVContext();
  const [versions, setVersions] = useState<SavedVersion[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("cvVersions");
    if (saved) {
      setVersions(JSON.parse(saved));
    }
  }, []);

  const handleSaveVersion = () => {
    saveVersion(newLabel || undefined);
    setNewLabel("");
    toast({
      title: "Version Saved",
      description: "Your CV has been saved successfully.",
    });
    // Refresh versions
    const saved = localStorage.getItem("cvVersions");
    if (saved) {
      setVersions(JSON.parse(saved));
    }
  };

  const handleLoadVersion = (version: SavedVersion) => {
    updatePersonalDetails(version.data.personalDetails);
    updateProfessionalSummary(version.data.professionalSummary);
    updateWorkExperience(version.data.workExperience);
    updateEducation(version.data.education);
    updateSkills(version.data.skills);
    updateTemplate(version.data.template);
    
    toast({
      title: "Version Loaded",
      description: `Loaded version: ${version.label || "Untitled"}`,
    });
  };

  const handleDeleteVersion = (id: string) => {
    const updated = versions.filter(v => v.id !== id);
    localStorage.setItem("cvVersions", JSON.stringify(updated));
    setVersions(updated);
    toast({
      title: "Version Deleted",
      description: "Version has been removed.",
    });
  };

  const handleExportVersion = (version: SavedVersion) => {
    const dataStr = JSON.stringify(version.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv-version-${version.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVersion = () => {
    try {
      const data = JSON.parse(importData);
      // Validate the data structure
      if (data.personalDetails && data.professionalSummary !== undefined) {
        updatePersonalDetails(data.personalDetails);
        updateProfessionalSummary(data.professionalSummary);
        updateWorkExperience(data.workExperience || []);
        updateEducation(data.education || []);
        updateSkills(data.skills || []);
        updateTemplate(data.template || "modern");
        
        setShowImport(false);
        setImportData("");
        toast({
          title: "Version Imported",
          description: "CV data has been imported successfully.",
        });
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid JSON data. Please check your file.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Version Manager</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(!showImport)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button onClick={handleSaveVersion} size="sm">
            Save Current
          </Button>
        </div>
      </div>

      {showImport && (
        <Card className="p-4">
          <div className="space-y-4">
            <Label>Import CV Data (JSON)</Label>
            <textarea
              className="w-full h-32 p-3 border border-border rounded-md resize-none"
              placeholder="Paste your CV JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleImportVersion} size="sm">
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImport(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Version label (optional)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {versions.length === 0 ? (
        <Card className="p-6 text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No saved versions yet</p>
          <p className="text-sm text-muted-foreground">
            Save your current CV to create your first version
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card key={version.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">
                      {version.label || "Untitled Version"}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {formatDate(version.date)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {version.data.personalDetails?.fullName || "No name set"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadVersion(version)}
                  >
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportVersion(version)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVersion(version.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
