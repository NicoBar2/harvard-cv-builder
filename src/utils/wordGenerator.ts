import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { CVData } from '../types/cv';

export const generateWord = async (data: CVData) => {
  const { personalInfo, education, experience, projects, certifications, volunteering, publications, skills } = data;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getDateRange = (item: { startDate?: string, endDate?: string, isCurrent?: boolean, dates?: string }) => {
    if (item.startDate) {
      const start = formatDate(item.startDate);
      const end = item.isCurrent ? 'Presente' : formatDate(item.endDate);
      return `${start} – ${end}`;
    }
    return item.dates || '';
  };

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720, // 0.5 inch
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: personalInfo.fullName.toUpperCase(),
              bold: true,
              size: 28, // 14pt
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 200 },
          children: [
            new TextRun({
              text: `${personalInfo.location} | ${personalInfo.phone} | ${personalInfo.email}`,
              size: 20, // 10pt
            }),
            personalInfo.linkedin ? new TextRun({ text: ` | ${personalInfo.linkedin}`, size: 20 }) : new TextRun(""),
            personalInfo.github ? new TextRun({ text: ` | ${personalInfo.github}`, size: 20 }) : new TextRun(""),
            personalInfo.website ? new TextRun({ text: ` | ${personalInfo.website}`, size: 20 }) : new TextRun(""),
          ],
        }),

        // Education
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          children: [new TextRun({ text: "EDUCACIÓN", bold: true, size: 22 })],
        }),
        ...education.flatMap(edu => [
          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: edu.school, bold: true }),
              new TextRun({ text: `\t${edu.location}`, bold: false, italics: true }),
            ],
            tabStops: [{ type: "right", position: 9000 }], // Align location to right
          }),
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree, italics: true }),
              new TextRun({ text: `\t${getDateRange(edu)}`, italics: false }),
            ],
            tabStops: [{ type: "right", position: 9000 }],
          }),
          ...(edu.details || []).map(detail => 
            new Paragraph({
              text: detail,
              bullet: { level: 0 },
              spacing: { before: 50 },
            })
          ),
        ]),

        // Experience
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300 },
          border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          children: [new TextRun({ text: "EXPERIENCIA PROFESIONAL", bold: true, size: 22 })],
        }),
        ...experience.flatMap(exp => [
          new Paragraph({
            spacing: { before: 200 },
            children: [
              new TextRun({ text: exp.company, bold: true }),
              new TextRun({ text: `\t${exp.location}`, bold: false, italics: true }),
            ],
            tabStops: [{ type: "right", position: 9000 }],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: exp.position, italics: true }),
              new TextRun({ text: `\t${getDateRange(exp)}`, italics: false }),
            ],
            tabStops: [{ type: "right", position: 9000 }],
          }),
          ...exp.details.map(detail => 
            new Paragraph({
              text: detail,
              bullet: { level: 0 },
              spacing: { before: 50 },
            })
          ),
        ]),

        // Projects
        ...(projects && projects.length > 0 ? [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "PROYECTOS", bold: true, size: 22 })],
          }),
          ...projects.flatMap(proj => [
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({ text: proj.name, bold: true }),
                new TextRun({ text: `\t${proj.dates || ''}`, bold: false }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            }),
            new Paragraph({
              children: [new TextRun({ text: proj.description })],
            }),
            proj.technologies ? new Paragraph({
              children: [
                new TextRun({ text: "Tecnologías: ", bold: true }),
                new TextRun({ text: proj.technologies.join(", "), italics: true }),
              ],
            }) : new Paragraph({ text: "" }),
          ])
        ] : []),

        // Certifications
        ...(certifications && certifications.length > 0 ? [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "CERTIFICACIONES", bold: true, size: 22 })],
          }),
          ...certifications.map(cert => 
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: cert.name, bold: true }),
                new TextRun({ text: ` — ${cert.issuer}`, italics: true }),
                new TextRun({ text: `\t${cert.date}`, bold: false }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            })
          )
        ] : []),

        // Volunteering
        ...(volunteering && volunteering.length > 0 ? [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300 },
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [new TextRun({ text: "VOLUNTARIADO / LIDERAZGO", bold: true, size: 22 })],
          }),
          ...volunteering.flatMap(vol => [
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({ text: vol.organization, bold: true }),
                new TextRun({ text: `\t${vol.location || ''}`, italics: true }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: vol.role, italics: true }),
                new TextRun({ text: `\t${vol.dates}`, italics: false }),
              ],
              tabStops: [{ type: "right", position: 9000 }],
            }),
            ...(vol.details || []).map(detail => 
              new Paragraph({
                text: detail,
                bullet: { level: 0 },
                spacing: { before: 50 },
              })
            ),
          ])
        ] : []),

        // Skills
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300 },
          border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          children: [new TextRun({ text: "HABILIDADES E INTERESES", bold: true, size: 22 })],
        }),
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({ text: "Idiomas: ", bold: true }),
            new TextRun({ text: skills.languages.join(", ") }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Habilidades Técnicas: ", bold: true }),
            new TextRun({ text: skills.technical.join(", ") }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Intereses: ", bold: true }),
            new TextRun({ text: skills.interests.join(", ") }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `CV_${personalInfo.fullName.replace(/\s+/g, '_')}.docx`);
};
