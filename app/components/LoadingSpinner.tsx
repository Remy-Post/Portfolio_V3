export default function LoadingSpinner() {
  return (
    <div className="section py-32 flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );
}
