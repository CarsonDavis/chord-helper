const BASS_TUNING = ['G', 'D', 'A', 'E']; // Standard 4-string bass tuning (G=top, E=bottom visually)
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteFromFret(string: number, fret: number): string {
  const openNote = BASS_TUNING[string];
  const openNoteIndex = NOTES.indexOf(openNote);
  const noteIndex = (openNoteIndex + fret) % 12;
  return NOTES[noteIndex];
}

export function getFrequency(string: number, fret: number): number {
  // G2 = 98 Hz, D2 = 73.4 Hz, A1 = 55 Hz, E1 = 41.2 Hz (top to bottom visually)
  const baseFrequencies = [98, 73.4, 55, 41.2];
  const baseFreq = baseFrequencies[string];
  return baseFreq * Math.pow(2, fret / 12);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Calculate fret positions using the 12th root of 2 ratio
export function calculateFretPosition(fretNumber: number, scaleLength: number): number {
  if (fretNumber === 0) return 0;
  const fretConstant = Math.pow(2, 1/12); // 12th root of 2 ≈ 1.059463
  return scaleLength - (scaleLength / Math.pow(fretConstant, fretNumber));
}

// Get all fret positions as percentages of scale length for easy scaling
export function getFretPositions(totalFrets: number = 12): number[] {
  const positions = [0]; // Nut position
  for (let fret = 1; fret <= totalFrets; fret++) {
    positions.push(calculateFretPosition(fret, 1)); // Using 1 as scale length for percentage
  }
  return positions;
}