import { create } from 'zustand'

interface ListFilterStore {
  selectedCourtId: string | null
  setCourtId: (id: string | null) => void
}

export const useListFilterStore = create<ListFilterStore>((set) => ({
  selectedCourtId: null,
  setCourtId: (id) => set({ selectedCourtId: id }),
}))
