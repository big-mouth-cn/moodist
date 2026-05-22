import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import merge from 'deepmerge';
import { v4 as uuid } from 'uuid';

import type { Language } from '@/i18n/types';

export interface AISoundscapeRecord {
  createdAt: number;
  id: string;
  language: Language;
  prompt: string;
  sounds: Record<string, number>;
  summary: string;
}

interface AISoundscapeStore {
  addRecord: (record: Omit<AISoundscapeRecord, 'createdAt' | 'id'>) => void;
  deleteRecord: (id: string) => void;
  records: AISoundscapeRecord[];
}

const MAX_RECORDS = 30;

export const useAISoundscapeStore = create<AISoundscapeStore>()(
  persist(
    (set, get) => ({
      addRecord(record) {
        set({
          records: [
            {
              ...record,
              createdAt: Date.now(),
              id: uuid(),
            },
            ...get().records,
          ].slice(0, MAX_RECORDS),
        });
      },

      deleteRecord(id) {
        set({
          records: get().records.filter(record => record.id !== id),
        });
      },

      records: [],
    }),
    {
      merge: (persisted, current) =>
        merge(current, persisted as Partial<AISoundscapeStore>),
      name: 'moodist-ai-soundscapes',
      partialize: state => ({ records: state.records }),
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      version: 0,
    },
  ),
);
