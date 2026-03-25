import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '@/lib/store/storage'

interface FavoritesStore {
  favoriteIds: Set<string>
  toggle: (id: string) => void
  isFavorited: (id: string) => boolean
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favoriteIds: new Set(),
      toggle: (id: string) =>
        set((state) => {
          const next = new Set(state.favoriteIds)
          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }
          return { favoriteIds: next }
        }),
      isFavorited: (id: string) => get().favoriteIds.has(id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => zustandStorage, {
        replacer: (_key, value) => {
          if (value instanceof Set) return [...value]
          return value
        },
        reviver: (key, value) => {
          if (key === 'favoriteIds' && Array.isArray(value)) return new Set(value)
          return value
        },
      }),
    },
  ),
)
