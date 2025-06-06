// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import ProgressBar from "@/app/components/ProgressBar";
import SkipList from "@/app/components/SkipList";
import ContinueButton from "@/app/components/ContinueButton";
import { Skip } from "@/app/types/skip";

export default function Home() {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);

  // Persist selection across page reloads
  useEffect(() => {
    const stored = localStorage.getItem("selectedSkip");
    if (stored) {
      try {
        setSelectedSkip(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored skip", e);
      }
    }
  }, []);

  const handleSelectSkip = (skip: Skip) => {
    setSelectedSkip(skip);
    localStorage.setItem("selectedSkip", JSON.stringify(skip));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 py-8">
      <main className="max-w-7xl mx-auto">
        <ProgressBar />
        <SkipList onSkipSelect={handleSelectSkip} selectedSkipId={selectedSkip?.id ?? null} />
        {selectedSkip && (
          <ContinueButton selectedSkip={selectedSkip} clearSelection={() => setSelectedSkip(null)} />
        )}
      </main>
    </div>
  );
}
