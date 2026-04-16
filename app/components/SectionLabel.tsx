interface SectionLabelProps {
  children: React.ReactNode;
  as?: 'p' | 'h2' | 'span';
  className?: string;
}

export default function SectionLabel({ children, as: Tag = 'p', className = '' }: SectionLabelProps) {
  return (
    <Tag className={`text-[10px] font-semibold tracking-widest uppercase text-slate-400 ${className}`.trim()}>
      {children}
    </Tag>
  );
}
