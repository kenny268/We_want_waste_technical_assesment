"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  price_before_vat: number;
  vat: number;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

export default function Home() {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);

  // Map skip size to image filename
  const getImageBySize = (size: number) => `/${size}-yarder-skip.jpg`;

  useEffect(() => {
    async function fetchSkips() {
      try {
        const res = await fetch(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        const data = await res.json();
        setSkips(data || []);
      } catch (err) {
        console.error("Error fetching skip data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSkips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        Loading skips...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-900 text-white">
        Failed to load skip data. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Steps */}
        <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base mb-10">
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">📍 Postcode</span>
          </div>
          <div className="w-6 h-1 bg-[#0037C1] rounded-full" />
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">🗑️ Waste Type</span>
          </div>
        </div>

        {/* Skip Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {skips.map((skip) => {
            const totalPrice = (skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2);
            const isSelected = skip.id === selectedSkipId;

            return (
              <div
                key={skip.id}
                className={clsx(
                  "relative rounded-lg border-2 p-4 transition-all duration-300 cursor-pointer flex flex-col bg-[#1C1C1C]",
                  isSelected
                    ? "border-[#00BFA6] ring-2 ring-[#00BFA6]"
                    : "border-[#2A2A2A] hover:border-[#0037C1]"
                )}
                onClick={() => setSelectedSkipId(skip.id)}
              >
                {/* Badge */}
                <div className="absolute top-3 right-3 bg-[#0037C1] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                  {skip.size} Yard
                </div>

                {/* Image */}
                <div className="relative mb-4 w-full aspect-video">
                  <Image
                    src={getImageBySize(skip.size)}
                    alt={`${skip.size} Yard Skip`}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-1">{skip.size} Yard Skip</h3>
                <p className="text-xs text-gray-400 mb-2">
                  {skip.hire_period_days}-day hire included
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 text-[11px] mb-4">
                  {skip.allowed_on_road && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full">
                      On-road OK
                    </span>
                  )}
                  {skip.allows_heavy_waste && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full">
                      Heavy waste OK
                    </span>
                  )}
                </div>

                {/* Price + Button */}
                <div className="mt-auto flex flex-col gap-3">
                  <span className="text-xl font-semibold text-[#00BFA6]">
                    £{totalPrice}
                  </span>
                  <button
                    className={clsx(
                      "w-full py-2 rounded-md text-white font-medium transition text-sm",
                      isSelected
                        ? "bg-[#00BFA6] hover:bg-[#00a18d]"
                        : "bg-[#2A2A2A] hover:bg-[#3A3A3A]"
                    )}
                  >
                    {isSelected ? "Selected ✓" : "Select This Skip"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
