import { useRouter } from "next/router";
import React, { forwardRef } from "react";

export interface Brewery {
  id: string;
  name: string;
  city: string;
  state: string;
  brewery_type: string;
}

interface BreweryCardProps {
  brewery: Brewery;
  isSelected: boolean;
  toggleCard: () => void;
}

const BreweryCard = forwardRef<HTMLDivElement, BreweryCardProps>(
  ({ brewery, isSelected, toggleCard }, ref) => {
    const router = useRouter();

    function handleRightClick(e: React.MouseEvent) {
      e.preventDefault();
      toggleCard();
    }

    function handleLeftClick() {
      router.push(`/brewery/${brewery.id}`);
    }

    return (
      <div
        ref={ref}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
        className={`
          group relative cursor-pointer select-none
          rounded-2xl border p-5 shadow-md 
          transition-all duration-300 
          ${
            isSelected
              ?"bg-blue-200"
              :"bg-white" 
          }
          hover:shadow-xl hover:-translate-y-1
          ${
            isSelected
              ? "border-emerald-500 ring-2 ring-emerald-300"
              : "border-gray-200"
          }
        `}
      > 
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
            {brewery.name}
          </h3>
 
          {isSelected && (
            <span className="px-2 py-1 text-xs font-bold text-white bg-emerald-500 rounded-full shadow-sm">
              ✓
            </span>
          )}
        </div>

        <p className="mt-2 text-sm text-gray-600">
          📍 {brewery.city}, {brewery.state}
        </p>

        <span
          className="
            inline-block mt-3 px-3 py-1 
            text-xs font-semibold 
            bg-blue-100 text-blue-700 
            rounded-full
          "
        >
          {brewery.brewery_type}
        </span>

      </div>
    );
  }
);

BreweryCard.displayName = "BreweryCard";

export default BreweryCard;

