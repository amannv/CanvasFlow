"use client";

import { SignupForm } from "@repo/ui/components/signup-form";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";
import axios from "axios";
import { AuthShell } from "../components/AuthShell";
import { useState } from "react";
import { toast } from "@repo/ui/components/ui/sonner";

type SignupData = {
  name: string;
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignup = async (data: SignupData) => {
    setError("");
    try {
      await axios.post(`${BACKEND_URL}/signup`, data);

      toast.success("Account created. You can sign in now.");
      router.push("/signin");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      const errorMessage =
        message ??
        "Unable to create your account. Check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthShell>
      <div className="auth-form">
        <SignupForm onSubmit={handleSignup} error={error} />
      </div>
    </AuthShell>
  );
}
