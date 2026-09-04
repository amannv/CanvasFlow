"use client";

import { SignupForm } from "@repo/ui/components/signup-form";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";
import axios from "axios";
import { AuthShell } from "../components/AuthShell";

type SignupData = {
  name: string;
  email: string;
  password: string;
};

export default function Page() {
  const router = useRouter();

  const handleSignup = async (data: SignupData) => {
    try {
      await axios.post(`${BACKEND_URL}/signup`, data);

      console.log("Signup successful!");
      router.push("/signin");
    } catch (error: unknown) {
      console.error(
        "Error during signup:",
        axios.isAxiosError(error) ? error.response?.data?.message || error.message : "Unexpected error",
      );
    }
  };

  return (
    <AuthShell
      eyebrow="Start with a blank canvas"
      title="Your next room starts here."
      description="Create a simple home for sketches, diagrams, and the ideas you are not ready to lose."
    >
      <div className="auth-form">
        <SignupForm onSubmit={handleSignup} />
      </div>
    </AuthShell>
  );
}
