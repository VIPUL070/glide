"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { modalVariants, overlayVariants } from "@/lib/animation";
import { X } from "lucide-react";
import { stepContent, StepType } from "@/data/authForm";
import SignInForm from "./AuthForms/SignInForm";
import SignUpForm from "./AuthForms/SignUpForm";
import OtpForm from "./AuthForms/OtpForm";

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [step, setStep] = useState<StepType>('login');

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pointer-events-auto relative w-full max-w-105 overflow-hidden rounded-2xl border border-white/10 bg-background/80 py-2 px-4 md:px-10 md:py-6 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-colors duration-300"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-secondary/20 to-transparent" />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute right-6 top-6 p-2 rounded-full cursor-pointer text-secondary/60 hover:text-secondary transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </motion.button>

              {/* Conditional Form Render */}
              {step === 'login' && <SignInForm  />}
              {step === 'signup' && <SignUpForm  />}
              {step === 'otp' && <OtpForm />}

              {/*Step Navigation Footer Layout */}
              <p className="mt-6 text-center text-[0.8rem] text-secondary/60 leading-relaxed px-4">
                {stepContent[step].footerText}{" "}
                <button 
                  type="button"
                  onClick={() => {
                    if (step !== 'otp') {
                      setStep(stepContent[step].nextStep);
                    }
                  }} 
                  className="underline underline-offset-4 hover:text-secondary cursor-pointer transition-colors font-medium bg-transparent border-none p-0"
                >
                  {stepContent[step].footerActionText}
                </button>
                {step === 'otp' && (
                  <>
                    <span> or </span>
                    <button
                      type="button"
                      onClick={() => setStep('login')}
                      className="underline underline-offset-4 hover:text-secondary cursor-pointer transition-colors"
                    >
                      Back to login
                    </button>
                  </>
                )}
              </p>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;