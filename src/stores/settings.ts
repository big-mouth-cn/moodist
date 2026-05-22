import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import merge from 'deepmerge';

import type { Language } from '@/i18n/types';

interface SettingsStore {
  alarmVolume: number;
  globalVolume: number;
  language: Language;
  setAlarmVolume: (volume: number) => void;
  setGlobalVolume: (volume: number) => void;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      alarmVolume: 1,
      globalVolume: 1,
      language: 'zh-CN',

      setAlarmVolume(volume: number) {
        set({ alarmVolume: volume });
      },

      setGlobalVolume(volume: number) {
        set({ globalVolume: volume });
      },

      setLanguage(language: Language) {
        set({ language });
      },
    }),
    {
      merge: (persisted, current) =>
        merge(current, persisted as Partial<SettingsStore>),
      name: 'moodist-settings',
      partialize: state => ({
        alarmVolume: state.alarmVolume,
        globalVolume: state.globalVolume,
        language: state.language,
      }),
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      version: 0,
    },
  ),
);
