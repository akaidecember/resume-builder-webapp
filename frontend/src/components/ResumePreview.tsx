export default function ResumePreview({
  resumeData,
  sectionOrder,
  fontSize,
  margins
}: any) {
  const renderBulletPoints = (text: string | string[]) => {
    if (!text) return [];
    const points = Array.isArray(text) ? text : text.split("\n");
    return points.filter(p => p.trim());
  };

  const formatLink = (url: string) => {
    if (!url) return null;
    if (!url.startsWith("http")) url = "https://" + url;
    return url;
  };

  const pageWidthInch = 8.5 - margins.left - margins.right;

  return (
    <div className="flex justify-center py-8 px-4">
      <div
        className="bg-white text-black shadow-lg"
        style={{
          maxWidth: `${pageWidthInch}in`,
          paddingTop: `${margins.top}in`,
          paddingBottom: `${margins.bottom}in`,
          paddingLeft: `${margins.left}in`,
          paddingRight: `${margins.right}in`,
          fontSize: `${fontSize}pt`,
          fontFamily: "Times New Roman, serif",
        } as any}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-3 mb-3">
          <h1 className="text-3xl font-bold">{resumeData.full_name}</h1>
          <div className="text-xs mt-1 flex justify-center flex-wrap gap-1">
            {resumeData.phone_number && <span>{resumeData.phone_number}</span>}
            {resumeData.email && (
              <>
                <span>•</span>
                <a href={`mailto:${resumeData.email}`} className="underline text-blue-600">
                  {resumeData.email}
                </a>
              </>
            )}
            {formatLink(resumeData.linkedin_url) && (
              <>
                <span>•</span>
                <a href={formatLink(resumeData.linkedin_url)!} target="_blank" rel="noopener" className="underline text-blue-600">
                  LinkedIn
                </a>
              </>
            )}
            {formatLink(resumeData.github_link) && (
              <>
                <span>•</span>
                <a href={formatLink(resumeData.github_link)!} target="_blank" rel="noopener" className="underline text-blue-600">
                  GitHub
                </a>
              </>
            )}
            {resumeData.location && (
              <>
                <span>•</span>
                <span>{resumeData.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-3">
            <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Summary</h2>
            <p className="text-xs leading-tight">{resumeData.summary}</p>
          </div>
        )}

        {/* Sections */}
        {sectionOrder.map((section: string) => {
          if (section === "education" && resumeData.education?.length > 0) {
            return (
              <div key={section} className="mb-3">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Education</h2>
                {resumeData.education.map((edu: any, i: number) => (
                  <div key={i} className="mb-1">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold">{edu.degree}</span> • <span className="italic">{edu.university}</span>
                      </div>
                      <span className="font-bold">{edu.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">{edu.location}</div>
                  </div>
                ))}
              </div>
            );
          }

          if (section === "experience" && resumeData.experience?.length > 0) {
            return (
              <div key={section} className="mb-3">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Experience</h2>
                {resumeData.experience.map((exp: any, i: number) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold">{exp.title}</span> • <span className="font-semibold">{exp.company}</span>
                      </div>
                      <span className="font-bold">{exp.date}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{exp.location}</div>
                    <ul className="text-xs leading-tight list-disc list-inside">
                      {renderBulletPoints(exp.description).map((point: string, j: number) => (
                        <li key={j} className="text-gray-800">{point.trim()}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          }

          if (section === "skills" && resumeData.skills?.length > 0) {
            return (
              <div key={section} className="mb-3">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Technical Skills</h2>
                {resumeData.skills.map((skill: any, i: number) => (
                  <div key={i} className="mb-1 text-xs">
                    <span className="font-bold">{skill.name}:</span> <span>{skill.value}</span>
                  </div>
                ))}
              </div>
            );
          }

          if (section === "projects" && resumeData.projects?.length > 0) {
            return (
              <div key={section} className="mb-3">
                <h2 className="text-sm font-bold uppercase border-b border-black mb-1">Projects</h2>
                {resumeData.projects.map((proj: any, i: number) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-start text-xs">
                      <span className="font-bold">{proj.title}</span>
                      <span className="font-bold">{proj.date}</span>
                    </div>
                    <div className="text-xs text-gray-600">{proj.tech_stack}</div>
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}