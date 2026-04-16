import SectionLabel from './SectionLabel';

interface PageHeaderProps {
  label: string;
  title: string;
  description?: string | string[];
  number?: string;
}

export default function PageHeader({ label, title, description, number }: PageHeaderProps) {
  const phrases = description === undefined ? [] : Array.isArray(description) ? description : [description];

  return (
    <header className="mb-10 md:mb-12 xl:mb-10 animate-fade-up">
      <SectionLabel number={number} className="mb-4">
        {label}
      </SectionLabel>

      <h1
        className="font-serif leading-[0.95] tracking-[-0.02em]"
        style={{
          color: 'var(--color-ink)',
          fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
          fontWeight: 400,
          fontStyle: 'normal',
        }}
      >
        {title}
      </h1>

      {phrases.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 max-w-[42ch]">
          {phrases.map((phrase, i) => (
            <p
              key={i}
              className="text-[15px] md:text-base leading-relaxed"
              style={{ color: 'var(--color-muted)' }}
            >
              {phrase}
            </p>
          ))}
        </div>
      )}
    </header>
  );
}
