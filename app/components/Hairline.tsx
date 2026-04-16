export default function Hairline({ className = '' }: { className?: string }) {
  return <hr className={`hairline ${className}`.trim()} />;
}
