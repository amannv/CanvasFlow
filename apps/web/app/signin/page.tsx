"use client";

import { LoginForm } from "@repo/ui/components/login-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";
import { AuthShell } from "../components/AuthShell";
import { useState } from "react";
import { toast } from "@repo/ui/components/ui/sonner";

type SigninData = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSignin = async (data: SigninData) => {
    setError("");
    try {
      const response = await axios.post(`${BACKEND_URL}/signin`, data);

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", response.data.token);

        toast.success("Signed in successfully.");
        router.push("/dashboard");
      } else {
        const message = "Sign-in failed. Please try again.";
        setError(message);
        toast.error(message);
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      const errorMessage =
        message ?? "Unable to sign in. Check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <AuthShell>
      <div className="auth-form">
        <LoginForm onSubmit={handleSignin} error={error} />
      </div>
    </AuthShell>
  );
}
