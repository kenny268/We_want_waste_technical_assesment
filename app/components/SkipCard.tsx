// components/SkipCard.tsx
import React from "react";
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

interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

const SkipCard: React.FC<SkipCardProps> = ({ skip, isSelected, onSelect }) => {
  const totalPrice = (skip.price_before_vat * (1 + skip.vat / 100)).toFixed(2);
  const getImageBySize = (size: number) => `/${size}-yarder-skip.jpg`;

  return (
    <div
      key={skip.id}
      onClick={() => onSelect(skip.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(skip.id);
      }}
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
      <p className="text-xs text-gray-400 mb-2">{skip.hire_period_days}-day hire included</p>
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
        <span className="text-2xl font-bold text-[#00BFA6]">£{totalPrice}</span>
      </div>
    </div>
  );
};

export default SkipCard;