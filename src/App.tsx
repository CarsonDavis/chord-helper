import { useEffect } from 'react';
import Header from './components/Header';
import Fretboard from './components/Fretboard';
import ChordLibrary from './components/ChordLibrary';
import { initializeDarkMode } from './stores/themeStore';

function App() {
  useEffect(() => {
    // Initialize dark mode on app load
    initializeDarkMode();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Fretboard />
          </div>
          <div className="lg:col-span-1">
            <ChordLibrary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
