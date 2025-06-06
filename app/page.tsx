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

const getStoredSelection = (): number | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("selectedSkipId");
    return stored ? parseInt(stored, 10) : null;
  }
  return null;
};

export default function Home() {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [filteredSkips, setFilteredSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(getStoredSelection());

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onRoadOnly, setOnRoadOnly] = useState(false);
  const [heavyWasteOnly, setHeavyWasteOnly] = useState(false);

  // Validation error messages
  const [priceError, setPriceError] = useState<string>("");

  useEffect(() => {
    async function fetchSkips() {
      try {
        const res = await fetch(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        const data = await res.json();
        setSkips(data || []);
        setFilteredSkips(data || []);
      } catch (err) {
        console.error("Error fetching skip data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSkips();
  }, []);

  // Validate inputs and filter skips
  useEffect(() => {
    // Clear previous error
    setPriceError("");

    // Validation: min and max numeric inputs
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    if ((min !== null && min < 0) || (max !== null && max < 0)) {
      setPriceError("Price values cannot be negative.");
      setFilteredSkips([]);
      return;
    }

    if (min !== null && max !== null && max < min) {
      setPriceError("Max price cannot be less than Min price.");
      setFilteredSkips([]);
      return;
    }

    let results = [...skips];

    if (searchTerm) {
      results = results.filter((skip) =>
        `${skip.size}`.includes(searchTerm.toLowerCase())
      );
    }

    if (min !== null) {
      results = results.filter(
        (skip) => skip.price_before_vat * (1 + skip.vat / 100) >= min
      );
    }

    if (max !== null) {
      results = results.filter(
        (skip) => skip.price_before_vat * (1 + skip.vat / 100) <= max
      );
    }

    if (onRoadOnly) {
      results = results.filter((skip) => skip.allowed_on_road);
    }

    if (heavyWasteOnly) {
      results = results.filter((skip) => skip.allows_heavy_waste);
    }

    setFilteredSkips(results);
  }, [searchTerm, minPrice, maxPrice, onRoadOnly, heavyWasteOnly, skips]);

  const handleSelect = (id: number) => {
    setSelectedSkipId(id);
    localStorage.setItem("selectedSkipId", id.toString());
  };

  const getImageBySize = (size: number) => `/${size}-yarder-skip.jpg`;

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
    <div className="min-h-screen bg-[#121212] text-white px-4 py-8">
      <main className="max-w-7xl mx-auto">

        {/* Navigation Steps - Progress Bar */}
        <nav className="flex justify-center mb-10">
          <div className="flex items-center space-x-6 text-sm md:text-base font-semibold text-white">
            <button className="flex items-center gap-2 border-b-4 border-[#0037C1] pb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 18v-4M3 13h18M12 7v10"
                />
              </svg>
              Postcode
            </button>
            <span className="h-1 w-10 bg-[#0037C1] rounded-full" />
            <button className="flex items-center gap-2 hover:underline opacity-50 cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Waste Type
            </button>
          </div>
        </nav>

        {/* Search & Filters */}
        <section className="mb-8 bg-[#1E1E1E] p-6 rounded-lg shadow-lg flex flex-wrap gap-6 justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-grow max-w-4xl">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by skip size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-[#2A2A2A] text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0037C1] transition"
            />

            {/* Min Price */}
            <input
              type="number"
              min={0}
              placeholder="Min price (£)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 bg-[#2A2A2A] text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0037C1] transition"
            />

            {/* Max Price */}
            <input
              type="number"
              min={0}
              placeholder="Max price (£)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 bg-[#2A2A2A] text-white placeholder-gray-400 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0037C1] transition"
            />
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            {/* Checkbox On-road */}
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onRoadOnly}
                onChange={(e) => setOnRoadOnly(e.target.checked)}
                className="h-5 w-5 rounded border-gray-700 bg-[#2A2A2A] text-[#0037C1] focus:ring-[#0037C1]"
              />
              On-road only
            </label>

            {/* Checkbox Heavy Waste */}
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={heavyWasteOnly}
                onChange={(e) => setHeavyWasteOnly(e.target.checked)}
                className="h-5 w-5 rounded border-gray-700 bg-[#2A2A2A] text-[#0037C1] focus:ring-[#0037C1]"
              />
              Heavy waste only
            </label>
          </div>
        </section>

        {/* Validation error */}
        {priceError && (
          <p className="text-red-500 text-center mb-4 font-semibold">{priceError}</p>
        )}

        {/* Skip Grid */}
        <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredSkips.length === 0 && !priceError ? (
            <p className="text-center text-gray-400 col-span-full">No skips found matching your criteria.</p>
          ) : (
            filteredSkips.map((skip) => {
              const totalPrice = (skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2);
              const isSelected = skip.id === selectedSkipId;

              return (
                <div
                  key={skip.id}
                  onClick={() => handleSelect(skip.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSelect(skip.id); }}
                  className={clsx(
                    "group relative rounded-lg border-2 p-4 transition-all duration-300 cursor-pointer flex flex-col bg-[#1C1C1C]",
                    isSelected
                      ? "border-[#00BFA6] ring-2 ring-[#00BFA6] scale-105"
                      : "border-[#2A2A2A] hover:border-[#0037C1]"
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="absolute top-3 right-3 bg-[#0037C1] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md select-none">
                    {skip.size} Yard
                  </div>

                  <div className="relative mb-4 w-full aspect-video">
                    <Image
                      src={getImageBySize(skip.size)}
                      alt={`${skip.size} Yard Skip`}
                      fill
                      className="rounded-md object-cover"
                      sizes="(max-width: 640px) 100vw, 400px"
                      priority
                    />
                  </div>

                  <h3 className="text-lg font-bold mb-1">{skip.size} Yard Skip</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {skip.hire_period_days}-day hire included
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs mb-4">
                    {skip.allowed_on_road && (
                      <span className="bg-green-700 text-white px-2 py-1 rounded-full select-none">
                        On-road allowed
                      </span>
                    )}
                    {skip.allows_heavy_waste && (
                      <span className="bg-blue-700 text-white px-2 py-1 rounded-full select-none">
                        Heavy waste OK
                      </span>
                    )}
                  </div>

                  <div className="mt-auto">
                    <span className="text-2xl font-bold text-[#00BFA6]">
                      £{totalPrice}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Floating Continue Button */}
        {selectedSkipId && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => alert(`Continue with skip ID: ${selectedSkipId}`)}
              className="bg-[#00BFA6] hover:bg-[#008e7f] transition text-black font-semibold py-3 px-6 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-[#00bfa6aa]"
              aria-label="Continue to next step"
            >
              Continue
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
