import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { Skip } from "@/app/types/skip";


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
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(skip.id)}
        className={clsx(
            "cursor-pointer group relative rounded-xl border border-transparent shadow-sm transition-transform hover:scale-105 p-4 flex flex-col bg-white dark:bg-[#1C1C1C]",
            isSelected
            ? "ring-2 ring-[#00BFA6] border-[#00BFA6]"
            : "hover:border-[#0037C1]"
        )}
        >
        <div className="absolute z-10 top-3 right-3 bg-[#0037C1] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {skip.size} Yard
        </div>
        <div className="relative w-full aspect-video mb-4 rounded-md overflow-hidden">
            <Image
            src={getImageBySize(skip.size)}
            alt={`${skip.size} Yard Skip`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
            />
        </div>
        <h3 className="text-lg font-semibold mb-1">{skip.size} Yard Skip</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{skip.hire_period_days}-day hire included</p>
        {(skip.allowed_on_road || skip.allows_heavy_waste) && (
            <div className="flex flex-wrap gap-2 mb-4 text-xs">
                {skip.allowed_on_road && (
                <span className="bg-green-100 dark:bg-green-700 text-green-800 dark:text-white px-2 py-1 rounded-full">
                    On-road
                </span>
                )}
                {skip.allows_heavy_waste && (
                <span className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-white px-2 py-1 rounded-full">
                    Heavy Waste
                </span>
                )}
            </div>
            )}

        <div className="mt-auto text-xl font-bold text-[#00BFA6]">£{totalPrice}</div>
    </div>

  );
};

export default SkipCard;