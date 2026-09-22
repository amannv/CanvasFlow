import { cn } from "#lib/utils";
import { useState } from "react";

type SignupData = {
  name: string;
  email: string;
  password: string;
};

export function SignupForm({
  className,
  onSubmit,
  error,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (data: SignupData) => void;
  error?: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ name, email, password });
    }
  };

  return (
    <div className={cn("flex flex-col justify-between rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_#000000] transition-transform hover:-translate-y-1 hover:translate-x-1", className)} {...props}>
      <div className="text-center mb-8">
        <h3 className="text-4xl font-black uppercase tracking-tight text-black">
          Create Account
        </h3>
        <p className="mt-2 font-mono text-sm font-bold text-black/50">
          JOIN US TODAY
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl border-2 border-red-500 bg-red-50 px-4 py-3 font-mono text-sm font-bold text-red-600"
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm font-bold text-black" htmlFor="name">
            FULL NAME
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full rounded-xl border-2 border-black bg-black/5 px-4 py-3 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm font-bold text-black" htmlFor="email">
            EMAIL
          </label>
          <input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full rounded-xl border-2 border-black bg-black/5 px-4 py-3 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm font-bold text-black" htmlFor="password">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-full rounded-xl border-2 border-black bg-black/5 px-4 py-3 font-mono text-sm font-bold text-black placeholder:text-black/40 outline-none focus:border-[#0099FF] focus:bg-white"
          />
          <p className="font-mono text-xs font-bold text-black/40">
            MUST BE AT LEAST 8 CHARACTERS LONG.
          </p>
        </div>

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center rounded-xl border-2 border-black bg-black px-4 py-4 font-mono text-sm font-bold text-white shadow-[4px_4px_0px_0px_#0099FF] transition-transform hover:-translate-y-1 hover:translate-x-1"
        >
          CREATE ACCOUNT
        </button>

        <p className="mt-4 text-center font-mono text-sm font-bold text-black/60">
          Already have an account?{" "}
          <a href="/signin" className="text-[#0099FF] hover:underline underline-offset-4">
            SIGN IN
          </a>
        </p>
      </form>
    </div>
  );
}
