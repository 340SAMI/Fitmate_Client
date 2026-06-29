// src/app/dashboard/user/apply-trainer/ApplyTrainerClient.jsx
"use client";

import { useState } from "react";
import { submitApplication } from "./actions";

const specialties = [
  "Yoga",
  "Cardio",
  "Strength Training",
  "CrossFit",
  "Pilates",
  "HIIT",
  "Personal Training",
  "Weights",
];

// ── Status screens ────────────────────────────────────────────────────────────

function PendingStatus() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "rgba(234,179,8,0.12)", border: "1px solid rgba(234,179,8,0.25)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Application Under Review</h2>
      <p className="text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        Your trainer application has been submitted and is currently being reviewed by our admin team. We&aposll notify you once a decision has been made.
      </p>
      <div
        className="mt-6 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase"
        style={{ backgroundColor: "rgba(234,179,8,0.1)", color: "#EAB308", border: "1px solid rgba(234,179,8,0.2)" }}
      >
        Status: Pending
      </div>
    </div>
  );
}

function ApprovedStatus() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">You&apos;re a Trainer!</h2>
      <p className="text-sm max-w-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
        Your application has been approved. You now have full access to the trainer dashboard where you can create and manage classes.
      </p>
      <div
        className="mt-6 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase"
        style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
      >
        Status: Approved
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ApplyTrainerClient({ user, application }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const status = application?.status;

  // Show status screens
  if (status === "pending") return (
    <PageShell user={user}>
      <PendingStatus />
    </PageShell>
  );

  if (status === "approved") return (
    <PageShell user={user}>
      <ApprovedStatus />
    </PageShell>
  );

  // Show form (null, rejected)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(e.target);
    const result = await submitApplication(formData);

    if (result?.error) {
      setError(result.error);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  };

  return (
    <PageShell user={user}>
      {/* Page Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#10b981" }}>
          Trainer Program
        </p>
        <h1 className="text-3xl font-bold text-white mb-1.5 tracking-tight">Apply as Trainer</h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Fill out the form below to apply for a trainer role on Feetmate.
        </p>
      </div>

      {/* Rejection Alert */}
      {status === "rejected" && application?.feedback && (
        <div
          className="flex items-start gap-3.5 px-5 py-4 rounded-xl border mb-7"
          style={{ backgroundColor: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.25)" }}
        >
          <div className="flex-shrink-0 mt-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold" style={{ color: "#EF4444" }}>Previous Application Rejected.</span>
            <span className="text-sm ml-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
              You can reapply below. Admin feedback:{" "}
              <span className="italic" style={{ color: "rgba(255,255,255,0.65)" }}>{application.feedback}</span>
            </span>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-xl border mb-7"
          style={{ backgroundColor: "rgba(16,185,129,0.10)", borderColor: "rgba(16,185,129,0.25)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#10b981" }}>
            Application submitted successfully! We&apos;ll review it shortly.
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-xl border mb-7"
          style={{ backgroundColor: "rgba(239,68,68,0.10)", borderColor: "rgba(239,68,68,0.25)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-sm font-medium" style={{ color: "#EF4444" }}>{error}</span>
        </div>
      )}

      {/* Form Card */}
      {!success && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border p-7"
          style={{ backgroundColor: "#1A1D28", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="space-y-7">
            {/* Section 1: Personal Info */}
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Personal Info
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name ?? ""}
                    readOnly
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                    style={{
                      backgroundColor: "#151823",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    readOnly
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none cursor-not-allowed"
                    style={{
                      backgroundColor: "#151823",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }} />

            {/* Section 2: Trainer Details */}
            <div className="space-y-5">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Trainer Details
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    placeholder="e.g. 3"
                    min="0"
                    required
                    className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
                    style={{
                      backgroundColor: "#151823",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Specialty
                  </label>
                  <select
                    name="specialty"
                    required
                    defaultValue=""
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors appearance-none"
                    style={{
                      backgroundColor: "#151823",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <option value="" disabled>Select a specialty</option>
                    {specialties.map((s) => (
                      <option key={s} value={s} style={{ backgroundColor: "#1A1D28", color: "white" }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Certifications / Qualifications
                </label>
                <input
                  type="text"
                  name="certifications"
                  placeholder="e.g. ACE Certified Personal Trainer, RYT-200 Yoga"
                  className="w-full rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors"
                  style={{
                    backgroundColor: "#151823",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Brief Bio
                </label>
                <textarea
                  name="bio"
                  rows={6}
                  placeholder="Tell us about your training background, teaching style, and what makes you a great trainer..."
                  className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors resize-none"
                  style={{
                    backgroundColor: "#151823",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60 flex items-center gap-2"
                style={{ backgroundColor: "#10b981" }}
              >
                {pending && (
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                {pending ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </form>
      )}
    </PageShell>
  );
}

// ── Layout shell ──────────────────────────────────────────────────────────────

function PageShell({ children }) {
  return (
    <div className="min-h-screen px-6 py-8 lg:px-8" style={{ backgroundColor: "#11131A" }}>
      <div className="max-w-3xl mx-auto">
        {children}
      </div>
    </div>
  );
}