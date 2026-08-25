"use client";

import { LoginForm } from "@repo/ui/components/login-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "../config/config";

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
    } catch (error: any) {
      console.error(
        "Error during signin",
        error.response?.data?.message || error.message,
      );
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleSignin} />
      </div>
    </div>
  );
}
