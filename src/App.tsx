import React, { useState, useEffect, useRef } from 'react';
import { CVData } from './types/cv';
import HarvardTemplate from './templates/HarvardTemplate';
import ModernTemplate from './templates/ModernTemplate';
import { Download, Plus, Trash2, Sun, Moon, Loader2, FileText, Layout } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { generateWord } from './utils/wordGenerator';

const initialData: CVData = {
  personalInfo: {
    fullName: "JUAN PÉREZ",
    email: "juan.perez@email.com",
    phone: "555-0123",
    location: "Ciudad de México, México",
    linkedin: "linkedin.com/in/juanperez",
    github: "github.com/juanperez"
  },
  education: [
    {
      id: '1',
      school: "Universidad Nacional Autónoma de México",
      degree: "Licenciatura en Ingeniería en Computación",
      location: "CDMX",
      dates: "2018 – 2022",
      details: ["Mención Honorífica", "Promedio: 9.5/10"]
    }
  ],
  experience: [
    {
      id: '1',
      company: "Tech Solutions Inc.",
      position: "Ingeniero de Software Senior",
      location: "Remoto",
      dates: "2022 – Presente",
      details: [
        "Liderazgo del equipo de desarrollo backend para una plataforma escalable",
        "Optimización de consultas SQL resultando en una mejora del 40% en tiempos de respuesta",
        "Implementación de arquitectura de microservicios utilizando Node.js y Docker"
      ]
    }
  ],
  projects: [
    {
      id: '1',
      name: "Sistema de Gestión de Inventarios",
      description: "Desarrollo de una aplicación web para el control de stock en tiempo real.",
      technologies: ["React", "Firebase", "Tailwind CSS"],
      link: "github.com/juanperez/inventario",
      dates: "2023"
    }
  ],
  certifications: [
    {
      id: '1',
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023"
    }
  ],
  volunteering: [],
  publications: [],
  skills: {
    languages: ["Español (Nativo)", "Inglés (C1)"],
    technical: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
    interests: ["Inteligencia Artificial", "Ciclismo", "Lectura de Ciencia Ficción"]
  }
};

function App() {
  const cvRef = useRef<HTMLDivElement>(null);
  const [cvData, setCvData] = useState<CVData>(() => {
    const saved = localStorage.getItem('cv-data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark-mode');
    return saved === 'true';
  });

  const [isWordDownloading, setIsWordDownloading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<'harvard' | 'modern'>(() => {
    const saved = localStorage.getItem('active-template');
    return (saved as 'harvard' | 'modern') || 'harvard';
  });

  useEffect(() => {
    localStorage.setItem('active-template', activeTemplate);
  }, [activeTemplate]);

  useEffect(() => {
    localStorage.setItem('cv-data', JSON.stringify(cvData));
  }, [cvData]);

  useEffect(() => {
    localStorage.setItem('dark-mode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value }
    }));
  };

  const downloadPDF = () => {
    window.print();
  };

  const downloadWord = async () => {
    try {
      setIsWordDownloading(true);
      await generateWord(cvData);
    } catch (error) {
      console.error('Error generating Word:', error);
      alert('Hubo un error al generar el archivo Word.');
    } finally {
      setIsWordDownloading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-300`}>
      {/* Editor Sidebar */}
      <aside className={`w-full md:w-[450px] shrink-0 p-10 shadow-2xl overflow-y-auto max-h-screen no-print ${darkMode ? 'bg-slate-800 border-r border-slate-700' : 'bg-white'} transition-all duration-300`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl shadow-lg ${darkMode ? 'bg-blue-500/20 shadow-blue-900/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>CVListo</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition-all ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            title={darkMode ? "Modo Claro" : "Modo Oscuro"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Template Selector */}
        <section className="mb-8">
          <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 border-b pb-2 ${darkMode ? 'text-indigo-400 border-slate-700' : 'text-indigo-600 border-slate-100'}`}>Estilo de CV</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTemplate('harvard')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeTemplate === 'harvard' 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500' 
                : (darkMode ? 'border-slate-700 bg-slate-700/30 text-slate-400' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300')}`}
            >
              <Layout size={20} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Harvard</span>
            </button>
            <button
              onClick={() => setActiveTemplate('modern')}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeTemplate === 'modern' 
                ? 'border-rose-500 bg-rose-500/10 text-rose-500' 
                : (darkMode ? 'border-slate-700 bg-slate-700/30 text-slate-400' : 'border-slate-200 bg-white text-slate-500 hover:border-rose-300')}`}
            >
              <Layout size={20} className="rotate-90" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Moderno</span>
            </button>
          </div>
        </section>
        
        {/* Personal Info */}
        <section className="mb-8">
          <h2 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 border-b pb-2 ${darkMode ? 'text-indigo-400 border-slate-700' : 'text-indigo-600 border-slate-100'}`}>Información Personal</h2>
          <div className="space-y-3">
            <input
              className={`w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}
              placeholder="Nombre Completo"
              name="fullName"
              value={cvData.personalInfo.fullName}
              onChange={handlePersonalInfoChange}
            />
            <input
              className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
              placeholder="Email"
              name="email"
              value={cvData.personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
            <input
              className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
              placeholder="Teléfono"
              name="phone"
              value={cvData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
            <input
              className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
              placeholder="Ubicación"
              name="location"
              value={cvData.personalInfo.location}
              onChange={handlePersonalInfoChange}
            />
          </div>
        </section>

        {/* Education */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Educación</h2>
            <button 
              onClick={() => {
                const newEdu = { id: Date.now().toString(), school: '', degree: '', location: '', dates: '', details: [] };
                setCvData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-2 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Universidad"
                value={edu.school}
                onChange={(e) => {
                  const newEdu = [...cvData.education];
                  newEdu[index].school = e.target.value;
                  setCvData({ ...cvData, education: newEdu });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent italic ${darkMode ? 'text-slate-300' : ''}`}
                placeholder="Grado / Carrera"
                value={edu.degree}
                onChange={(e) => {
                  const newEdu = [...cvData.education];
                  newEdu[index].degree = e.target.value;
                  setCvData({ ...cvData, education: newEdu });
                }}
              />
              <div className="flex gap-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Ubicación"
                  value={edu.location}
                  onChange={(e) => {
                    const newEdu = [...cvData.education];
                    newEdu[index].location = e.target.value;
                    setCvData({ ...cvData, education: newEdu });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fechas (ej. 2018 - 2022)"
                  value={edu.dates}
                  onChange={(e) => {
                    const newEdu = [...cvData.education];
                    newEdu[index].dates = e.target.value;
                    setCvData({ ...cvData, education: newEdu });
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Experiencia</h2>
            <button 
              onClick={() => {
                const newExp = { id: Date.now().toString(), company: '', position: '', location: '', dates: '', details: [''] };
                setCvData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Empresa"
                value={exp.company}
                onChange={(e) => {
                  const newExp = [...cvData.experience];
                  newExp[index].company = e.target.value;
                  setCvData({ ...cvData, experience: newExp });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent italic ${darkMode ? 'text-slate-300' : ''}`}
                placeholder="Cargo"
                value={exp.position}
                onChange={(e) => {
                  const newExp = [...cvData.experience];
                  newExp[index].position = e.target.value;
                  setCvData({ ...cvData, experience: newExp });
                }}
              />
              <div className="flex gap-2 mb-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Ubicación"
                  value={exp.location}
                  onChange={(e) => {
                    const newExp = [...cvData.experience];
                    newExp[index].location = e.target.value;
                    setCvData({ ...cvData, experience: newExp });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fechas"
                  value={exp.dates}
                  onChange={(e) => {
                    const newExp = [...cvData.experience];
                    newExp[index].dates = e.target.value;
                    setCvData({ ...cvData, experience: newExp });
                  }}
                />
              </div>
              <div className="space-y-1">
                {exp.details.map((detail, dIdx) => (
                  <input
                    key={dIdx}
                    className={`w-full p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                    placeholder="Logro o responsabilidad"
                    value={detail}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index].details[dIdx] = e.target.value;
                      setCvData({ ...cvData, experience: newExp });
                    }}
                  />
                ))}
                <button 
                  onClick={() => {
                    const newExp = [...cvData.experience];
                    newExp[index].details.push('');
                    setCvData({ ...cvData, experience: newExp });
                  }}
                  className="text-[10px] text-blue-500 hover:text-blue-400 mt-1"
                >
                  + Añadir viñeta
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Proyectos</h2>
            <button 
              onClick={() => {
                const newProj = { id: Date.now().toString(), name: '', description: '', technologies: [], link: '', dates: '' };
                setCvData(prev => ({ ...prev, projects: [...(prev.projects || []), newProj] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {(cvData.projects || []).map((proj, index) => (
            <div key={proj.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, projects: (prev.projects || []).filter(p => p.id !== proj.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Nombre del Proyecto"
                value={proj.name}
                onChange={(e) => {
                  const newProjects = [...(cvData.projects || [])];
                  newProjects[index].name = e.target.value;
                  setCvData({ ...cvData, projects: newProjects });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-300' : ''}`}
                placeholder="Descripción corta"
                value={proj.description}
                onChange={(e) => {
                  const newProjects = [...(cvData.projects || [])];
                  newProjects[index].description = e.target.value;
                  setCvData({ ...cvData, projects: newProjects });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                placeholder="Tecnologías (separadas por coma)"
                value={proj.technologies?.join(', ') || ''}
                onChange={(e) => {
                  const newProjects = [...(cvData.projects || [])];
                  newProjects[index].technologies = e.target.value.split(',').map(s => s.trim());
                  setCvData({ ...cvData, projects: newProjects });
                }}
              />
              <div className="flex gap-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Link"
                  value={proj.link || ''}
                  onChange={(e) => {
                    const newProjects = [...(cvData.projects || [])];
                    newProjects[index].link = e.target.value;
                    setCvData({ ...cvData, projects: newProjects });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fecha/Año"
                  value={proj.dates || ''}
                  onChange={(e) => {
                    const newProjects = [...(cvData.projects || [])];
                    newProjects[index].dates = e.target.value;
                    setCvData({ ...cvData, projects: newProjects });
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Certifications */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Certificaciones</h2>
            <button 
              onClick={() => {
                const newCert = { id: Date.now().toString(), name: '', issuer: '', date: '' };
                setCvData(prev => ({ ...prev, certifications: [...(prev.certifications || []), newCert] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {(cvData.certifications || []).map((cert, index) => (
            <div key={cert.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, certifications: (prev.certifications || []).filter(c => c.id !== cert.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Nombre de la Certificación"
                value={cert.name}
                onChange={(e) => {
                  const newCerts = [...(cvData.certifications || [])];
                  newCerts[index].name = e.target.value;
                  setCvData({ ...cvData, certifications: newCerts });
                }}
              />
              <div className="flex gap-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Emisor"
                  value={cert.issuer}
                  onChange={(e) => {
                    const newCerts = [...(cvData.certifications || [])];
                    newCerts[index].issuer = e.target.value;
                    setCvData({ ...cvData, certifications: newCerts });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fecha"
                  value={cert.date}
                  onChange={(e) => {
                    const newCerts = [...(cvData.certifications || [])];
                    newCerts[index].date = e.target.value;
                    setCvData({ ...cvData, certifications: newCerts });
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Volunteering */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Voluntariado</h2>
            <button 
              onClick={() => {
                const newVol = { id: Date.now().toString(), organization: '', role: '', location: '', dates: '', details: [''] };
                setCvData(prev => ({ ...prev, volunteering: [...(prev.volunteering || []), newVol] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {(cvData.volunteering || []).map((vol, index) => (
            <div key={vol.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, volunteering: (prev.volunteering || []).filter(v => v.id !== vol.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Organización"
                value={vol.organization}
                onChange={(e) => {
                  const newVol = [...(cvData.volunteering || [])];
                  newVol[index].organization = e.target.value;
                  setCvData({ ...cvData, volunteering: newVol });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent italic ${darkMode ? 'text-slate-300' : ''}`}
                placeholder="Rol"
                value={vol.role}
                onChange={(e) => {
                  const newVol = [...(cvData.volunteering || [])];
                  newVol[index].role = e.target.value;
                  setCvData({ ...cvData, volunteering: newVol });
                }}
              />
              <div className="flex gap-2 mb-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Ubicación"
                  value={vol.location || ''}
                  onChange={(e) => {
                    const newVol = [...(cvData.volunteering || [])];
                    newVol[index].location = e.target.value;
                    setCvData({ ...cvData, volunteering: newVol });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fechas"
                  value={vol.dates}
                  onChange={(e) => {
                    const newVol = [...(cvData.volunteering || [])];
                    newVol[index].dates = e.target.value;
                    setCvData({ ...cvData, volunteering: newVol });
                  }}
                />
              </div>
              <div className="space-y-1">
                {(vol.details || []).map((detail, dIdx) => (
                  <input
                    key={dIdx}
                    className={`w-full p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                    placeholder="Logro o responsabilidad"
                    value={detail}
                    onChange={(e) => {
                      const newVol = [...(cvData.volunteering || [])];
                      if (newVol[index].details) {
                        newVol[index].details![dIdx] = e.target.value;
                      }
                      setCvData({ ...cvData, volunteering: newVol });
                    }}
                  />
                ))}
                <button 
                  onClick={() => {
                    const newVol = [...(cvData.volunteering || [])];
                    newVol[index].details = [...(newVol[index].details || []), ''];
                    setCvData({ ...cvData, volunteering: newVol });
                  }}
                  className="text-[10px] text-blue-500 hover:text-blue-400 mt-1"
                >
                  + Añadir viñeta
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Publications */}
        <section className="mb-8">
          <div className={`flex justify-between items-center mb-4 border-b pb-2 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <h2 className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Publicaciones</h2>
            <button 
              onClick={() => {
                const newPub = { id: Date.now().toString(), title: '', publisher: '', date: '', link: '' };
                setCvData(prev => ({ ...prev, publications: [...(prev.publications || []), newPub] }));
              }}
              className="text-blue-500 hover:text-blue-400"
            >
              <Plus size={18} />
            </button>
          </div>
          {(cvData.publications || []).map((pub, index) => (
            <div key={pub.id} className={`mb-4 p-4 rounded-lg border relative transition-colors ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
              <button 
                onClick={() => setCvData(prev => ({ ...prev, publications: (prev.publications || []).filter(p => p.id !== pub.id) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent font-semibold ${darkMode ? 'text-white' : ''}`}
                placeholder="Título de la publicación"
                value={pub.title}
                onChange={(e) => {
                  const newPubs = [...(cvData.publications || [])];
                  newPubs[index].title = e.target.value;
                  setCvData({ ...cvData, publications: newPubs });
                }}
              />
              <input
                className={`w-full mb-1 p-1 text-sm border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-300' : ''}`}
                placeholder="Revista / Editor"
                value={pub.publisher}
                onChange={(e) => {
                  const newPubs = [...(cvData.publications || [])];
                  newPubs[index].publisher = e.target.value;
                  setCvData({ ...cvData, publications: newPubs });
                }}
              />
              <div className="flex gap-2">
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Link"
                  value={pub.link || ''}
                  onChange={(e) => {
                    const newPubs = [...(cvData.publications || [])];
                    newPubs[index].link = e.target.value;
                    setCvData({ ...cvData, publications: newPubs });
                  }}
                />
                <input
                  className={`w-1/2 p-1 text-xs border-b border-transparent focus:border-blue-400 outline-none bg-transparent ${darkMode ? 'text-slate-400' : ''}`}
                  placeholder="Fecha"
                  value={pub.date}
                  onChange={(e) => {
                    const newPubs = [...(cvData.publications || [])];
                    newPubs[index].date = e.target.value;
                    setCvData({ ...cvData, publications: newPubs });
                  }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 border-b pb-2 ${darkMode ? 'text-slate-400 border-slate-700' : 'text-slate-500 border-slate-200'}`}>Habilidades e Intereses</h2>
          <div className="space-y-4">
            <div>
              <label className={`text-[10px] uppercase font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Idiomas</label>
              <input
                className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
                placeholder="Ej. Español (Nativo), Inglés (C1)"
                value={cvData.skills.languages.join(', ')}
                onChange={(e) => setCvData({ ...cvData, skills: { ...cvData.skills, languages: e.target.value.split(',').map(s => s.trim()) } })}
              />
            </div>
            <div>
              <label className={`text-[10px] uppercase font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Técnicas</label>
              <input
                className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
                placeholder="Ej. React, Node.js, SQL"
                value={cvData.skills.technical.join(', ')}
                onChange={(e) => setCvData({ ...cvData, skills: { ...cvData.skills, technical: e.target.value.split(',').map(s => s.trim()) } })}
              />
            </div>
            <div>
              <label className={`text-[10px] uppercase font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Intereses</label>
              <input
                className={`w-full p-2 border rounded text-sm transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200'}`}
                placeholder="Ej. IA, Ciclismo"
                value={cvData.skills.interests.join(', ')}
                onChange={(e) => setCvData({ ...cvData, skills: { ...cvData.skills, interests: e.target.value.split(',').map(s => s.trim()) } })}
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={downloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-500/25 active:scale-95"
          >
            <Download size={20} />
            Descargar PDF
          </button>

          <button
            onClick={downloadWord}
            disabled={isWordDownloading}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 px-4 rounded-xl hover:bg-slate-900 transition-all font-semibold shadow-lg shadow-slate-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
          >
            {isWordDownloading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generando Word...
              </>
            ) : (
              <>
                <FileText size={20} />
                Descargar Word (.docx)
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Preview Area */}
      <main className={`flex-1 p-8 md:p-12 flex justify-center overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div 
          ref={cvRef}
          className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] origin-top transition-all print-container overflow-hidden"
        >
          {activeTemplate === 'harvard' ? (
            <div className="p-[25mm]">
              <HarvardTemplate data={cvData} />
            </div>
          ) : (
            <ModernTemplate data={cvData} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
