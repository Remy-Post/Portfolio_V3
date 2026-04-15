'use client';

import { Download } from 'lucide-react';

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
    <div className="section py-12 xl:grid xl:grid-cols-[1fr_2fr] xl:gap-12 xl:items-start">
      {/* Left: Header + Download */}
      <div className="xl:sticky xl:top-20">
        <div className="mb-10 xl:mb-6 animate-fade-up">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-2">
            CV
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-3">Resume</h1>
          <p className="text-slate-500 max-w-lg xl:max-w-none">
            Download my resume or view it below.
          </p>
        </div>

        <div className="mb-10 xl:mb-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
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
      </div>

      {/* Right: PDF preview */}
      <iframe
        src="/cv.pdf#toolbar=0&navpanes=0"
        className="w-full h-[80vh] rounded-xl border border-slate-100 animate-fade-up"
        style={{ animationDelay: '0.1s' }}
        title="Resume preview"
      />
    </div>
  );
}
