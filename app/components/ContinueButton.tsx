"use client";
import React from "react";
import { Skip } from "@/app/types/skip";


interface ContinueButtonProps {
  selectedSkip: Skip;
  clearSelection: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ selectedSkip, clearSelection }) => {
  const totalPrice = (
    selectedSkip.price_before_vat * (1 + selectedSkip.vat / 100)
  ).toFixed(2);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1C1C1C] border-t border-[#2A2A2A] z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.4)] px-4 py-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm sm:text-base font-medium">
          <span className="text-lg font-semibold">{selectedSkip.size} Yard Skip</span>
          <span className="text-[#00BFA6] font-bold text-xl">£{totalPrice}</span>
          <span className="text-gray-400">{selectedSkip.hire_period_days} day hire</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearSelection}
            className="bg-transparent border border-white text-white px-5 py-2 rounded-md hover:bg-white hover:text-black transition"
          >
            Back
          </button>
          <button
            onClick={() => alert(`Continue with skip ID: ${selectedSkip.id}`)}
            className="bg-[#00BFA6] hover:bg-[#008e7f] text-black font-semibold px-6 py-2 rounded-md transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContinueButton;
