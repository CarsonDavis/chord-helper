import { useFretboardStore } from '../stores/fretboardStore';

export default function Header() {
  const { selectedNotes, clearSelection, currentChord } = useFretboardStore();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Bass Chord Helper
          </h1>
          
          <div className="flex items-center gap-4">
            {selectedNotes.length > 0 && (
              <>
                <div className="text-sm text-gray-600">
                  {selectedNotes.length} note{selectedNotes.length !== 1 ? 's' : ''} selected
                  {currentChord && (
                    <span className="ml-2 font-medium text-blue-600">
                      ({currentChord.detectedName})
                    </span>
                  )}
                </div>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}