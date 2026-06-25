"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  inputRowVariants,
  onboardingContainerVariants,
  springs,
} from "@/lib/animation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { BANK_FORM_FIELDS } from "@/data/vehicleOnBoarding";

function BankDetailsSetup() {
  const router = useRouter();

  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [upiId, setUpiId] = useState("");

  const currentStep = 3;
  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const isFormValid =
    holderName.trim().length > 2 &&
    accountNumber.trim().length >= 9 &&
    ifscCode.trim().length === 11 &&
    mobileNumber.trim().length >= 10;

  // Key-value maps to link the static configuration field key to your state states
  const fieldValues = {
    holderName,
    accountNumber,
    ifscCode,
    mobileNumber,
    upiId,
  };
  const fieldSetters = {
    holderName: setHolderName,
    accountNumber: setAccountNumber,
    ifscCode: setIfscCode,
    mobileNumber: setMobileNumber,
    upiId: setUpiId,
  };

  return (
    <div className="h-dvh bg-background text-secondary antialiased flex flex-col lg:flex-row w-full">
      {/* LEFT/TOP SIDE PANEL */}
      <div className="w-full lg:w-[38%] xl:w-[32%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-secondary/8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.fluid}
          className="flex items-center justify-between lg:justify-start w-full"
        >
          <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            transition={springs.tight}
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-secondary/60 bg-background transition-colors duration-200 hover:border-secondary/20 hover:bg-secondary/2 cursor-pointer"
            aria-label="Return to compliance layer"
          >
            <motion.div
              variants={{ hover: { x: -3 } }}
              transition={springs.tight}
            >
              <ArrowLeft className="h-4 w-4 text-secondary/80" />
            </motion.div>
          </motion.button>

          {/* Step Progress Segment */}
          <div className="flex flex-col items-center lg:hidden">
            <span className="text-[12px] font-semibold uppercase tracking-widest text-secondary/80">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="h-1 w-28 overflow-hidden rounded-full bg-secondary/10 mt-1">
              <div
                className="h-full bg-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Framing Text  */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.fluid, delay: 0.1 }}
          className="my-auto pt-10 pb-6 lg:py-0"
        >
          <span className="hidden lg:inline-block text-[14px] font-semibold uppercase tracking-widest text-secondary/80 px-2 py-0.5 rounded bg-secondary/8 border border-secondary/5">
            Financial Node Setup
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-medium tracking-tighter uppercase text-secondary mt-4 leading-[1.15]">
            Payout & Bank <br className="hidden lg:inline" />
            Information
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-secondary/80 max-w-md">
            Configure your designated clearing account to activate direct
            rolling deposits for your active operational shifts.
          </p>
        </motion.div>

        {/* Progress Tracker */}
        <div className="hidden lg:flex flex-col gap-2 w-full pt-4 border-t border-secondary/10">
          <div className="flex items-center justify-between text-md font-medium tracking-tight text-secondary/80">
            <span>Setup Progress</span>
            <span className="flex items-center gap-1">
              {Math.round(progress)}% Complete{" "}
            </span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/5 relative">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-secondary"
              initial={{ width: "66.6%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ...springs.slow, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE WORKSPACE */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-18 max-w-5xl w-full mx-auto lg:mx-0">
        <div className="w-full space-y-8">
          <section className="space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-md font-semibold uppercase tracking-widest text-secondary">
                Settlement Clearing Accounts
              </h2>
              <p className="text-sm text-secondary/50">
                Please guarantee that all bank credential metrics match your
                verified identification assets.
              </p>
            </div>

            {/* Input Fields  */}
            <motion.div
              variants={onboardingContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
            >
              {BANK_FORM_FIELDS.map((field) => {
                const rawValue = fieldValues[field.stateKey];
                const setter = fieldSetters[field.stateKey];

                //.toUpperCase() requirement for the IFSC code input
                const displayValue =
                  field.stateKey === "ifscCode"
                    ? rawValue.toUpperCase()
                    : rawValue;

                return (
                  <motion.div
                    key={field.id}
                    variants={inputRowVariants}
                    className={field.className}
                  >
                    {field.icon && (
                      <div className="absolute right-4 bottom-3.5 text-secondary/30">
                        <field.icon className="h-4 w-4" />
                      </div>
                    )}

                    {field.isOptional && (
                      <div className="absolute right-4 bottom-1.5 text-[10px] uppercase tracking-wider text-secondary/30 font-semibold bg-secondary/5 px-1.5 py-0.5 rounded border border-secondary/5">
                        Optional
                      </div>
                    )}

                    <InputField
                      label={field.label}
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={displayValue}
                      onChange={(e) => setter(e.target.value)}
                      autoComplete="off"
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </section>
        </div>

        {/*  Form Submission*/}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.fluid, delay: 0.35 }}
          className="mt-14 pt-6 border-t border-secondary/8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          {/* SecurityInfo */}
          <div className="flex items-start gap-3 max-w-sm text-center sm:text-left">
            <ShieldCheck className="h-5 w-5 text-secondary/50 mt-0.5 shrink-0 mx-auto sm:mx-0" />
            <p className="text-[13px] text-secondary/70 leading-normal">
              Your connection is guarded with bank-grade tokenization. Initial
              testing verification settle automatically within 24-48 hour.
            </p>
          </div>

          <Button
            whileHover={isFormValid ? "hover" : undefined}
            whileTap={isFormValid ? { scale: 0.98 } : undefined}
            disabled={!isFormValid}
            className={`
              group flex w-full sm:w-auto min-w-45 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer
              ${
                isFormValid
                  ? "bg-secondary text-background shadow-md shadow-secondary/5 hover:opacity-95"
                  : "bg-secondary text-primary shadow-none cursor-not-allowed opacity-40"
              }
            `}
          >
            <span>Continue Step</span>
            <motion.div
              animate={isFormValid ? { x: [0, 3, 0] } : { x: 0 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default BankDetailsSetup;
