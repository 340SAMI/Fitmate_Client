"use client";

export default function StudentsModal({ isOpen, students, isLoading, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16181C] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Enrolled Students</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent" />
          </div>
        ) : students.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-white/40">No students enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {students.map((purchase, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-xs font-bold text-[#A78BFA]">
                  {purchase.userName?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {purchase.userName ?? "Unknown"}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {purchase.userEmail ?? "No email"}
                  </p>
                </div>
                <span className="ml-auto text-xs text-white/30 shrink-0">
                  ${purchase.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 border-t border-white/[0.06] pt-4 flex justify-between items-center">
          <p className="text-xs text-white/30">
            {students.length} student{students.length !== 1 ? "s" : ""} enrolled
          </p>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}