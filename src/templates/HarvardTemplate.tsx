import React from 'react';
import { CVData } from '../types/cv';

interface Props {
  data: CVData;
}

const HarvardTemplate: React.FC<Props> = ({ data }) => {
  const { 
    personalInfo, 
    education, 
    experience, 
    projects, 
    certifications, 
    volunteering,
    publications,
    skills 
  } = data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getDateRange = (item: { startDate?: string, endDate?: string, isCurrent?: boolean, dates?: string }) => {
    if (item.dates && item.dates.trim() !== '') {
      return item.dates;
    }
    if (item.startDate) {
      const start = formatDate(item.startDate);
      const end = item.isCurrent ? 'Presente' : formatDate(item.endDate);
      return `${start} – ${end}`;
    }
    return '';
  };

  return (
    <div className="harvard-font text-[11pt] leading-relaxed text-[#1a1a1a]">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm italic">
          <span>{personalInfo.location}</span>
          <span className="hidden sm:inline">•</span>
          <span>{personalInfo.phone}</span>
          <span className="hidden sm:inline">•</span>
          <span>{personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="hidden sm:inline">•</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </header>

      {/* Education Section */}
      <section className="mb-6">
        <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Educación</h2>
        {education.map((edu) => (
          <div key={edu.id} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline font-bold">
              <span>{edu.school}</span>
              <span className="font-normal italic text-sm">{edu.location}</span>
            </div>
            <div className="flex justify-between items-baseline italic">
              <span>{edu.degree}</span>
              <span className="font-normal not-italic text-sm">{getDateRange(edu)}</span>
            </div>
            {edu.details && edu.details.length > 0 && (
              <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[10.5pt]">
                {edu.details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Experience Section */}
      <section className="mb-6">
        <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Experiencia Profesional</h2>
        {experience.map((exp) => (
          <div key={exp.id} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline font-bold">
              <span>{exp.company}</span>
              <span className="font-normal italic text-sm">{exp.location}</span>
            </div>
            <div className="flex justify-between items-baseline italic">
              <span>{exp.position}</span>
              <span className="font-normal not-italic text-sm">{getDateRange(exp)}</span>
            </div>
            <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[10.5pt]">
              {exp.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Proyectos</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline font-bold">
                <div className="flex items-center gap-2">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <span className="text-xs font-normal italic lowercase">{proj.link}</span>
                  )}
                </div>
                {proj.dates && (
                  <span className="font-normal not-italic text-sm">{proj.dates}</span>
                )}
              </div>
              <p className="text-[10.5pt] mt-0.5">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="text-[10pt] mt-1 italic">
                  <span className="font-semibold not-italic">Tecnologías: </span>
                  {proj.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Certificaciones</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-1 last:mb-0">
              <div className="text-[10.5pt]">
                <span className="font-bold">{cert.name}</span>
                <span className="italic"> — {cert.issuer}</span>
              </div>
              <span className="text-sm">{cert.date}</span>
            </div>
          ))}
        </section>
      )}

      {/* Volunteering Section */}
      {volunteering && volunteering.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Voluntariado / Liderazgo</h2>
          {volunteering.map((vol) => (
            <div key={vol.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline font-bold">
                <span>{vol.organization}</span>
                {vol.location && (
                  <span className="font-normal italic text-sm">{vol.location}</span>
                )}
              </div>
              <div className="flex justify-between items-baseline italic">
                <span>{vol.role}</span>
                <span className="font-normal not-italic text-sm">{vol.dates}</span>
              </div>
              {vol.details && vol.details.length > 0 && (
                <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[10.5pt]">
                  {vol.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Publications Section */}
      {publications && publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Publicaciones</h2>
          {publications.map((pub) => (
            <div key={pub.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline font-bold">
                <div className="flex items-center gap-2">
                  <span>{pub.title}</span>
                  {pub.link && (
                    <span className="text-xs font-normal italic lowercase">{pub.link}</span>
                  )}
                </div>
                <span className="font-normal not-italic text-sm">{pub.date}</span>
              </div>
              <p className="text-[10.5pt] italic">{pub.publisher}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills & Interests Section */}
      <section className="mb-6">
        <h2 className="text-base font-bold uppercase border-b border-black mb-2 pb-0.5">Habilidades e Intereses</h2>
        <div className="space-y-1 text-[10.5pt]">
          {skills.languages.length > 0 && (
            <div>
              <span className="font-bold">Idiomas: </span>
              <span>{skills.languages.join(', ')}</span>
            </div>
          )}
          {skills.technical.length > 0 && (
            <div>
              <span className="font-bold">Habilidades Técnicas: </span>
              <span>{skills.technical.join(', ')}</span>
            </div>
          )}
          {skills.interests.length > 0 && (
            <div>
              <span className="font-bold">Intereses: </span>
              <span>{skills.interests.join(', ')}</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HarvardTemplate;
