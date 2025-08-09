export interface Note {
  string: number;    // 0-3 (E, A, D, G)
  fret: number;      // 0-24
  noteName: string;  // "A", "A#", "B", etc.
  frequency?: number;
}

export interface Chord {
  id: string;
  name: string;
  notes: Note[];
  tags: string[];
  createdAt: Date;
  rootNote?: string;
  chordType?: string; // "major", "minor", "7th", etc.
}

export interface FretboardState {
  selectedNotes: Note[];
  displayRange: { startFret: number; endFret: number };
  currentChord?: {
    detectedName: string;
    confidence: number;
  };
}

export interface ChordStore {
  savedChords: Chord[];
  addChord: (chord: Omit<Chord, 'id' | 'createdAt'>) => void;
  removeChord: (id: string) => void;
  searchChords: (query: string) => Chord[];
}