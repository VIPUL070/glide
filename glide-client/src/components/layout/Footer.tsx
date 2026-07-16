"use client";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FOOTER_LINKS } from "@/data/home";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-foreground text-primary border-t-[0.5px] border-white/10 select-none">
      <div className="w-full grid grid-cols-5 min-h-[35vh]">
        <div className="col-span-5 p-4 md:p-6 lg:p-8 flex items-end justify-start border-b-[0.5px] border-white/15" />

        <div className="col-span-2 flex items-end justify-start px-6 py-4 md:px-11 md:py-7 lg:px-15 lg:py-10 gap-6">
          <motion.a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="hover:opacity-100 transition-opacity text-primary cursor-pointer"
          >
            <Send size={18} strokeWidth={1.5} />
          </motion.a>

          <motion.a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="hover:opacity-100 transition-opacity text-primary cursor-pointer"
          >
            <Mail size={18} strokeWidth={1.5} />
          </motion.a>
        </div>

        <div className="col-span-3 border-l-[0.5px] border-white/15 flex items-center justify-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full h-full lg:w-100 lg:h-60 md:w-full md:h-55"
          >
            <Image
              src="/logo.svg"
              alt="GLIDE Footer Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </motion.div>
        </div>
      </div>

      <div className="w-full border-t-[0.5px] border-white/15 py-12 px-30 flex flex-col sm:flex-row items-center justify-end gap-8 text-[12px] tracking-tight">
        {FOOTER_LINKS.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="relative group text-primary/70 hover:text-primary transition-colors duration-200"
          >
            {link.name}
            <div className="absolute left-0 -bottom-0.5 h-px w-0 bg-primary opacity-0 transition-all duration-300 ease-out group-hover:w-full group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
