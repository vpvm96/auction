import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '@/lib/store/storage'

const MAX_ITEMS = 20

interface RecentlyViewedStore {
  ids: string[]
  addId: (id: string) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      ids: [],
      addId: (id: string) =>
        set((state) => {
          const filtered = state.ids.filter((i) => i !== id)
          return { ids: [id, ...filtered].slice(0, MAX_ITEMS) }
        }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'recently-viewed-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
