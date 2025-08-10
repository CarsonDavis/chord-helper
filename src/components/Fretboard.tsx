import { useFretboardStore } from '../stores/fretboardStore';
import { useChordStore } from '../stores/chordStore';
import { getNoteFromFret, getFretPositions } from '../utils/music';

const STRINGS = ['G', 'D', 'A', 'E']; // Bass strings from top to bottom (correct visual order)
const FRET_COUNT = 12;
const FRET_DOTS = [3, 5, 7, 9, 12]; // Standard fret marker positions
const DOUBLE_DOTS = [12]; // 12th fret gets double dots

export default function Fretboard() {
  const { selectedNotes, toggleNote } = useFretboardStore();
  const { savedChords } = useChordStore();
  
  const isNoteSelected = (string: number, fret: number): boolean => {
    return selectedNotes.some(note => note.string === string && note.fret === fret);
  };

  // Get accurate fret positions as percentages, scaled so 12th fret fills full width
  const rawPositions = getFretPositions(FRET_COUNT);
  const scaleFactor = 1 / rawPositions[FRET_COUNT]; // Scale so 12th fret = 1.0
  const fretPositions = rawPositions.map(pos => pos * scaleFactor);
  const scaleLength = 800; // Total fretboard width in pixels

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">🎸 Bass Fretboard</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            Click notes to build chords
          </div>
          <button 
            onClick={() => useFretboardStore.getState().clearSelection()}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {/* Fret numbers */}
        <div className="relative mb-4" style={{ height: '20px', minWidth: `${60 + scaleLength}px` }}>
          <div className="absolute" style={{ left: '60px', width: `${scaleLength}px` }}>
            {fretPositions.slice(1).map((position, index) => (
              <div
                key={index + 1}
                className="absolute text-xs text-gray-300 font-medium transform -translate-x-1/2"
                style={{ left: `${position * scaleLength}px` }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Real Fretboard */}
        <div className="rounded-lg p-4 relative overflow-x-auto" style={{ minWidth: `${60 + scaleLength}px`, background: `linear-gradient(to right, #422212, #3a1e0f)` }}>
          {/* Nut - thick line between open strings and first fret */}
          <div
            className="absolute top-4 bottom-4 bg-gray-100 shadow-lg"
            style={{ 
              left: '60px',
              width: '4px'
            }}
          />
          
          {/* Fret wires - using accurate spacing */}
          {fretPositions.slice(1).map((position, fretIndex) => (
            <div
              key={fretIndex}
              className="absolute top-4 bottom-4 bg-gray-300 shadow-sm"
              style={{ 
                left: `${60 + position * scaleLength}px`,
                width: '2px'
              }}
            />
          ))}
          
          {/* Fret dots */}
          <div className="absolute pointer-events-none" style={{ left: '60px', width: `${scaleLength}px`, top: '16px', height: 'calc(100% - 32px)' }}>
            {fretPositions.slice(1).map((position, fretIndex) => {
              const fret = fretIndex + 1;
              const hasDot = [3, 5, 7, 9].includes(fret);
              const hasDoubleDot = fret === 12;
              
              if (!hasDot && !hasDoubleDot) return null;
              
              const prevPosition = fretPositions[fretIndex]; // This is the previous fret position  
              const fretCenter = prevPosition + ((position - prevPosition) / 2); // True center of fret space
              
              return (
                <div key={fret} className="absolute transform -translate-x-1/2" style={{ left: `${fretCenter * scaleLength}px`, height: '100%' }}>
                  {hasDot && (
                    <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
                  )}
                  {hasDoubleDot && (
                    <>
                      <div className="absolute w-3 h-3 rounded-full shadow-sm transform -translate-x-1/2" style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
                      <div className="absolute w-3 h-3 rounded-full shadow-sm transform -translate-x-1/2" style={{ top: '75%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Strings and fret positions */}
          {STRINGS.map((stringName, stringIndex) => (
            <div key={stringIndex} className="relative mb-4 last:mb-0" style={{ height: '32px' }}>
              {/* String line */}
              <div 
                className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 bg-gray-400 rounded-full shadow-sm"
                style={{ height: `${Math.max(1, stringIndex + 1)}px` }}
              />
              
              {/* String label */}
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-bold text-yellow-200">
                {stringName}
              </div>
              
              {/* Fret positions */}
              <div className="relative" style={{ width: `${scaleLength}px` }}>
                {/* Nut (open string) */}
                <button
                  onClick={() => toggleNote(stringIndex, 0)}
                  className="absolute w-12 h-8 flex items-center justify-center hover:bg-black/20 rounded transition-colors transform -translate-x-1/2"
                  style={{ left: '30px' }}
                >
                  <span className="text-xs text-yellow-200 font-medium z-10 relative">
                    {getNoteFromFret(stringIndex, 0)}
                  </span>
                  {isNoteSelected(stringIndex, 0) && (
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-600 shadow-lg"></div>
                    </div>
                  )}
                </button>
                
                {/* Frets */}
                {fretPositions.slice(1).map((position, fretIndex) => {
                  const fret = fretIndex + 1;
                  // Use fixed 28px offset from the current fret wire (to the right)
                  const currentPixelPos = position * scaleLength;
                  const notePixelPos = currentPixelPos - 28; // Fixed 28px offset to the left
                  const fretCenter = notePixelPos / scaleLength; // Convert back to percentage
                  
                  return (
                    <button
                      key={fret}
                      onClick={() => toggleNote(stringIndex, fret)}
                      className="absolute w-12 h-8 flex items-center justify-center hover:bg-black/20 rounded transition-colors transform -translate-x-1/2"
                      style={{ left: `${60 + fretCenter * scaleLength}px` }}
                    >
                      <span className="text-xs text-yellow-200 font-medium z-10 relative">
                        {getNoteFromFret(stringIndex, fret)}
                      </span>
                      {isNoteSelected(stringIndex, fret) && (
                        <div className="absolute inset-0 flex items-center justify-center z-0">
                          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-600 shadow-lg"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}