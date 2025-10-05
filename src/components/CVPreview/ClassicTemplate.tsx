import { CVData } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface ClassicTemplateProps {
  data: CVData;
}

export const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white text-gray-900 p-8 shadow-lg min-h-[297mm]">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          {data.personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {data.personalDetails.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{data.personalDetails.email}</span>
            </div>
          )}
          {data.personalDetails.phone && (
            <span>•</span>
          )}
          {data.personalDetails.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{data.personalDetails.phone}</span>
            </div>
          )}
          {data.personalDetails.location && (
            <span>•</span>
          )}
          {data.personalDetails.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{data.personalDetails.location}</span>
            </div>
          )}
        </div>
        {(data.personalDetails.linkedIn || data.personalDetails.website) && (
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600 mt-2">
            {data.personalDetails.linkedIn && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span>{data.personalDetails.linkedIn}</span>
              </div>
            )}
            {data.personalDetails.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{data.personalDetails.website}</span>
              </div>
            )}
          </div>
        )}
      </header>

      <hr className="border-t-2 border-gray-800 mb-6" />

      {/* Professional Summary */}
      {data.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify">{data.professionalSummary}</p>
        </section>
      )}

      {/* Work Experience */}
      {data.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                </div>
                <p className="italic text-gray-700 mb-2">
                  {exp.company} • {exp.location}
                </p>
                {exp.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution} • {edu.location}</p>
                    {edu.grade && <p className="text-sm text-gray-600 italic">{edu.grade}</p>}
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">
            Key Skills
          </h2>
          <p className="text-gray-700">{data.skills.join(' • ')}</p>
        </section>
      )}
    </div>
  );
};
