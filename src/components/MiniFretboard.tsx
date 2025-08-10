import type { Note } from '../types/index';
import { getFretPositions } from '../utils/music';


const STRINGS = ['G', 'D', 'A', 'E'];
const FRET_COUNT = 12;
const FRET_DOTS = [3, 5, 7, 9, 12]; // Standard fret marker positions
const DOUBLE_DOTS = [12]; // 12th fret gets double dots

interface MiniFretboardProps {
  notes: Note[];
  size?: 'xs' | 'sm' | 'md';
}

export default function MiniFretboard({ notes, size = 'sm' }: MiniFretboardProps) {

  // Get accurate fret positions as percentages, scaled so 12th fret fills full width
  const rawPositions = getFretPositions(FRET_COUNT);
  const scaleFactor = 1 / rawPositions[FRET_COUNT]; // Scale so 12th fret = 1.0
  const fretPositions = rawPositions.map(pos => pos * scaleFactor);

  const sizeClasses = {
    xs: { 
      container: 'w-32 h-10',
      fretWidth: '0.5px',
      stringHeight: '0.5px',
      nutWidth: '1px',
      dotSize: 'w-1 h-1',
      fretDotSize: 'w-0.5 h-0.5',
      spacing: 1.5
    },
    sm: { 
      container: 'w-48 h-12',
      fretWidth: '0.5px',
      stringHeight: '0.5px', 
      nutWidth: '1px',
      dotSize: 'w-1.5 h-1.5',
      fretDotSize: 'w-1 h-1',
      spacing: 2
    },
    md: { 
      container: 'w-64 h-16',
      fretWidth: '1px',
      stringHeight: '0.5px',
      nutWidth: '2px', 
      dotSize: 'w-2 h-2',
      fretDotSize: 'w-1.5 h-1.5',
      spacing: 2.5
    }
  };

  const classes = sizeClasses[size];
  const fretSpacing = size === 'xs' ? 2 : size === 'sm' ? 3 : 4;

  const nutPosition = 8;
  const fretboardWidth = size === 'xs' ? 120 : size === 'sm' ? 184 : 248;
  const stringStart = nutPosition - 2;
  const stringEnd = nutPosition + fretboardWidth;

  return (
    <div className={`${classes.container} rounded relative overflow-hidden`} style={{ background: `linear-gradient(to right, #422212, #3a1e0f)` }}>
      {/* Nut */}
      <div
        className="absolute bg-gray-200"
        style={{ 
          left: `${nutPosition}px`,
          top: '2px',
          bottom: '2px',
          width: classes.nutWidth
        }}
      />
      
      {/* Fret wires - show full octave (12 frets) with accurate spacing */}
      {fretPositions.slice(1).map((position, fretIndex) => (
        <div
          key={fretIndex}
          className="absolute bg-gray-300"
          style={{ 
            left: `${nutPosition + position * fretboardWidth}px`,
            top: '2px',
            bottom: '2px',
            width: classes.fretWidth
          }}
        />
      ))}
      
      {/* Fret dots */}
      <div className="absolute pointer-events-none" style={{ left: `${nutPosition}px`, width: `${fretboardWidth}px`, top: '0px', height: '100%' }}>
        {fretPositions.slice(1).map((position, fretIndex) => {
          const fret = fretIndex + 1;
          const hasDot = [3, 5, 7, 9].includes(fret);
          const hasDoubleDot = DOUBLE_DOTS.includes(fret);
          
          if (!hasDot && !hasDoubleDot) return null;
          
          const prevPosition = fretPositions[fretIndex];
          const fretCenter = prevPosition + ((position - prevPosition) / 2);
          
          return (
            <div key={fret} className="absolute transform -translate-x-1/2" style={{ left: `${fretCenter * fretboardWidth}px`, height: '100%' }}>
              {hasDot && (
                <div className={`absolute top-1/2 left-1/2 ${classes.fretDotSize} rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2`} style={{ background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
              )}
              {hasDoubleDot && (
                <>
                  <div className={`absolute ${classes.fretDotSize} rounded-full shadow-sm transform -translate-x-1/2`} style={{ top: '25%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
                  <div className={`absolute ${classes.fretDotSize} rounded-full shadow-sm transform -translate-x-1/2`} style={{ top: '75%', left: '50%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle at 30% 30%, #f8fafc, #e2e8f0, #cbd5e1)' }}></div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Strings */}
      {STRINGS.map((_, stringIndex) => {
        const containerHeight = size === 'xs' ? 40 : size === 'sm' ? 48 : 64; // heights from container classes
        const topPadding = 4;
        const bottomPadding = 4;
        const availableHeight = containerHeight - topPadding - bottomPadding;
        const stringSpacing = availableHeight / (STRINGS.length - 1);
        
        return (
          <div
            key={stringIndex}
            className="absolute bg-gray-400"
            style={{ 
              left: `${stringStart}px`,
              right: `${size === 'xs' ? '2px' : size === 'sm' ? '4px' : '6px'}`,
              top: `${topPadding + stringIndex * stringSpacing}px`,
              height: classes.stringHeight
            }}
          />
        );
      })}
      
      {/* Selected notes */}
      {notes.map((note, index) => {
        // Show notes up to 12th fret (full octave)
        if (note.fret > 12) return null;
        
        const containerHeight = size === 'xs' ? 40 : size === 'sm' ? 48 : 64;
        const topPadding = 4;
        const bottomPadding = 4;
        const availableHeight = containerHeight - topPadding - bottomPadding;
        const stringSpacing = availableHeight / (STRINGS.length - 1);
        
        const x = note.fret === 0 
          ? nutPosition - 3
          : (() => {
              const prevPosition = fretPositions[note.fret - 1];
              // Use fixed offset scaled to this fretboard size (28px for 800px scale)
              const scaledOffset = (28 / 800) * fretboardWidth; // Scale 28px to this fretboard size
              const prevPixelPos = prevPosition * fretboardWidth;
              const notePixelPos = prevPixelPos + scaledOffset; // Fixed pixel offset
              return nutPosition + notePixelPos;
            })();
        const y = topPadding + note.string * stringSpacing;
        
        return (
          <div
            key={index}
            className={`absolute ${classes.dotSize} bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm`}
            style={{ 
              left: `${x}px`,
              top: `${y}px`
            }}
          />
        );
      })}
    </div>
  );
}
