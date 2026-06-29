"use client";

import { useState } from "react";
import { Modal } from "@heroui/react";
import { reviewApplication } from "./TrainerApplicationSections";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

function getInitial(name) {
  return name?.charAt(0)?.toUpperCase() ?? "?";
}

const avatarColors = ["#6D6AFE", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function avatarColor(name) {
  const i = (name?.charCodeAt(0) ?? 0) % avatarColors.length;
  return avatarColors[i];
}

function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "rgba(234,179,8,0.12)",  border: "rgba(234,179,8,0.3)",  text: "#EAB308", label: "Pending" },
    approved: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", text: "#10b981", label: "Approved" },
    rejected: { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",  text: "#EF4444", label: "Rejected" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {s.label}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TrainerApplicationsClient({ applications: initial }) {
  const [applications, setApplications] = useState(initial);
  const [selected, setSelected]         = useState(null);
  const [feedback, setFeedback]         = useState("");
  const [loading, setLoading]           = useState(null);
  const [error, setError]               = useState(null);
  const [isOpen, setIsOpen]             = useState(false);

  const openModal = (app) => {
    setSelected(app);
    setFeedback("");
    setError(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
    setError(null);
  };

  const handleAction = async (action) => {
    if (!selected) return;
    setError(null);

    if (action === "reject" && !feedback.trim()) {
      setError("Feedback is required when rejecting.");
      return;
    }

    setLoading(action);
    const result = await reviewApplication(selected._id, action, feedback);
    setLoading(null);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setApplications((prev) =>
      prev.map((a) =>
        a._id === selected._id
          ? { ...a, status: action === "approve" ? "approved" : "rejected", feedback }
          : a
      )
    );
    closeModal();
  };

  const pending = applications.filter((a) => a.status === "pending").length;

  return (
    <div className="min-h-screen px-6 py-8 lg:px-8" style={{ backgroundColor: "#11131A" }}>
      <div className="max-w-5xl mx-auto space-y-6">


        {/* Table card */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "#1A1D28", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-base font-semibold text-white">Pending Applications</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {pending} application{pending !== 1 ? "s" : ""} awaiting review
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Applicant", "Specialty", "Experience", "Applied", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                      No applications yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app, i) => (
                    <tr
                      key={app._id}
                      style={{
                        borderBottom: i < applications.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ backgroundColor: avatarColor(app.fullName) }}
                          >
                            {getInitial(app.fullName)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{app.fullName}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{app.specialty}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: "rgba(109,106,254,0.12)", color: "#6D6AFE", border: "1px solid rgba(109,106,254,0.2)" }}
                        >
                          {app.experience} year{app.experience !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        {app.status === "pending" ? (
                          <button
                            onClick={() => openModal(app)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                            style={{ backgroundColor: "#6D6AFE" }}
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── HeroUI v3 Modal ── */}

        <Modal>
        <Modal.Backdrop
            isOpen={isOpen}
            onOpenChange={(open) => { if (!open) closeModal(); }}
        >
            <Modal.Container placement="center">
            <Modal.Dialog
                className="max-w-md w-full rounded-2xl"
                style={{ backgroundColor: "#1A1D28", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                <Modal.CloseTrigger onClick={closeModal} />

                <Modal.Header>
                <Modal.Heading className="text-white font-bold">Review Application</Modal.Heading>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Check the details and approve or reject this trainer request.
                </p>
                </Modal.Header>

                <Modal.Body className="p-6">
                {selected && (
                    <div className="space-y-5">
                    {/* Applicant card */}
                    <div
                        className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ backgroundColor: "#151823", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: avatarColor(selected.fullName) }}
                        >
                            {getInitial(selected.fullName)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">{selected.fullName}</p>
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{selected.email}</p>
                        </div>
                        </div>
                        <StatusBadge status={selected.status} />
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        {[
                        { label: "Specialty",  value: selected.specialty },
                        { label: "Experience", value: `${selected.experience} year${selected.experience !== 1 ? "s" : ""}` },
                        { label: "Applied",    value: formatDateTime(selected.createdAt) },
                        ].map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between">
                            <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
                            <span className="text-sm font-medium text-white">{value}</span>
                        </div>
                        ))}
                    </div>

                    <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

                    {/* Feedback */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Admin Feedback{" "}
                        <span className="normal-case font-normal" style={{ color: "rgba(255,255,255,0.25)" }}>
                            (optional for approval, required for rejection)
                        </span>
                        </label>
                        <textarea
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Write your feedback for the applicant..."
                        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                        style={{
                            backgroundColor: "#151823",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        />
                    </div>

                    {error && (
                        <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>
                    )}
                    </div>
                )}
                </Modal.Body>

                <Modal.Footer>
                <button
                    onClick={() => handleAction("reject")}
                    disabled={!!loading}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50 flex items-center gap-2"
                    style={{
                    backgroundColor: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#EF4444",
                    }}
                >
                    {loading === "reject" && (
                    <span className="w-3 h-3 rounded-full border-2 border-red-400 border-t-transparent animate-spin" />
                    )}
                    Reject
                </button>
                <button
                    onClick={() => handleAction("approve")}
                    disabled={!!loading}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-50 flex items-center gap-2"
                    style={{ backgroundColor: "#10b981" }}
                >
                    {loading === "approve" && (
                    <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    )}
                    Approve as Trainer
                </button>
                </Modal.Footer>
            </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
        </Modal>
    </div>
  );
}