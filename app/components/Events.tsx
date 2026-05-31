"use client";

import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import EventDetailModal, { type DisplayEvent } from "./EventDetailModal";
import BookingModal, { type BookingEvent } from "./BookingModal";
import { supabase } from "../../lib/supabase";

const DISPLAY_EVENTS: DisplayEvent[] = [
  {
    slug: "intresserad-ungdom",
    title: "Intresserad Ungdom",
    type: "Live Music",
    date: "Fredag 12 September 20:00",
    image: "/events/intresserad-ungdom.jpg",
    description: "En kväll med Intresserad Ungdom under projektorljuset.",
    status: "Biljetter 200 kr",
    price: 200,
  },
  {
    slug: "secret-midnight",
    title: "Secret Midnight Session",
    type: "Secret Event",
    date: "Fredag 13 Juni 00:00",
    image: "/events/secret-midnight.jpg",
    description: "An undisclosed artist. An undisclosed location. 40 seats only.",
    status: "Biljetter 399 kr",
    price: 399,
  },
];

export default function Events() {
  const [supabaseEvents, setSupabaseEvents] = useState<BookingEvent[]>([]);
  const [detailEvent, setDetailEvent]       = useState<DisplayEvent | null>(null);
  const [bookingEvent, setBookingEvent]     = useState<BookingEvent | null>(null);
  const [bookingOpen, setBookingOpen]       = useState(false);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true })
      .then(({ data }) => { if (data) setSupabaseEvents(data); });
  }, []);

  function getSupabaseEvent(title: string): BookingEvent | null {
    return (
      supabaseEvents.find(
        (e) => e.title.toLowerCase() === title.toLowerCase()
      ) ?? null
    );
  }

  function openBooking(title: string) {
    setBookingEvent(getSupabaseEvent(title));
    setBookingOpen(true);
  }

  return (
    <>
      <section id="events" className="border-t border-white/10 px-5 py-24 md:px-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-[#ff5a5a]">
          Upcoming Events
        </p>

        <h2 className="mb-12 text-4xl font-black uppercase md:text-6xl">
          Late Screenings & Gatherings
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {DISPLAY_EVENTS.map((event) => (
            <EventCard
              key={event.slug}
              title={event.title}
              type={event.type}
              date={event.date}
              image={event.image}
              description={event.description}
              status={event.status}
              onViewEvent={() => setDetailEvent(event)}
              onBook={() => openBooking(event.title)}
            />
          ))}
        </div>
      </section>

      {/* Event detail modal */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onBook={() => openBooking(detailEvent.title)}
          onClose={() => setDetailEvent(null)}
        />
      )}

      {/* Booking modal */}
      {bookingOpen && (
        <BookingModal
          preselectedEvent={bookingEvent ?? undefined}
          onClose={() => { setBookingOpen(false); setBookingEvent(null); }}
        />
      )}
    </>
  );
}
