"use client";

import { useCallback, useMemo, useState } from "react";

// TEMP AUTH STUB
// Provides the interface Navbar expects: { user, logOut }.
// Later, replace this with real session/auth (NextAuth/custom backend).

function readStoredUser() {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("fitmate_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [user, setUser] = useState(() => readStoredUser());

  const logOut = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("fitmate_user");
      }
    } finally {
      setUser(null);
    }
  }, []);

  return useMemo(() => ({ user, logOut }), [user, logOut]);
}

