"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Exhibit } from "@/lib/museum/types";

export function Placard({ exhibit }: { exhibit: Exhibit }) {
  const reduce = useReducedMotion();
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.aside
      className="placard max-w-md"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.05 }}
    >
      <motion.p className="accession" variants={item} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        {exhibit.accession}
      </motion.p>
      <motion.h2
        className="mt-2 text-2xl md:text-3xl"
        variants={item}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {exhibit.title}
      </motion.h2>
      <motion.p
        className="mt-1 text-sm text-[var(--ink-soft)]"
        variants={item}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {exhibit.medium} · {exhibit.year}
      </motion.p>
      <motion.p
        className="mt-4 text-[15px] leading-relaxed text-[var(--ink-soft)]"
        variants={item}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {exhibit.blurb}
      </motion.p>
    </motion.aside>
  );
}
