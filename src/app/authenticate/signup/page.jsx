"use client";

import { useState } from "react";
import { Button, Form, Input, Label, TextField, FieldError, Description } from "@heroui/react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const router = useRouter();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`,
        { method: "POST", body: formData }
      );
      const data = await res.json();

      if (data.success) {
        setAvatar(data.data.url);
        toast.success("Image uploaded!");
      } else {
        toast.error("Image upload failed. Try again.");
        setPreview(null);
      }
    } catch {
      toast.error("Network error during image upload.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: avatar || "",
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error(error.message ?? "Something went wrong. Please try again.");
      setIsLoading(false);
      return;
    }

    toast.success("Account created successfully!");
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1013] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16181C] p-8 shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
          <p className="mt-1 text-sm text-white/50">Join thousands of members today</p>
        </div>

        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>

          {/* Avatar upload */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white/80">
              Profile image <span className="text-white/30">(optional)</span>
            </span>
            <label className="group flex cursor-pointer flex-col items-center gap-3">
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview}
                    alt="Avatar preview"
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-[#8B5CF6]/40"
                    width={80}
                    height={80}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                      <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-white/20 bg-white/5 transition group-hover:border-[#8B5CF6]/60 group-hover:bg-[#8B5CF6]/5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 transition group-hover:text-[#8B5CF6]/60">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
              <span className="text-xs text-white/40 transition group-hover:text-white/60">
                {isUploading ? "Uploading..." : preview ? "Click to change photo" : "Click to upload photo"}
              </span>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="sr-only"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name */}
          <TextField isRequired name="name">
            <Label className="text-sm font-medium text-white/80">Full name</Label>
            <Input
              placeholder="John Doe"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
            <FieldError className="mt-1 text-xs text-red-400" />
          </TextField>

          {/* Email */}
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

          {/* Password */}
          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 6) return "Password must be at least 6 characters";
              if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter";
              if (!/[a-z]/.test(value)) return "Must contain at least one lowercase letter";
              return null;
            }}
          >
            <Label className="text-sm font-medium text-white/80">Password</Label>
            <Input
              placeholder="Create a password"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
            <Description className="mt-1 text-xs text-white/35">
              Min. 6 characters, one uppercase and one lowercase letter
            </Description>
            <FieldError className="mt-1 text-xs text-red-400" />
          </TextField>

          {/* Submit */}
          <Button
            type="submit"
            isDisabled={isLoading || isUploading}
            className="mt-2 w-full rounded-xl bg-[#8B5CF6] py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/20 transition hover:bg-[#7C3AED] disabled:opacity-60"
          >
            {isLoading ? "Creating account…" : isUploading ? "Uploading image…" : "Create account"}
          </Button>

          <p className="text-center text-xs text-white/40">
            Already have an account?{" "}
            <Link href="/authenticate/signin" className="text-[#A78BFA] hover:underline">
              Sign in
            </Link>
          </p>

        </Form>
      </div>
    </div>
  );
}