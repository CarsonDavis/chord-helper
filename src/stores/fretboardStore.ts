import { create } from 'zustand';
import type { Note, FretboardState } from '../types/index';
import { getNoteFromFret, getFrequency } from '../utils/music';

interface FretboardStore extends FretboardState {
  toggleNote: (string: number, fret: number) => void;
  clearSelection: () => void;
  setDisplayRange: (startFret: number, endFret: number) => void;
  loadChordNotes: (notes: Note[]) => void;
}

export const useFretboardStore = create<FretboardStore>((set, get) => ({
  selectedNotes: [],
  displayRange: { startFret: 0, endFret: 12 },
  currentChord: undefined,

  toggleNote: (string: number, fret: number) => {
    const { selectedNotes } = get();
    const existingIndex = selectedNotes.findIndex(
      note => note.string === string && note.fret === fret
    );

    if (existingIndex >= 0) {
      // Remove note
      set({
        selectedNotes: selectedNotes.filter((_, index) => index !== existingIndex)
      });
    } else {
      // Add note
      const newNote: Note = {
        string,
        fret,
        noteName: getNoteFromFret(string, fret),
        frequency: getFrequency(string, fret)
      };
      set({
        selectedNotes: [...selectedNotes, newNote]
      });
    }
  },

  clearSelection: () => {
    set({ selectedNotes: [], currentChord: undefined });
  },

  setDisplayRange: (startFret: number, endFret: number) => {
    set({ displayRange: { startFret, endFret } });
  },

  loadChordNotes: (notes: Note[]) => {
    set({ selectedNotes: notes });
  }
}));