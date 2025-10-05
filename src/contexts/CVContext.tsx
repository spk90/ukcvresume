import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { CVData, defaultCVData } from "@/types/cv";

interface CVContextType {
  cvData: CVData;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  saveVersion: (label?: string) => void;
  updatePersonalDetails: (details: Partial<CVData["personalDetails"]>) => void;
  updateProfessionalSummary: (summary: string) => void;
  updateWorkExperience: (experience: CVData["workExperience"]) => void;
  updateEducation: (education: CVData["education"]) => void;
  updateSkills: (skills: string[]) => void;
  updateTemplate: (template: CVData["template"]) => void;
  updateSettings: (settings: NonNullable<CVData["settings"]>) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cvData, setCVData] = useState<CVData>(() => {
    const saved = localStorage.getItem("cvData");
    return saved ? JSON.parse(saved) : defaultCVData;
  });
  const historyRef = useRef<CVData[]>([]);
  const futureRef = useRef<CVData[]>([]);
  const saveTimer = useRef<number | null>(null);

  // Debounced autosave
  useEffect(() => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      localStorage.setItem("cvData", JSON.stringify(cvData));
    }, 300);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [cvData]);

  const pushHistory = (next: CVData) => {
    historyRef.current.push(cvData);
    // Cap history to last 50 states
    if (historyRef.current.length > 50) historyRef.current.shift();
    futureRef.current = [];
    setCVData(next);
  };

  const undo = () => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    futureRef.current.push(cvData);
    setCVData(prev);
  };

  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(cvData);
    setCVData(next);
  };

  const canUndo = historyRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  const saveVersion = (label?: string) => {
    const versionsRaw = localStorage.getItem("cvVersions");
    const versions: Array<{
      id: string;
      label?: string;
      data: CVData;
      date: string;
    }> = versionsRaw ? JSON.parse(versionsRaw) : [];
    versions.unshift({
      id: String(Date.now()),
      label,
      data: cvData,
      date: new Date().toISOString(),
    });
    // Cap to 20 saved versions
    localStorage.setItem("cvVersions", JSON.stringify(versions.slice(0, 20)));
  };

  const updatePersonalDetails = (
    details: Partial<CVData["personalDetails"]>
  ) => {
    pushHistory({
      ...cvData,
      personalDetails: { ...cvData.personalDetails, ...details },
    });
  };

  const updateProfessionalSummary = (summary: string) => {
    pushHistory({ ...cvData, professionalSummary: summary });
  };

  const updateWorkExperience = (experience: CVData["workExperience"]) => {
    pushHistory({ ...cvData, workExperience: experience });
  };

  const updateEducation = (education: CVData["education"]) => {
    pushHistory({ ...cvData, education: education });
  };

  const updateSkills = (skills: string[]) => {
    pushHistory({ ...cvData, skills });
  };

  const updateTemplate = (template: CVData["template"]) => {
    pushHistory({ ...cvData, template });
  };

  const updateSettings = (settings: NonNullable<CVData["settings"]>) => {
    pushHistory({ ...cvData, settings: { ...cvData.settings, ...settings } });
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        canUndo,
        canRedo,
        undo,
        redo,
        saveVersion,
        updatePersonalDetails,
        updateProfessionalSummary,
        updateWorkExperience,
        updateEducation,
        updateSkills,
        updateTemplate,
        updateSettings,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext must be used within CVProvider");
  }
  return context;
};
