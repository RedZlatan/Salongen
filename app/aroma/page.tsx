"use client";

import dynamic from "next/dynamic";

const AromaGame = dynamic(
  () => import("../components/aroma-game/AromaGame"),
  { ssr: false }
);

export default function AromaPage() {
  return <AromaGame />;
}
