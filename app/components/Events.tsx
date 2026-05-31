"use client";

import EventCard from "./EventCard";

const events = [
  {
    slug: "intresserad-ungdom",
    title: "Intresserad Ungdom",
    type: "Live Music",
    date: "Fredag 12 September 20:00",
    image: "/events/intresserad-ungdom.jpg",
    description: "En kväll med Intresserad Ungdom under projektorljuset.",
    status: "Biljetter 200 kr",
  },
  {
    slug: "midnight-jazz",
    title: "Midnight Jazz Session",
    type: "Live Music",
    date: "Saturday 01:10",
    image: "/events/jazzsession.jpeg",
    description:
      "Late night improvisation for temporary guests.",
    status: "Almost Sold Out",
  },
];

export default function Events() {
  return (
    <section
      id="events"
      className="border-t border-white/10 px-5 py-24 md:px-10"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-[#ff5a5a]">
        Upcoming Events
      </p>

      <h2 className="mb-12 text-4xl font-black uppercase md:text-6xl">
        Late Screenings & Gatherings
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <EventCard
            key={event.slug}
            title={event.title}
            type={event.type}
            date={event.date}
            image={event.image}
            description={event.description}
            status={event.status}
          />
        ))}
      </div>
    </section>
  );
}