"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "Reserving an executive SUV for our team conference took under two minutes. Pristine vehicle condition, automated receipts, and prompt driver.",
    name: "Esther Howard",
    title: "Operations Lead, Apex Logix",
    image: "/test-1.webp",
  },
  {
    quote:
      "The easiest vehicle booking platform I have used across Europe and the US. Transparent billing with zero surprise hidden insurance costs.",
    name: "Jesica Howard",
    title: "Regional Director, Horizon Mobility",
    image: "/test-2.webp",
  },
];

function AboutTestimonials() {
  return (
    <section className="bg-[#F2CA65] py-20 lg:py-28 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-950 tracking-tight">
            Why They Love Our Fleet
          </h2>
          <p className="text-neutral-800 text-sm sm:text-base font-medium">
            Hear from our riders and corporate partners. Read 320+ verified 5-star reviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-neutral-900/10 shadow-sm flex flex-col sm:flex-row gap-5 items-center sm:items-start"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl relative lg:block hidden overflow-hidden fshrink-0 bg-neutral-200 border border-neutral-900/5">
                <Image src={t.image} alt={t.name} className="w-full h-full object-cover " fill />
              </div>
              <div className="space-y-3 flex flex-col justify-between h-full">
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-sm font-bold text-neutral-950">{t.name}</h4>
                  <p className="text-xs text-neutral-500">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutTestimonials;