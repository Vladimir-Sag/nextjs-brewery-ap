import { create } from "zustand";

export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  city: string;
  state: string;
}

interface BreweryStore {
  breweries: Brewery[];
  visibleBreweries: Brewery[];
  startIndex: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;

  lazyScrollDown: () => Promise<void>;
  addBreweries: (items: Brewery[]) => void;

  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setHasMore: (value: boolean) => void;

  fetchBreweries: (page?: number) => Promise<void>;
  fetchNextPage: () => Promise<void>;

  removeBreweries: (ids: string[]) => void;
}

const useBreweryStore = create<BreweryStore>((set, get) => ({
  breweries: [],
  visibleBreweries: [],
  startIndex: 0,
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,

  lazyScrollDown: async () => {
    const state = get();
    const newStartIndex = state.startIndex + 5;

    console.log(`LazyScroll: ${state.startIndex} → ${newStartIndex}`);

    const need = newStartIndex + 15;
    const available = state.breweries.length;

    if (need > available && state.hasMore) {
      await state.fetchNextPage();
    }

    const updated = get();
    const total = updated.breweries.length;

    if (newStartIndex + 15 <= total) {
      const newVisible = updated.breweries.slice(newStartIndex, newStartIndex + 15);

      set({
        visibleBreweries: newVisible,
        startIndex: newStartIndex
      });

      console.log("Window updated");
    }
  },

  addBreweries: (items) =>
    set((state) => {
      const full = [...state.breweries, ...items];

      let newVisible = state.visibleBreweries;

      if (state.breweries.length === 0) {
        newVisible = full.slice(0, 15);
      }

      return {
        breweries: full,
        visibleBreweries: newVisible
      };
    }),

  setCurrentPage: (page) => set({ currentPage: page }),
  setLoading: (loading) => set({ loading }),
  setHasMore: (val) => set({ hasMore: val }),


  fetchBreweries: async (page = 1) => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `https://api.openbrewerydb.org/v1/breweries?per_page=15&page=${page}`
      );
      const data: Brewery[] = await response.json();

      console.log(`Page ${page}: received ${data.length}`);

      if (data.length > 0) {
        get().addBreweries(data);
        set({ currentPage: page, hasMore: true });
      } else {
        set({ hasMore: false });
      }
    } catch (err: any) {
      set({ error: err.message ?? "Error loading data" });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchNextPage: async () => {
    const state = get();
    const nextPage = state.currentPage + 1;

    console.log(`→ Loading the page ${nextPage}`);

    await state.fetchBreweries(nextPage);
  },

  removeBreweries: (ids) => {
    const state = get();

    const remaining = state.breweries.filter((b) => !ids.includes(b.id));

    let newStartIndex = state.startIndex;

    if (newStartIndex > remaining.length - 15) {
      newStartIndex = Math.max(0, remaining.length - 15);
    }

    let newVisible = remaining.slice(newStartIndex, newStartIndex + 15);

    if (newVisible.length < 15 && state.hasMore) {
      console.log("Not enough elements → loading the page...");

      state.fetchNextPage().then(() => {
        const updated = get().breweries;

        const finalVisible = updated.slice(newStartIndex, newStartIndex + 15);

        set({
          breweries: updated,
          visibleBreweries: finalVisible,
          startIndex: newStartIndex
        });
      });
    } else {
      set({
        breweries: remaining,
        visibleBreweries: newVisible,
        startIndex: newStartIndex
      });
    }
  }
}));

export default useBreweryStore;

