"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const SWISH_NUMBER = "123 456 78 90";
const ROWS = ["A", "B", "C"];
const COLS = [1, 2, 3, 4];

type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  max_seats: number;
  price: number;
};

type BookingModalProps = {
  onClose: () => void;
};

export default function BookingModal({ onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  async function fetchBookedSeats(eventId: string) {
    setSeatsLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("seat_numbers")
      .eq("event_id", eventId);

    if (data) {
      const taken = data
        .flatMap((row) => (row.seat_numbers ? row.seat_numbers.split(",") : []))
        .map((s: string) => s.trim());
      setBookedSeats(taken);
    }
    setSeatsLoading(false);
  }

  function toggleSeat(seat: string) {
    if (bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  }

  async function handleBooking() {
    if (!selectedEvent || selectedSeats.length === 0) return;
    setSubmitting(true);
    setError("");

    const ref = `SAL-${Date.now().toString(36).toUpperCase()}`;

    const { error: insertError } = await supabase.from("bookings").insert({
      event_id: selectedEvent.id,
      name,
      email,
      phone,
      seats: selectedSeats.length,
      seat_numbers: selectedSeats.join(","),
      booking_ref: ref,
      total: selectedEvent.price * selectedSeats.length,
    });

    if (insertError) {
      setError("Något gick fel. Försök igen.");
      setSubmitting(false);
      return;
    }

    setBookingRef(ref);
    setStep(3);
    setSubmitting(false);
  }

  const totalAmount = selectedEvent ? selectedEvent.price * selectedSeats.length : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative z-10 w-full max-w-2xl border border-white/10 bg-[#080808] shadow-[0_0_80px_rgba(255,0,0,0.15)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff5a5a]">
              Book Cinema
            </div>
            <div className="mt-1 font-mono text-[10px] text-[#e5dccf]/30">
              Step {step} of {step === 4 ? 4 : 3}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#e5dccf]/40 transition hover:text-[#ff5a5a]"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* STEP 1 — Choose event */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="mb-6 text-2xl font-black uppercase">
                  Upcoming Events
                </h2>

                {loading ? (
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Loading...
                  </div>
                ) : events.length === 0 ? (
                  <div className="border border-white/10 p-6 font-mono text-xs uppercase tracking-[0.2em] text-[#e5dccf]/40">
                    No upcoming events
                  </div>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setSelectedSeats([]);
                          fetchBookedSeats(event.id);
                          setStep(2);
                        }}
                        className={`w-full border p-4 text-left transition duration-300 hover:border-[#ff4d4d]/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] ${
                          selectedEvent?.id === event.id
                            ? "border-[#ff4d4d]/40 bg-[#ff2b2b]/5"
                            : "border-white/10 bg-black/40"
                        }`}
                      >
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff5a5a]">
                          {event.date}
                        </div>
                        <div className="text-lg font-black uppercase">
                          {event.title}
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-[#e5dccf]/60">
                            {event.description}
                          </span>
                          <span className="ml-4 shrink-0 font-mono text-xs text-[#ffb3b3]">
                            {event.max_seats} seats · {event.price} kr
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 2 — Seat selection + details */}
            {step === 2 && selectedEvent && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-5 border border-white/10 bg-black/40 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ff5a5a]">
                    {selectedEvent.date}
                  </div>
                  <div className="mt-1 text-xl font-black uppercase">
                    {selectedEvent.title}
                  </div>
                </div>

                {/* Seat map */}
                <div className="mb-5">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/60">
                    Select Seats
                  </div>

                  {/* Screen */}
                  <div className="mb-5 flex flex-col items-center gap-1">
                    <div className="h-[3px] w-3/4 bg-gradient-to-r from-transparent via-[#ff4d4d]/40 to-transparent" />
                    <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#e5dccf]/25">
                      Screen
                    </div>
                  </div>

                  {seatsLoading ? (
                    <div className="py-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                      Loading seats...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {ROWS.map((row) => (
                        <div key={row} className="flex items-center gap-2">
                          <span className="w-5 shrink-0 font-mono text-xs text-[#e5dccf]/30">
                            {row}
                          </span>
                          <div className="flex gap-2">
                            {COLS.map((col) => {
                              const seatId = `${row}${col}`;
                              const isBooked = bookedSeats.includes(seatId);
                              const isSelected = selectedSeats.includes(seatId);
                              return (
                                <button
                                  key={seatId}
                                  onClick={() => toggleSeat(seatId)}
                                  disabled={isBooked}
                                  title={seatId}
                                  className={`
                                    flex h-10 w-10 items-center justify-center
                                    border font-mono text-[10px] transition duration-200
                                    ${isBooked
                                      ? "cursor-not-allowed border-red-900/50 bg-red-950/60 text-red-800/60"
                                      : isSelected
                                      ? "border-[#ff4d4d]/70 bg-[#ff2b2b]/20 text-[#ffb3b3] shadow-[0_0_12px_rgba(255,0,0,0.3)]"
                                      : "border-white/10 bg-black/40 text-[#e5dccf]/40 hover:border-[#ff4d4d]/40 hover:text-[#e5dccf]/80"
                                    }
                                  `}
                                >
                                  {seatId}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Legend */}
                  <div className="mt-4 flex gap-5 font-mono text-[9px] uppercase tracking-[0.25em] text-[#e5dccf]/30">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 border border-white/10 bg-black/40" />
                      Available
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 border border-[#ff4d4d]/70 bg-[#ff2b2b]/20" />
                      Selected
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block h-3 w-3 border border-red-900/50 bg-red-950/60" />
                      Taken
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/60">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-[#e5dccf] outline-none transition focus:border-[#ff4d4d]/40 focus:shadow-[0_0_20px_rgba(255,0,0,0.1)] placeholder:text-[#e5dccf]/20"
                      placeholder="Full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/60">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-[#e5dccf] outline-none transition focus:border-[#ff4d4d]/40 focus:shadow-[0_0_20px_rgba(255,0,0,0.1)] placeholder:text-[#e5dccf]/20"
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/60">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-white/10 bg-black/60 px-4 py-3 font-mono text-sm text-[#e5dccf] outline-none transition focus:border-[#ff4d4d]/40 focus:shadow-[0_0_20px_rgba(255,0,0,0.1)] placeholder:text-[#e5dccf]/20"
                      placeholder="+46 70 000 00 00"
                    />
                  </div>

                  {error && (
                    <div className="font-mono text-xs text-[#ff5a5a]">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="font-mono text-xs uppercase tracking-[0.2em] text-[#e5dccf]/40 transition hover:text-[#e5dccf]"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleBooking}
                      disabled={!name || !email || !phone || selectedSeats.length === 0 || submitting}
                      className="border border-[#ff4d4d]/40 bg-[#ff2b2b]/10 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ffb0b0] shadow-[0_0_20px_rgba(255,0,0,0.25)] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {submitting
                        ? "Processing..."
                        : selectedSeats.length === 0
                        ? "Select seats"
                        : `Pay ${totalAmount} kr (${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""}) →`}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Swish */}
            {step === 3 && selectedEvent && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff5a5a]">
                  Payment
                </div>
                <h2 className="mb-8 text-2xl font-black uppercase">
                  Pay via Swish
                </h2>

                <div className="mx-auto mb-6 max-w-sm border border-white/10 bg-black/60 p-8">
                  <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Swish Number
                  </div>
                  <div className="mb-6 text-4xl font-black tracking-wider text-[#ffb3b3] drop-shadow-[0_0_15px_rgba(255,100,100,0.5)]">
                    {SWISH_NUMBER}
                  </div>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Amount
                  </div>
                  <div className="mb-6 text-3xl font-black text-[#e5dccf]">
                    {totalAmount} kr
                  </div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Seats
                  </div>
                  <div className="mb-4 font-mono text-sm text-[#e5dccf]/70">
                    {selectedSeats.join(", ")}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Message
                  </div>
                  <div className="mt-1 font-mono text-sm text-[#e5dccf]/80">
                    {bookingRef}
                  </div>
                </div>

                <p className="mb-8 font-mono text-xs text-[#e5dccf]/50">
                  Use your booking reference as message in Swish.
                  <br />
                  Confirmation will be sent to {email}.
                </p>

                <button
                  onClick={() => setStep(4)}
                  className="border border-[#ff4d4d]/40 bg-[#ff2b2b]/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#ffb0b0] shadow-[0_0_20px_rgba(255,0,0,0.25)] transition duration-300 hover:bg-[#ff2b2b]/20 hover:shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                >
                  I have paid →
                </button>
              </motion.div>
            )}

            {/* STEP 4 — Confirmation */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center"
              >
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff5a5a]">
                  Confirmed
                </div>
                <h2 className="mb-6 text-3xl font-black uppercase">
                  See You There
                </h2>

                <div className="mx-auto mb-6 max-w-xs border border-[#ff4d4d]/20 bg-[#ff2b2b]/5 p-6">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#e5dccf]/40">
                    Booking Reference
                  </div>
                  <div className="font-mono text-xl tracking-widest text-[#ffb3b3]">
                    {bookingRef}
                  </div>
                </div>

                <div className="mb-8 space-y-1 font-mono text-xs text-[#e5dccf]/50">
                  <div>{selectedEvent?.title}</div>
                  <div>{selectedEvent?.date}</div>
                  <div>{selectedSeats.join(", ")}</div>
                  <div>{selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} · {totalAmount} kr</div>
                  <div className="pt-1">{email}</div>
                </div>

                <button
                  onClick={onClose}
                  className="border border-white/10 bg-white/5 px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-[#e5dccf]/60 transition hover:border-[#ff4d4d]/30 hover:text-[#ff7a7a]"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
