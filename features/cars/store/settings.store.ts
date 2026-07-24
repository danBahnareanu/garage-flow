import { asyncStorageAdapter } from '@/store/asyncStorageAdapter';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

export const DEFAULT_REMINDER_DAYS = [30, 14, 7, 0];

interface SettingsStore {
  enabledReminderDays: number[];
  toggleReminderDay: (days: number) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      enabledReminderDays: DEFAULT_REMINDER_DAYS,

      toggleReminderDay: (days) => {
        set((state) => ({
          enabledReminderDays: state.enabledReminderDays.includes(days)
            ? state.enabledReminderDays.filter((d) => d !== days)
            : [...state.enabledReminderDays, days],
        }));
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => asyncStorageAdapter as StateStorage),
    }
  )
);

export default useSettingsStore;
