"use client";

import { LoginForm } from "@repo/ui/components/login-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";
import { AuthShell } from "../components/AuthShell";

type SigninData = {
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const handleSignin = async (data: SigninData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/signin`, data);

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", response.data.token);

        console.log("Signin successful");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error(
        "Error during signin",
        axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Unexpected error",
      );
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where you left off."
      description="Sign in to open your rooms and keep making space for the work that matters."
    >
      <div className="auth-form">
        <LoginForm onSubmit={handleSignin} />
      </div>
    </AuthShell>
  );
}
