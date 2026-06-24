export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6 text-white">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-3 text-sm text-slate-300">
          You do not have permission to view this dashboard section.
        </p>
      </div>
    </div>
  );
}
