export default function LoadingSpinner() {
  return (
    <div className="section py-32 flex items-center justify-center" role="status" aria-label="Loading">
      <span
        aria-hidden="true"
        className="loader"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '9999px',
          border: '1px solid var(--color-rule)',
          borderTopColor: 'var(--color-ink)',
          display: 'inline-block',
        }}
      />
      <style>{`
        .loader {
          animation: spin 900ms linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .loader { animation: none; border-top-color: var(--color-rule); opacity: 0.6; }
        }
      `}</style>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
