interface SectionLabelProps {
  children: React.ReactNode;
  as?: 'p' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  number?: string;
}

export default function SectionLabel({
  children,
  as: Tag = 'p',
  className = '',
  number,
}: SectionLabelProps) {
  return (
    <Tag
      className={`inline-flex items-center gap-2 text-[10px] md:text-[11px] tracking-[0.22em] uppercase ${className}`.trim()}
      style={{
        color: 'var(--color-subtle)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
      }}
    >
      {number && (
        <span style={{ color: 'var(--color-ink)', letterSpacing: '0.1em' }}>{number}</span>
      )}
      {number && <span aria-hidden="true" style={{ width: '1.25rem', height: '1px', background: 'var(--color-rule)' }} />}
      <span>{children}</span>
    </Tag>
  );
}
