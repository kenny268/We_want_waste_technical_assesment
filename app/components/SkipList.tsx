"use client";
import React, { useEffect, useState } from "react";
import SkipCard from "./SkipCard";
import { Skip } from "@/app/types/skip";


interface SkipListProps {
  onSkipSelect: (skip: Skip) => void;
  selectedSkipId: number | null;
}

const SkipList: React.FC<SkipListProps> = ({ onSkipSelect, selectedSkipId }) => {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [filteredSkips, setFilteredSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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

  useEffect(() => {
    setPriceError("");
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
      results = results.filter((skip) => `${skip.size}`.includes(searchTerm.toLowerCase()));
    }
    if (min !== null) {
      results = results.filter((skip) => skip.price_before_vat * (1 + skip.vat / 100) >= min);
    }
    if (max !== null) {
      results = results.filter((skip) => skip.price_before_vat * (1 + skip.vat / 100) <= max);
    }
    if (onRoadOnly) {
      results = results.filter((skip) => skip.allowed_on_road);
    }
    if (heavyWasteOnly) {
      results = results.filter((skip) => skip.allows_heavy_waste);
    }
    setFilteredSkips(results);
  }, [searchTerm, minPrice, maxPrice, onRoadOnly, heavyWasteOnly, skips]);

  if (loading) {
    return <div>Loading skips...</div>;
  }

  if (error) {
    return <div>Failed to load skip data. Please try again later.</div>;
  }

  return (
    <>
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
      {priceError && (
        <p className="text-red-500 text-center mb-4 font-semibold">{priceError}</p>
      )}
      <section className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredSkips.length === 0 && !priceError ? (
          <p className="text-center text-gray-400 col-span-full">No skips found matching your criteria.</p>
        ) : (
          filteredSkips.map((skip) => (
            <SkipCard
                key={skip.id}
                skip={skip}
                isSelected={skip.id === selectedSkipId}
                onSelect={() => onSkipSelect(skip)}
            />

          ))
        )}
      </section>
    </>
  );
};

export default SkipList;