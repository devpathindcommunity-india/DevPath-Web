// src/components/profile/ExportBar.tsx
// Sticky bottom bar: Export PDF + Download JSON Resume
'use client';

import { useState } from 'react';
import { Download, FileJson, Loader2 } from 'lucide-react';
import type { UserPortfolioProfile } from '@/types/portfolio';
import { buildJSONResume } from '@/lib/portfolio-service';

interface Props {
  profile: UserPortfolioProfile;
}

export function ExportBar({ profile }: Props) {
  const [pdfLoading, setPdfLoading] = useState(false);

  // ── JSON Resume download ───────────────────────────────────────────────────
  function handleDownloadJSON() {
    const resume = buildJSONResume(profile);
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.username}-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── PDF export (client-side via print dialog) ──────────────────────────────
  async function handleExportPDF() {
    setPdfLoading(true);
    try {
      // Dynamically import html2pdf only when needed (avoids SSR issues)
      const html2pdf = (await import('html2pdf.js')).default;

      const element = document.getElementById('resume-print-root');
      if (!element) {
        console.error('Resume print root not found');
        return;
      }

      // Make the hidden resume visible for capture
      element.classList.remove('hidden');
      element.classList.add('print-visible');

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `${profile.username}-resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();

      element.classList.add('hidden');
      element.classList.remove('print-visible');
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <>
      {/* Sticky bar */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-50 bg-[#0D0F14]/80 backdrop-blur-md border-t border-white/10">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
          <p className="hidden sm:block text-xs text-gray-500">
            Portfolio auto-synced · Last updated{' '}
            {profile.updatedAt.toLocaleDateString()}
          </p>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleDownloadJSON}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-all border border-white/10"
            >
              <FileJson size={15} />
              JSON Resume
            </button>
            <button
              onClick={handleExportPDF}
              disabled={pdfLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#4F9EFF] hover:bg-[#6EB0FF] text-white transition-all disabled:opacity-60"
            >
              {pdfLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Download size={15} />
              )}
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Hidden resume template — captured by html2pdf */}
      <ResumePrintTemplate profile={profile} />
    </>
  );
}

// ─── Print-only resume layout ─────────────────────────────────────────────────

function ResumePrintTemplate({ profile }: Props) {
  const resume = buildJSONResume(profile);

  return (
    <div
      id="resume-print-root"
      className="hidden"
      style={{
        fontFamily: "'Georgia', serif",
        color: '#111',
        background: '#fff',
        padding: '32px 40px',
        maxWidth: '794px',
        fontSize: '11pt',
        lineHeight: '1.5',
      }}
    >
      {/* Name + tagline */}
      <div
        style={{
          borderBottom: '2px solid #111',
          paddingBottom: 12,
          marginBottom: 16,
        }}
      >
        <h1 style={{ fontSize: '22pt', fontWeight: 700, margin: 0 }}>
          {resume.basics.name}
        </h1>
        <p style={{ margin: '4px 0 0', color: '#444', fontSize: '11pt' }}>
          {resume.basics.label}
        </p>
        {/* Social links inline */}
        <div
          style={{
            marginTop: 6,
            display: 'flex',
            gap: 16,
            fontSize: '9pt',
            color: '#555',
          }}
        >
          {resume.basics.profiles.map((p) => (
            <span key={p.network}>
              {p.network}: {p.url}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {resume.basics.summary && (
        <ResumeSection title="Summary">
          <p style={{ margin: 0 }}>{resume.basics.summary}</p>
        </ResumeSection>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <ResumeSection title="Technical Skills">
          {resume.skills.map((s) => (
            <div key={s.name} style={{ marginBottom: 4 }}>
              <strong>{s.name}:</strong>{' '}
              <span style={{ color: '#333' }}>{s.keywords.join(', ')}</span>
            </div>
          ))}
        </ResumeSection>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <ResumeSection title="Projects">
          {resume.projects.map((p) => (
            <div key={p.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{p.name}</strong>
                {p.url && (
                  <span style={{ fontSize: '9pt', color: '#555' }}>
                    {p.url}
                  </span>
                )}
              </div>
              <p style={{ margin: '2px 0 0', color: '#444' }}>
                {p.description}
              </p>
              {p.highlights.length > 0 && (
                <p
                  style={{
                    margin: '2px 0 0',
                    color: '#666',
                    fontSize: '9.5pt',
                  }}
                >
                  Stack: {p.highlights.join(', ')}
                </p>
              )}
            </div>
          ))}
        </ResumeSection>
      )}

      {/* DevPath branding */}
      <p
        style={{
          marginTop: 24,
          fontSize: '8pt',
          color: '#aaa',
          textAlign: 'center',
        }}
      >
        Generated by DevPath · devpath.app/profile/{profile.username}
      </p>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2
        style={{
          fontSize: '11pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          borderBottom: '1px solid #ccc',
          paddingBottom: 4,
          marginBottom: 10,
          margin: '0 0 8px',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}
