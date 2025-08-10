import { useState } from 'react';
import { useChordStore } from '../stores/chordStore';
import { useFretboardStore } from '../stores/fretboardStore';
import MiniFretboard from './MiniFretboard';

export default function ChordLibrary() {
  const { savedChords, searchChords, removeChord } = useChordStore();
  const { selectedNotes, loadChordNotes } = useFretboardStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chordName, setChordName] = useState('');
  const [chordTags, setChordTags] = useState('');

  const filteredChords = searchQuery ? searchChords(searchQuery) : savedChords;

  const handleSaveChord = () => {
    if (!chordName.trim() || selectedNotes.length === 0) return;
    
    const { addChord } = useChordStore.getState();
    const newChord = {
      name: chordName.trim(),
      notes: selectedNotes,
      tags: chordTags.split(',').map(tag => tag.trim()).filter(Boolean),
      rootNote: selectedNotes[0]?.noteName
    };
    addChord(newChord);
    loadChordNotes(newChord.notes);
    
    setChordName('');
    setChordTags('');
    setShowSaveDialog(false);
  };

  const handleLoadChord = (chordNotes: any[]) => {
    loadChordNotes(chordNotes);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Chord Library</h2>
        
        {/* Save current chord */}
        {selectedNotes.length > 0 && (
          <button
            onClick={() => setShowSaveDialog(true)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors mb-3"
          >
            Save Current Chord
          </button>
        )}
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search chords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Saved chords list */}
      <div className="space-y-2">
        {filteredChords.map((chord) => (
          <div
            key={chord.id}
            className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col gap-2 mb-1">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => handleLoadChord(chord.notes)}
                  className="text-left flex-1 min-w-0"
                >
                  <div className="font-medium text-gray-900 truncate">{chord.name}</div>
                  <div className="text-sm text-gray-600">
                    {chord.notes.length} notes
                    {chord.rootNote && ` • Root: ${chord.rootNote}`}
                  </div>
                </button>
                <button
                  onClick={() => removeChord(chord.id)}
                  className="text-red-500 hover:text-red-700 p-1 ml-2"
                >
                  ×
                </button>
              </div>
              <div className="flex-shrink-0">
                <MiniFretboard notes={chord.notes} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                {chord.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chord.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredChords.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            {searchQuery ? 'No chords found' : 'No saved chords yet'}
          </div>
        )}
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Chord</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Chord name"
                value={chordName}
                onChange={(e) => setChordName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={chordTags}
                onChange={(e) => setChordTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveChord}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}