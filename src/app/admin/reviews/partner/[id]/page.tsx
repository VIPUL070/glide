"use client";
import { motion, AnimatePresence } from "motion/react";
import Spinner from "@/components/ui/Spinner";
import { IBankDetail } from "@/models/BankDetail.model";
import { IDocument } from "@/models/Document.model";
import { IVehicle } from "@/models/Vehicle.model";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Fingerprint,
  Bike,
  CreditCard,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { IUser } from "@/models/User.model";
import Button from "@/components/ui/Button";
import DocsPreview from "@/components/Admin/DocsPreview";
import Overlay from "@/components/Admin/Overlay";

export type OverlayType = "idle" | "approve" | "reject";

const PartnerReview = () => {
  const { id } = useParams();
  const [partnerDetails, setPartnerDetails] = useState<IUser>();
  const [vehicleDetails, setVehicleDetails] = useState<IVehicle>();
  const [partnerDocs, setPartnerDocs] = useState<IDocument>();
  const [bankDetails, setBankDetails] = useState<IBankDetail>();
  const [loading, setLoading] = useState<boolean>(false);
  const [overlayState, setOverlayState] = useState<OverlayType>("idle");
  const router = useRouter();

  useEffect(() => {
    const getPartnerDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/admin/reviews/partner/${id}`);
        setPartnerDetails(data.partner);
        setVehicleDetails(data.vehicle);
        setPartnerDocs(data.documents);
        setBankDetails(data.bank);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPartnerDetails();
  }, [id]);

  const globalStatus = partnerDetails?.partnerStatus;
  if (!partnerDetails || !vehicleDetails || !partnerDocs || !bankDetails)
    return null;

  if (loading) {
    return (
      <div className="h-dvh w-screen flex items-center justify-center gap-4  uppercase font-semibold tracking-tighter">
        <p className="text-xl">Loading Partner Details...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background text-secondary p-3 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-neutral-200">
      <div className="max-w-[1600px] mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <motion.button
              whileHover={{ x: -4 }}
              className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200 cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center  font-semibold text-lg">
                {partnerDetails.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold tracking-tight">
                    {partnerDetails.name}
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase tracking-wider ${globalStatus === "rejected" ? "bg-rose-100" : "bg-amber-100"} ${globalStatus === "approved" && "bg-emerald-100"} `}
                  >
                    {globalStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {partnerDetails.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5" /> ID:{" "}
                    {String(partnerDetails._id)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right text-xs w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
            Profile Created:{" "}
            {new Date(bankDetails.createdAt).toLocaleDateString()}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[minmax(180px,auto)]">
          
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="md:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-65"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl">
                  <Bike className="w-6 h-6 " />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${vehicleDetails.status === "rejected" ? "bg-rose-100" : "bg-amber-100"} ${vehicleDetails.status === "approved" && "bg-emerald-100"}`}
                >
                  Vehicle: {vehicleDetails.status}
                </span>
              </div>
              <h2 className="text-sm font-semibold  uppercase tracking-wider">
                Vehicle Configuration
              </h2>
              <p className="text-2xl font-bold mt-1">
                {vehicleDetails.vehicleModel}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-neutral-100 mt-4">
              <div>
                <p className="text-xs ">Plate Number</p>
                <p className="text-sm font-medium mt-0.5 bg-neutral-50 px-2 py-1 rounded border inline-block uppercase tracking-wider">
                  {vehicleDetails.number}
                </p>
              </div>
              <div>
                <p className="text-xs ">Classification</p>
                <p className="text-sm font-medium mt-0.5 capitalize">
                  {vehicleDetails.type}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium`}
                >
                  {bankDetails.status}
                </span>
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Settlement Node
              </h2>
              <p className="text-xl font-bold mt-1 tracking-tight">
                {bankDetails.accountHolder}
              </p>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs border-b border-neutral-50 pb-1.5">
                <span >A/C Number</span>
                <span className=" font-medium">
                  {bankDetails.accountNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-50 pb-1.5">
                <span >IFSC Code</span>
                <span className=" font-medium">
                  {bankDetails.ifscCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span >UPI</span>
                <span className=" font-medium">
                  {bankDetails.upi}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl w-fit">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  System Lifecycles
                </h3>
                <p className="text-xs mt-2">
                  <strong className="">Registry:</strong>{" "}
                  {new Date(vehicleDetails.createdAt).toLocaleString()}
                </p>
                <p className="text-xs mt-1">
                  <strong className="">Docs Updated:</strong>{" "}
                  {new Date(partnerDocs.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            {partnerDocs.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-red-700 leading-tight">
                  <strong>Past Rejection:</strong> {partnerDocs.rejectionReason}
                </p>
              </div>
            )}
          </motion.div>

          <DocsPreview partnerDocs={partnerDocs} />

          <motion.div
            whileHover={{ y: -4 }}
            className="md:col-span-2 xl:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-55"
          >
            <div>
              <h3 className="text-sm font-bold ">
                Verification Desk
              </h3>
              <p className="text-xs  mt-0.5">
                Enforce state controls on this application profile pipeline.
              </p>
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <Button disabled={partnerDetails?.partnerStatus === "approved" || partnerDetails?.partnerStatus === "rejected" } onClick={() => setOverlayState("reject")}>
                    <XCircle className="w-4 h-4 text-red-500" />Reject
                  </Button>
                  <Button disabled={partnerDetails?.partnerStatus === "approved" || partnerDetails?.partnerStatus === "rejected" }  onClick={() => setOverlayState("approve")}>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />Approve
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <Overlay overlayState={overlayState} handleOverlay={setOverlayState} />
    </div>
  );
};

export default PartnerReview;