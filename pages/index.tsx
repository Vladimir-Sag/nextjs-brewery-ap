import { useEffect, useState, useRef, useCallback } from "react";
import useBreweryStore from "../stores/useBreweryStore";
import BreweryCard, { Brewery } from "../components/BreweryCard";

export default function Home() {
  const [chooseCard, setChooseCard] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardHeight, setCardHeight] = useState(0);

  const {
    breweries,
    visibleBreweries,
    loading,
    error,
    fetchBreweries,
    lazyScrollDown,
    removeBreweries,
    startIndex,
    hasMore
  } = useBreweryStore();

  useEffect(() => {
    if (breweries.length === 0) fetchBreweries(1);
  }, [breweries.length, fetchBreweries]);

  useEffect(() => {
    if (cardRef.current && cardHeight === 0) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardHeight(rect.height + 16);
    }
  }, [visibleBreweries.length, cardHeight]);

  const VISIBLE_COUNT = 5;
  const viewportHeight = cardHeight * VISIBLE_COUNT + 20;

  const maxSlideIndex = Math.max(0, visibleBreweries.length - VISIBLE_COUNT);
  const translateYOffset = currentIndex * cardHeight;

  const scrollUp = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const scrollDown = useCallback(async () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex <= maxSlideIndex) {
      setCurrentIndex(nextIndex);
    }

    if (nextIndex > maxSlideIndex) {
      await lazyScrollDown();
      setCurrentIndex(VISIBLE_COUNT - 1);
    }
  }, [currentIndex, maxSlideIndex, lazyScrollDown]);

  const onWheel = useCallback(
    async (e: React.WheelEvent) => {
      if (e.deltaY > 0) {
        await scrollDown();
      } else {
        scrollUp();
      }
    },
    [scrollDown, scrollUp]
  );


  function toggleSelectedCard(id: string) {
    setChooseCard(prev => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }

  const deleteSelectedCards = async () => {
    if (chooseCard.size === 0) return;

    const ids = Array.from(chooseCard);

    await removeBreweries(ids);

    setChooseCard(new Set());
    setCurrentIndex(0);
  };

  if (loading && breweries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading breweries...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl mb-3">Loading error</h2>
          {error}
          <button
            onClick={() => fetchBreweries(1)}
            className="block bg-white text-gray-800 px-4 py-2 mt-4 rounded-lg hover:bg-gray-200"
          >
            Repeat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-800 to-gray-900 py-10 px-4">

      <h1 className="text-3xl font-extrabold text-white text-center mb-6">
        🍺 Brewery Explorer
      </h1>

      <div className="max-w-2xl mx-auto mb-6">
        <button
          onClick={deleteSelectedCards}
          className={`
            w-full bg-red-500 text-white py-3 rounded-xl font-semibold shadow-lg transition-all
            hover:bg-red-600
            ${chooseCard.size === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          🗑 Remove selected ({chooseCard.size})
        </button>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col items-center">

        <div
          ref={scrollContainerRef}
          onWheel={onWheel}
          className="w-full overflow-hidden border-4 border-gray-700 rounded-2xl bg-gray-800 shadow-2xl "
          style={{ height: cardHeight ? `${viewportHeight}px` : "500px" }}
        >
          <div
            className="flex flex-col gap-4 p-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateY(-${translateYOffset}px)` }}
          >
            {visibleBreweries.map((brewery: Brewery, index: number) => (
              <BreweryCard
                ref={index === 0 ? cardRef : null}
                key={brewery.id}
                brewery={brewery}
                isSelected={chooseCard.has(brewery.id)}
                toggleCard={() => toggleSelectedCard(brewery.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
