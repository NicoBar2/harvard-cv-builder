import React from 'react';
import { CVData } from '../types/cv';

interface Props {
  data: CVData;
}

const ModernTemplate: React.FC<Props> = ({ data }) => {
  const { personalInfo, education, experience, projects, certifications, skills } = data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getDateRange = (item: { startDate?: string, endDate?: string, isCurrent?: boolean, dates?: string }) => {
    if (item.dates && item.dates.trim() !== '') {
      return item.dates;
    }
    if (item.startDate) {
      const start = formatDate(item.startDate);
      const end = item.isCurrent ? 'Pres.' : formatDate(item.endDate);
      return `${start} - ${end}`;
    }
    return '';
  };

  return (
    <div className="font-sans text-[#2d3748] flex min-h-[297mm]">
      {/* Left Column (Sidebar) */}
      <div className="w-1/3 bg-[#1a202c] text-white p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold leading-tight mb-2 tracking-tight uppercase">
            {personalInfo.fullName.split(' ')[0]}<br/>
            <span className="text-indigo-400">{personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
        </header>

        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Contacto</h2>
          <div className="space-y-3 text-sm opacity-90">
            <p>{personalInfo.location}</p>
            <p>{personalInfo.phone}</p>
            <p className="break-all">{personalInfo.email}</p>
            {personalInfo.linkedin && <p className="break-all text-xs opacity-75">{personalInfo.linkedin}</p>}
            {personalInfo.website && <p className="break-all text-xs opacity-75">{personalInfo.website}</p>}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Habilidades</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold mb-2 opacity-75">Técnicas</p>
              <div className="flex flex-wrap gap-2">
                {skills.technical.map((s, i) => (
                  <span key={i} className="bg-slate-700 text-[10px] px-2 py-1 rounded">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2 opacity-75">Idiomas</p>
              <p className="text-sm">{skills.languages.join(', ')}</p>
            </div>
          </div>
        </section>

        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">Logros</h2>
            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.id}>
                  <p className="text-sm font-bold leading-tight">{c.name}</p>
                  <p className="text-[10px] opacity-60">{c.issuer} | {c.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column (Content) */}
      <div className="flex-1 p-10 bg-white">
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-indigo-100"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600">Experiencia</h2>
            <div className="h-px flex-1 bg-indigo-100"></div>
          </div>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{exp.position}</h3>
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{getDateRange(exp)}</span>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-3">{exp.company} • {exp.location}</p>
                <ul className="space-y-2">
                  {exp.details.map((d, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-indigo-400 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current"></span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-indigo-100"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600">Educación</h2>
            <div className="h-px flex-1 bg-indigo-100"></div>
          </div>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{edu.school}</h3>
                  <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{getDateRange(edu)}</span>
                </div>
                <p className="text-sm italic text-slate-600 mb-2">{edu.degree} • {edu.location}</p>
              </div>
            ))}
          </div>
        </section>

        {projects && projects.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-indigo-100"></div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600">Proyectos</h2>
              <div className="h-px flex-1 bg-indigo-100"></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{p.description}</p>
                  <p className="text-[10px] font-mono text-indigo-500">{p.technologies?.join(' • ')}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
