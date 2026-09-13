"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-foreground">
      <Navbar />
      <main className="min-h-screen bg-background text-secondary relative top-[9vh] mb-[9vh] py-14 md:py-16 lg:py-20 px-6 sm:px-8 lg:px-16 xl:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col justify-between space-y-8 md:space-y-10"
            >
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.15] text-neutral-950">
                  Get in{" "}
                  <span className="inline-block font-light text-neutral-400">
                    —
                  </span>
                  <br />
                  touch with us
                </h1>

                <p className="mt-6 text-neutral-600 text-base sm:text-lg leading-relaxed max-w-md">
                  We&apos;re here to help! Whether you have a question about
                  booking a vehicle, need assistance with your ride reservation,
                  or want to provide feedback, our team is ready to assist you.
                </p>
              </div>

              <div className="space-y-6 text-neutral-900 pt-2">
                <div>
                  <span className="block text-sm font-medium text-neutral-500 mb-1">
                    Email:
                  </span>
                  <a
                    href="mailto:glide.app.support@gmail.com"
                    className="text-xl sm:text-2xl font-bold tracking-tight hover:text-neutral-600 transition-colors"
                  >
                    glide.app.support@gmail.com
                  </a>
                </div>

                <div>
                  <span className="block text-sm font-medium text-neutral-500 mb-1">
                    Phone:
                  </span>
                  <a
                    href="tel:+123456778"
                    className="text-xl sm:text-2xl font-bold tracking-tight hover:text-neutral-600 transition-colors"
                  >
                    +91 12345-XXXXX
                  </a>
                  <p className="text-sm text-neutral-500 mt-1 font-normal">
                    Available Monday to Friday, 9 AM - 6 PM IST
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                >
                  {" "}
                  Live Chat
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-7 bg-white rounded-4xl p-6 sm:p-10 lg:p-12 shadow-sm border border-neutral-100"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    Message Received
                  </h3>
                  <p className="text-neutral-600 max-w-md">
                    Thank you for reaching out. A booking specialist will get
                    back to you within 2 business hours.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    rightIcon={<ArrowRight className="w-4 h-4 stroke-[2.5]" />}
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <InputField
                        label="First Name"
                        type="text"
                        required
                        placeholder="Enter your first name..."
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <InputField
                        label="Last Name"
                        type="text"
                        required
                        placeholder="Enter your last name..."
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <InputField
                        label="Email"
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value,
                          })
                        }
                      />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium tracking-wide text-secondary uppercase"
                    >
                      How can we help you?
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      required
                      placeholder="Enter your message..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full mt-2 px-4 py-3.5 rounded-xl border border-secondary/50 bg-secondary/2 pr-11 text-[14px] text-secondary outline-none transition-all duration-300 placeholder:text-secondary/60 focus:border-secondary focus:bg-transparent focus:ring-1 focus:ring-secondary"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="sm"
                      variant="primary"
                      rightIcon={
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      }
                      className="group inline-flex disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ContactPage;