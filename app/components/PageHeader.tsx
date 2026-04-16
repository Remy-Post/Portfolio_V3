import SectionLabel from './SectionLabel';

export default function PageHeader({ label, title, description }: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 xl:mb-6 animate-fade-up">
      <SectionLabel className="mb-2">{label}</SectionLabel>
      <h1 className="font-serif text-4xl sm:text-5xl text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-500 max-w-lg xl:max-w-none">{description}</p>
    </div>
  );
}
