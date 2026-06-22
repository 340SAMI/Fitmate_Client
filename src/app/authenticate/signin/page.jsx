"use client";

import { useState } from "react";
import { Button, Form, Input, Label, TextField, FieldError } from "@heroui/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message ?? "Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    toast.success("Signed in successfully! Redirecting to dashboard...");
    setIsLoading(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1013] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16181C] p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-white/50">Sign in with your email and password</p>
        </div>

        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-medium text-white/80">Email</Label>
            <Input
              placeholder="john@example.com"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
            <FieldError className="mt-1 text-xs text-red-400" />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 6) return "Password must be at least 6 characters";
              return null;
            }}
          >
            <Label className="text-sm font-medium text-white/80">Password</Label>
            <Input
              placeholder="Enter your password"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
            <FieldError className="mt-1 text-xs text-red-400" />
          </TextField>

          <Button
            type="submit"
            isDisabled={isLoading}
            className="mt-2 w-full rounded-xl bg-[#8B5CF6] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/20 transition hover:bg-[#7C3AED] disabled:opacity-60"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-center text-xs text-white/40">
            Don’t have an account? {" "}
            <Link href="/authenticate/signup" className="text-[#A78BFA] hover:underline">
              Create one
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
