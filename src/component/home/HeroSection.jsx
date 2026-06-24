"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

const cards = [
  {
    id: "kettlebell",
    image: "/images/hero-kettebell.jpg",
    alt: "Woman crouching with a kettlebell mid-set",
    tag: "Kettlebell class",
    chip: "Today's class booked",
    time: "6:00 AM",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  {
    id: "yoga",
    image: "/images/train-2.png",
    alt: "Person in a yoga pose in a sunlit studio",
    tag: "Yoga flow",
    chip: "Next class in 2h",
    time: "8:30 AM",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: "hiit",
    image: "/images/train-3.png",
    alt: "Athlete mid-burpee in a HIIT class",
    tag: "HIIT session",
    chip: "New PR unlocked 🔥",
    time: "Yesterday",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const cardVariants = {
  enter: { opacity: 0, y: 24, scale: 0.97 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.97 },
};

const chipVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % cards.length);
    }, 3500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="relative overflow-hidden bg-[#0A0B0F]">
       <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/8 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:gap-16 lg:px-8 lg:py-20">

        {/* Left: copy */}
        <div className="w-full max-w-xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#C4B5FD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            Open now &middot; new member offers live
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-[3.4rem]">
            Train with purpose.
            <br />
            <span className="text-[#A78BFA]">Show up</span> for yourself.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            Book classes, follow trainers who push you further, and track
            every rep of progress &mdash; all in one place built for people
            who don&apos;t skip leg day.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button
              as={Link}
              href="/classes"
              className="rounded-full bg-[#8B5CF6] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#8B5CF6]/20 transition hover:bg-[#7C3AED]"
            >
              Explore classes
            </Button>
            <Link
              href="/forum"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              Visit the community
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-7">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/45">Classes weekly</dt>
              <dd className="mt-1 text-2xl font-bold text-white">120+</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/45">Certified trainers</dt>
              <dd className="mt-1 text-2xl font-bold text-white">40+</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-white/45">Active members</dt>
              <dd className="mt-1 text-2xl font-bold text-white">6,200+</dd>
            </div>
          </dl>
        </div>

        {/* Right: rotating card stack */}
        <div
          className="relative mx-auto w-full max-w-sm shrink-0 pb-10 lg:w-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Glow behind card */}
          <div className="absolute -inset-3 -z-10 rounded-[28px] bg-gradient-to-br from-[#8B5CF6]/25 via-transparent to-transparent blur-xl" />

          {/* Card — aspect-[3/4] keeps portrait shape */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] border border-white/10 shadow-2xl shadow-black/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={cards[active].id}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={cards[active].image}
                  alt={cards[active].alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 420px, 90vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                {/* Class tag */}
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#8B5CF6]/35 bg-[#8B5CF6]/20 px-3 py-1 text-[11px] font-semibold text-[#C4B5FD]"
                >
                  {cards[active].tag}
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Floating chip — sits just below the card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cards[active].id + "-chip"}
              variants={chipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
              className="mx-5 mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-[#16181C]/90 px-4 py-3 backdrop-blur"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-[#A78BFA]">
                  {cards[active].icon}
                </span>
                {cards[active].chip}
              </div>
              <span className="text-xs text-white/50">{cards[active].time}</span>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {cards.map((card, i) => (
              <button
                key={card.id}
                onClick={() => setActive(i)}
                aria-label={`Go to ${card.tag}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-5 bg-[#8B5CF6]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}