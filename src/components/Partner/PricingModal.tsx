"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  Clock,
  Milestone,
  Sparkles,
  FileImage,
  CheckCircle2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import {
  overlayVariants,
  modalVariants,
  onboardingContainerVariants,
  inputRowVariants,
} from "@/lib/animation";
import Image from "next/image";

interface PricingSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function PricingModal({ isOpen, onClose }: PricingSetupModalProps) {
  const [baseFare, setBaseFare] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  const [pricePerKM, setPricePerKM] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid =
    baseFare.trim().length > 0 &&
    waitingCharge.trim().length > 0 &&
    pricePerKM.trim().length > 0 &&
    previewUrl !== null;

  useEffect(() => {
    if (!isOpen) {
      setBaseFare("");
      setWaitingCharge("");
      setPricePerKM("");
      setImageFile(null);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isOpen, previewUrl]);

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFileChange(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 isolation-auto">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-background/40 backdrop-blur-md cursor-zoom-out"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] md:max-h-none bg-background border border-secondary/10 rounded-xl shadow-2xl shadow-secondary/5 overflow-y-auto scrollbar-none md:overflow-hidden flex flex-col z-10 text-secondary antialiased"
          >

            <div className="h-0.5 w-full shrink-0 bg-linear-to-r from-secondary/10 via-secondary/40 to-secondary/10" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-xl border border-secondary/40 bg-background hover:bg-secondary/5 transition-colors duration-200 cursor-pointer text-secondary/70 hover:text-secondary group z-20 focus:outline-none"
              aria-label="Close pricing setup panel"
            >
              <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            </button>


            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8"
            >

              <div className="space-y-1.5 max-w-xl pr-8 sm:pr-0">
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-secondary/70 px-2 py-0.5 rounded bg-secondary/5 border border-secondary/5">
                  <Sparkles className="h-3 w-3" /> Step 6 • PricingSetup
                </div>
                <h2 className="text-lg sm:text-2xl md:text-3xl font-medium tracking-tighter uppercase leading-tight">
                  Configure Vehicle <br className="hidden sm:inline" /> Pricing & Metrics
                </h2>
                <p className="text-xs sm:text-sm text-secondary/60 leading-relaxed hidden xs:block">
                  Establish the base fare and rate modifiers for this tier.
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-start">
                

                <div className="md:col-span-5 space-y-1.5 w-full">
                  <label className="text-xs font-medium tracking-wide text-secondary uppercase block">
                    Upload Vehicle Asset
                  </label>

                  <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative group w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300
                      aspect-[1.1] sm:aspect-video md:aspect-square md:h-67
                      ${
                        isDragging
                          ? "border-secondary bg-secondary/5 scale-[0.99]"
                          : "border-secondary/20 bg-secondary/2 hover:border-secondary/40 hover:bg-secondary/3"
                      }
                      ${previewUrl ? "border-solid border-secondary/30" : ""}
                    `}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                      accept="image/*"
                      className="hidden"
                    />

                    {previewUrl ? (
                      <div className="absolute inset-0 p-2 flex flex-col h-full w-full">
                        <div className="relative w-full h-full rounded-lg overflow-hidden bg-secondary/5 border border-secondary/5">
                          <Image
                            src={previewUrl}
                            alt="Logistical tier identification asset preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-[11px] font-medium text-white tracking-wider uppercase bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/10">
                              Replace Asset
                            </span>
                          </div>
                        </div>


                        <div className="absolute bottom-3 left-3 right-3 bg-background/90 backdrop-blur border border-secondary/10 px-2.5 py-1 rounded-lg hidden sm:flex items-center justify-between text-left shadow-sm">
                          <div className="flex items-center gap-2 truncate">
                            <FileImage className="h-3.5 w-3.5 shrink-0 text-secondary/70" />
                            <span className="text-[10px] font-mono truncate text-secondary/80 max-w-30">
                              {imageFile?.name ?? "Asset_Linked"}
                            </span>
                          </div>
                          <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 p-2">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-background border border-secondary/10 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <UploadCloud className="h-4 w-4 text-secondary/60" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[12px] sm:text-sm font-medium tracking-normal text-secondary">
                            Drag framework asset or{" "}
                            <span className="underline text-secondary/90 font-semibold">
                              browse
                            </span>
                          </p>
                          <p className="text-[11px] text-secondary/70 tracking-normal hidden sm:block">
                            Supports high-res PNG, SVG, or WebP config assets
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  variants={onboardingContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                >
                  <motion.div
                    variants={inputRowVariants}
                    className="sm:col-span-2 relative"
                  >
                    <InputField
                      label="Base Fare"
                      id="baseFare"
                      type="number"
                      placeholder="0"
                      value={baseFare}
                      onChange={(e) => setBaseFare(e.target.value)}
                      min="0"
                      step="0.01"
                      autoComplete="off"
                    />
                  </motion.div>

                  <motion.div variants={inputRowVariants} className="relative">
                    <div className="absolute right-4 bottom-3.5 text-secondary/70 z-10 pointer-events-none">
                      <Clock className="h-4 w-4" />
                    </div>
                    <InputField
                      label="Waiting Charge"
                      id="waitingCharge"
                      type="number"
                      placeholder="0"
                      value={waitingCharge}
                      onChange={(e) => setWaitingCharge(e.target.value)}
                      min="0"
                      step="0.01"
                      autoComplete="off"
                    />
                  </motion.div>

                  <motion.div variants={inputRowVariants} className="relative">
                    <div className="absolute right-4 bottom-3.5 text-secondary/70 z-10 pointer-events-none">
                      <Milestone className="h-4 w-4" />
                    </div>
                    <InputField
                      label="Price Per KM"
                      id="pricePerKM"
                      type="number"
                      placeholder="0"
                      value={pricePerKM}
                      onChange={(e) => setPricePerKM(e.target.value)}
                      min="0"
                      step="0.01"
                      autoComplete="off"
                    />
                  </motion.div>
                </motion.div>
              </div>


              <div className="pt-4 sm:pt-6 border-t border-secondary/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                <p className="text-[11px] sm:text-[13px] text-secondary/70 leading-tight text-center sm:text-left max-w-sm tracking-normal">
                  Rate adjustments take effect instantly across active partner routing globally upon verification completion.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    size="sm"
                    onClick={onClose}
                    motionEffect="slide"
                    className="sm:w-auto order-2 sm:order-1 bg-rose-700 hover:bg-rose-700 text-primary text-xs"
                  >
                    Discard
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!isFormValid}
                    motionEffect="slide"
                    className={`
                      sm:w-auto transition-all duration-300 order-1 sm:order-2 text-xs
                      ${
                        isFormValid
                          ? "bg-secondary text-background shadow-md shadow-secondary/5 hover:opacity-95"
                          : "bg-secondary text-background shadow-none opacity-20 cursor-not-allowed"
                      }
                    `}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;