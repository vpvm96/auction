import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { zustandStorage } from '@/lib/store/storage'

export interface NotificationSettings {
  isEnabled: boolean
}

interface NotificationStore {
  readIds: Set<string>
  settings: NotificationSettings
  expoPushToken: string | null
  markRead: (id: string) => void
  markAllRead: (allIds: string[]) => void
  setEnabled: (enabled: boolean) => void
  setExpoPushToken: (token: string | null) => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      readIds: new Set(),
      expoPushToken: null,
      settings: {
        isEnabled: true,
      },
      markRead: (id: string) =>
        set((state) => {
          const next = new Set(state.readIds)
          next.add(id)
          return { readIds: next }
        }),
      markAllRead: (allIds: string[]) => set({ readIds: new Set(allIds) }),
      setEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, isEnabled: enabled },
        })),
      setExpoPushToken: (token) => set({ expoPushToken: token }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => zustandStorage, {
        replacer: (_key, value) => {
          if (value instanceof Set) return [...value]
          return value
        },
        reviver: (key, value) => {
          if (key === 'readIds' && Array.isArray(value)) return new Set(value)
          return value
        },
      }),
    },
  ),
)
