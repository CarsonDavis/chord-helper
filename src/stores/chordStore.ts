import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chord, ChordStore } from '../types/index';
import { generateId } from '../utils/music';
import { useFretboardStore } from './fretboardStore';

export const useChordStore = create<ChordStore>()(
  persist(
    (set, get) => ({
      savedChords: [],

      addChord: (chordData) => {
        const newChord: Chord = {
          ...chordData,
          id: generateId(),
          createdAt: new Date()
        };
        set(state => ({
          savedChords: [...state.savedChords, newChord]
        }));
        useFretboardStore.getState().loadChordNotes(newChord.notes);
      },

      removeChord: (id) => {
        set(state => ({
          savedChords: state.savedChords.filter(chord => chord.id !== id)
        }));
      },

      searchChords: (query) => {
        const { savedChords } = get();
        if (!query.trim()) return savedChords;
        
        const lowercaseQuery = query.toLowerCase();
        return savedChords.filter(chord =>
          chord.name.toLowerCase().includes(lowercaseQuery) ||
          chord.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
          chord.rootNote?.toLowerCase().includes(lowercaseQuery) ||
          chord.chordType?.toLowerCase().includes(lowercaseQuery)
        );
      }
    }),
    {
      name: 'bass-chord-storage'
    }
  )
);