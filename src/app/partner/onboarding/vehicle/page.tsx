"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { VEHICLE_OPTIONS } from "@/data/vehicleOnBoarding";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { springs } from "@/lib/animation";
import VehicleGrid from "@/components/Partner/VehicleGrid";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";
import Spinner from "@/components/ui/Spinner";
import FormError from "@/components/ui/FormError";

function VehicleType() {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [regNumber, setRegNumber] = useState<string>("");
  const [vehicleModel, setVehicleModel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const currentStep = 1;
  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const isFormValid =
    selectedVehicle !== null &&
    regNumber.trim().length > 0 &&
    vehicleModel.trim().length > 0;

  useEffect(() => {
    const getVehicle = async () => {
      try {
        const { data } = await axios.get(`/api/partner/onboarding/vehicle`);
        setSelectedVehicle(data.vehicle.type)
        setRegNumber(data.vehicle.number)
        setVehicleModel(data.vehicle.vehicleModel)
      } catch (error) {
        console.log(error);
      } 
    };
    getVehicle();
  });

  const handleVehicle = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`/api/partner/onboarding/vehicle`, {
        type: selectedVehicle,
        number: regNumber,
        vehicleModel,
      });

      router.push(`/partner/onboarding/document`);
      router.refresh();
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message ?? "Something went wrong!");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh bg-background text-secondary antialiased flex flex-col lg:flex-row w-full">
      {/* LEFT/TOP SIDE PANEL */}
      <div className="w-full lg:w-[38%] xl:w-[32%] lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-8 border-b lg:border-b-0 lg:border-r border-secondary/8">
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
            aria-label="Return to previous step"
          >
            <motion.div
              variants={{ hover: { x: -3 } }}
              transition={springs.tight}
            >
              <ArrowLeft className="h-4 w-4 text-secondary/80" />
            </motion.div>
          </motion.button>

          {/* Step Tracker for Mobile Layouts */}
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

        {/* Copy/Context Display Segment */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.fluid, delay: 0.1 }}
          className="my-auto pt-10 pb-6 lg:py-0"
        >
          <span className="hidden lg:inline-block text-[14px] font-semibold uppercase tracking-widest text-secondary/80 px-2 py-0.5 rounded bg-secondary/8 border border-secondary/5">
            Onboarding Fleet
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-medium tracking-tighter uppercase text-secondary mt-4 leading-[1.15]">
            Choose your <br className="hidden lg:inline" />
            vehicle type
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-secondary/80 max-w-md">
            Select the category that best matches your fleet setup to correctly
            configure your dispatch metrics.
          </p>
        </motion.div>

        {/* Wide Layout Progress */}
        <div className="hidden lg:flex flex-col gap-2 w-full pt-4 border-t border-secondary/10">
          <div className="flex items-center justify-between text-md font-medium tracking-tight text-secondary/80">
            <span>Setup Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/5 relative">
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full bg-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ...springs.slow, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE WORKSPACE*/}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-14 xl:p-18 max-w-5xl w-full mx-auto lg:mx-0">
        <div className="w-full space-y-10">
          {/* Module 1: Grid Component */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-semibold uppercase tracking-widest text-secondary"
              >
                Available Categories
              </motion.h2>
              {selectedVehicle && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-md text-secondary/80 font-medium"
                >
                  Selected:{" "}
                  <span className="text-secondary capitalize">
                    {selectedVehicle}
                  </span>
                </motion.span>
              )}
            </div>
            <VehicleGrid
              options={VEHICLE_OPTIONS}
              selectedId={selectedVehicle}
              onSelect={setSelectedVehicle}
            />
          </section>

          {/* Module 2: Input Layer */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springs.fluid, delay: 0.2 }}
            className="space-y-4 pt-8 border-t border-secondary/8"
          >
            <h2 className="text-md font-semibold uppercase tracking-widest text-secondary mb-2">
              Vehicle Identifiers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField
                label="Vehicle Registration Number"
                id="reg-number"
                type="text"
                placeholder="e.g., DL 12CA 1234"
                value={regNumber}
                onChange={(e) =>
                  setRegNumber(e.target.value.toLocaleUpperCase())
                }
                autoComplete="off"
              />
              <InputField
                label="Vehicle Model"
                id="vehicle-model"
                type="text"
                placeholder="e.g., Tesla Model S, Tata Ace"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                autoComplete="off"
              />
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.fluid, delay: 0.3 }}
          className="mt-4 pt-6 border-t border-secondary/8 flex flex-col items-center justify-between gap-4"
        >
          <AnimatePresence>
            {error && <FormError message={error} />}
          </AnimatePresence>

          <Button
            whileHover={isFormValid ? "hover" : undefined}
            whileTap={isFormValid ? { scale: 0.98 } : undefined}
            disabled={!isFormValid || loading}
            onClick={handleVehicle}
            className={`
              group flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3.5 text-sm font-medium text-background shadow-lg transition-colors duration-200 hover:opacity-90 cursor-pointer
              ${
                isFormValid
                  ? "bg-secondary text-background shadow-md shadow-secondary/5 hover:opacity-95"
                  : "bg-secondary text-primary shadow-none cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <span>Continue Step</span>
                <motion.div
                  animate={isFormValid ? { x: 3 } : { x: 0 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 1,
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default VehicleType;
