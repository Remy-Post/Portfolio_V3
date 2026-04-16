import Link from 'next/link';

export default function NotFoundState({ message, backHref, backLabel }: {
  message: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="section py-32 text-center">
      <p className="text-slate-400">{message}</p>
      <Link href={backHref} className="text-sm text-slate-600 hover:text-slate-900 mt-4 inline-block">
        &larr; Back to {backLabel}
      </Link>
    </div>
  );
}
