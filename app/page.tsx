"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-6 text-sm md:text-base">
            <button className="flex items-center text-white font-medium hover:underline">
              <svg className="w-5 h-5 mr-2" /> Postcode
            </button>
            <span className="h-1 w-10 bg-[#0037C1] rounded-full" />
            <button className="flex items-center text-white font-medium hover:underline">
              <svg className="w-5 h-5 mr-2" /> Waste Type
            </button>
          </div>
        </div>

        {/* Skip Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skips.map((skip) => {
            const totalPrice = (skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2);

            return (
              <div
                key={skip.id}
                className="group relative rounded-lg border-2 border-[#2A2A2A] hover:border-[#0037C1] bg-[#1C1C1C] p-6 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative mb-4">
                  <Image
                    src={getImageBySize(skip.size)}
                    alt={`${skip.size} Yard Skip`}
                    layout="responsive"
                    width={400}
                    height={300}
                    className="rounded-md object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-[#0037C1] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    {skip.size} Yards
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-1">{skip.size} Yard Skip</h3>
                <p className="text-sm text-gray-400 mb-2">
                  Hire period: {skip.hire_period_days} days
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  {skip.allowed_on_road && (
                    <span className="bg-green-700 text-white px-2 py-1 rounded-full">
                      On-road allowed
                    </span>
                  )}
                  {skip.allows_heavy_waste && (
                    <span className="bg-blue-700 text-white px-2 py-1 rounded-full">
                      Heavy waste OK
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[#0037C1]">
                    £{totalPrice}
                  </span>
                </div>

                {/* CTA */}
                <button className="w-full py-3 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white rounded-md flex justify-center items-center font-medium transition">
                  Select This Skip
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
