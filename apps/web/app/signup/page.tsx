"use client";

import { SignupForm } from "@repo/ui/components/signup-form";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";
import axios from "axios";

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
    } catch (error: any) {
      console.error(
        "Error during signup:",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignup} />
      </div>
    </div>
  );
}
