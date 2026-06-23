import { getFamousClasses } from "@/lib/api/classes";
import Link from "next/link";

const PopularClasses = async () => {
  const classes = await getFamousClasses();

  return (
    <section className="bg-[#0A0B0F] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#C4B5FD]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />
            Most booked this week
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Popular Classes
          </h2>
          <p className="mt-3 text-sm text-white/50">
            Train smarter with our most loved programs
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#12141A] transition hover:border-[#8B5CF6]/30 hover:shadow-xl hover:shadow-[#8B5CF6]/5"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.className}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141A] via-transparent to-transparent" />

                {/* Booking count badge */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 backdrop-blur-sm">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[#A78BFA]">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span className="text-[11px] font-semibold text-white">
                    {item.bookingCount} enrolled
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="font-semibold text-white line-clamp-1">
                  {item.className}
                </h3>

                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  by {item.trainerName}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-lg font-bold text-white">
                    ${item.price}
                  </span>
                  <Link
                    href={`/classes/${item._id}`}
                    className="rounded-xl bg-[#8B5CF6]/15 px-4 py-2 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#8B5CF6] hover:text-white"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            View all classes
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default PopularClasses;