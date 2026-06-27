"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { stepContent } from "@/data/authForm";
import SocialSignin from "../ui/SocialSignin";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { signIn } from "next-auth/react";
import Spinner from "../ui/Spinner";
import FormError from "../ui/FormError";

function SignInForm({handleClose}: {handleClose: () => void}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        console.log("NextAuth error payload:", response.error);
        if (
          response.error.includes("CredentialsSignin") ||
          response.error.includes("CallbackRouteError")
        ) {
          setError("Invalid email or password.");
        } else {
          setError("An error occurred during sign in. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (response?.ok) {
        setLoading(false);
        handleClose();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Authentication crash:", error);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-center mb-6">
        <h1 className="text-[2.25rem] font-extrabold tracking-tight uppercase text-secondary">
          {stepContent["login"].title}
        </h1>
        <p className="text-[0.9rem] pt-1 text-secondary/60 tracking-tight">
          {stepContent["login"].subtitle}
        </p>
      </div>

      <SocialSignin />
      <div className="my-6 flex items-center justify-between">
        <span className="w-[20%] border-b border-secondary/10" />
        <span className="text-[12px] uppercase tracking-[0.2em] text-secondary/40 font-semibold">
          Or secure login
        </span>
        <span className="w-[20%] border-b border-secondary/10" />
      </div>

      <form onSubmit={handleSignIn} className="space-y-3">
        <InputField
          label="Email Address"
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AnimatePresence mode="wait">
          {error && <FormError message={error} />}
        </AnimatePresence>

        <Button
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3.5 text-sm font-medium text-background shadow-lg transition-colors duration-200 hover:opacity-90 cursor-pointer"
        >
          {loading ? (
            <Spinner />
          ) : (
            <>
              {stepContent["login"].buttonText}
              <motion.div
                variants={{ hover: { x: 3 } }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default SignInForm;
