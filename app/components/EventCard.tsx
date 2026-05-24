"use client";

type EventCardProps = {
  title: string;
  date: string;
  type: string;
  image: string;
  description: string;
  status?: string;
};

export default function EventCard({
  title,
  date,
  type,
  image,
  description,
  status,
}: EventCardProps) {
  return (
    <div className="group relative overflow-hidden border border-white/10 bg-[#090909] transition duration-500 hover:-translate-y-1 hover:border-[#ff4d4d]/40 hover:shadow-[0_0_50px_rgba(255,0,0,0.15)]">
      
      {/* IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden">

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <div className="absolute top-4 left-4 border border-[#ff4d4d]/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff6b6b] backdrop-blur-sm">
          {type}
        </div>

        {status && (
          <div className="absolute bottom-4 right-4 border border-[#ff4d4d]/20 bg-black/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffb3b3] backdrop-blur-sm">
            {status}
          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-6">

        <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#ff5a5a]">
          {date}
        </div>

        <h3 className="mb-4 text-3xl font-black uppercase leading-none">
          {title}
        </h3>

        <p className="mb-6 leading-relaxed text-[#e5dccf]/60">
          {description}
        </p>

        <button className="border border-[#ff4d4d]/30 bg-[#ff2b2b]/10 px-5 py-3 text-xs uppercase tracking-[0.3em] text-[#ffb3b3] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_30px_rgba(255,0,0,0.35)]">
          View Event
        </button>

      </div>

    </div>
  );
}