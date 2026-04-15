'use client';

import { Download, FileText } from 'lucide-react';

export default function ResumePage() {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/cv.pdf';
    link.download = 'Remy-Post-Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="section py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
          CV
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-3">Resume</h1>
        <p className="text-slate-500 max-w-lg">
          Download my resume or view it below.
        </p>
      </div>

      {/* Download card */}
      <div
        className="icon-card p-8 max-w-md flex flex-col items-center text-center gap-5 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
      >
        <span className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
          <FileText size={28} strokeWidth={1.25} />
        </span>

        <div>
          <p className="text-sm font-semibold text-slate-800 mb-1">Remy-Post-Resume.pdf</p>
          <p className="text-xs text-slate-400">PDF document</p>
        </div>

        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
            bg-slate-900 text-white text-sm font-medium
            hover:bg-slate-800 transition-colors duration-200"
        >
          <Download size={15} />
          Download Resume
        </button>
      </div>

      {/* PDF preview */}
      <iframe
        src="/cv.pdf"
        className="mt-8 w-full h-[75vh] rounded-xl border border-slate-100 animate-fade-up"
        style={{ animationDelay: '0.2s' }}
        title="Resume preview"
      />
    </div>
  );
}
