import Link from "next/link";

export default function ClassCard({ gymClass }) {
  if (!gymClass) return null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#16181C] transition hover:border-[#8B5CF6]/40 hover:shadow-xl hover:shadow-black/30">
      
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={gymClass.image}
          alt={gymClass.className}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/20 px-3 py-1 text-xs font-semibold text-[#C4B5FD]">
          {gymClass.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Class name */}
        <h3 className="text-base font-bold leading-snug text-white line-clamp-1">
          {gymClass.className}
        </h3>

        {/* Trainer */}
        <p className="text-xs text-white/45">
          by <span className="text-white/70 font-medium">{gymClass.trainerName}</span>
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60">
            {gymClass.difficulty}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/60">
            {gymClass.duration}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mt-auto pt-3 flex items-center justify-between">
          
          {/* Price + Booking count */}
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold text-white">${gymClass.price}</span>
            <span className="text-xs text-white/35">{gymClass.bookingCount} booked</span>
          </div>

          {/* Details button */}
          <Link
            href={`/classes/${gymClass._id}`}
            className="rounded-xl bg-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7C3AED]"
          >
            View Details
          </Link>

        </div>
      </div>
    </div>
  );
}