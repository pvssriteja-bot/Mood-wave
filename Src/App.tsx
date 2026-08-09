import React, { useState, useEffect, useRef } from 'react';
import { Layout, Palette, Zap, Disc3, BarChart3, Star, Heart } from 'lucide-react';
import './style.css'; // standard styles automatically added by sandbox

// --- Mock Data For Visuals ---
const mockPlaylists = [
  { id: 1, name: 'Chill Vibes for Study 📖', image: 'https://images.unsplash.com/photo-1518173946687-a4c8a3b1d98e?q=80&w=200', energy: 0.2, valence: 0.8 },
  { id: 2, name: 'Late Night Beats 🌙', image: 'https://images.unsplash.com/photo-1541416738914-41d402b8d003?q=80&w=200', energy: 0.5, valence: 0.4 },
  { id: 3, name: 'Dance Party Anthems 🎉', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200', energy: 0.9, valence: 0.9 },
  { id: 4, name: 'Acoustic Love Songs ❤️', image: 'https://images.unsplash.com/photo-1531336444-24ff0e68d37a?q=80&w=200', energy: 0.3, valence: 0.95 },
];

const mockAnalyticColors = ['#4ade80', '#fb923c', '#ef4444', '#facc15', '#60a5fa']; // green, orange, red, yellow, blue

// --- UI Utility: Determine Gradient colors from Valence/Energy ---
const getAmbientGradients = (energy: number, valence: number) => {
  if (energy < 0.4 && valence > 0.6) { // Chill, peaceful
    return 'from-blue-900 to-green-900';
  } else if (energy > 0.7 && valence > 0.7) { // High Energy, Happy
    return 'from-yellow-900 to-orange-900';
  } else if (energy > 0.6 && valence < 0.4) { // Intense, Dark/Aggressive
    return 'from-red-950 to-purple-950';
  } else if (energy < 0.4 && valence < 0.4) { // Slow, Sad/Moody
    return 'from-indigo-950 to-slate-900';
  }
  return 'from-black to-zinc-950'; // Default background
};

// --- Mock Visualizer Component ---
const MoodVisualizer: React.FC<{ energy: number, valence: number }> = ({ energy, valence }) => {
  const [gradient, setGradient] = useState(() => getAmbientGradients(energy, valence));

  useEffect(() => {
    setGradient(getAmbientGradients(energy, valence));
  }, [energy, valence]);

  return (
    <div className={`relative w-full h-96 flex items-center justify-center p-6 bg-gradient-to-br ${gradient} rounded-3xl border border-white/10 shadow-inner overflow-hidden transition-all duration-1000`}>
      {/* Central Pulsing Element (Glows and scales based on parameters) */}
      <div 
        className="relative group flex items-center justify-center"
        style={{ transform: `scale(${1 + energy * 0.4})` }}
      >
        <Palette className="w-24 h-24 text-white opacity-80 group-hover:scale-105 transition-transform" strokeWidth={1} />
        {/* The Pulsing Glow */}
        <div 
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-60 transition-colors duration-1000"
          style={{ 
            backgroundColor: (valence > 0.6) ? '#facc15' : ((energy > 0.7) ? '#ef4444' : '#60a5fa'), 
          }}
        />
        
        {/* Optional particle overlay (will need canvas/three.js for real effect) */}
        <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-50">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Simple Status Label */}
      <div className="absolute bottom-6 left-6 text-white text-xs px-3 py-1 bg-white/10 rounded-full border border-white/5 backdrop-blur-sm">
        Energy: <span className="font-bold">{Math.round(energy * 100)}%</span>, Valence: <span className="font-bold">{Math.round(valence * 100)}%</span>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(mockPlaylists[0]);
  const [analyticColors, setAnalyticColors] = useState(mockAnalyticColors);

  // Dynamic analytic graph color changer (can be based on selected item)
  useEffect(() => {
    setAnalyticColors(selectedPlaylist.energy > 0.7 ? ['#ef4444', '#fb923c', '#ef4444', '#facc15', '#ef4444'] : mockAnalyticColors);
  }, [selectedPlaylist]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-sans antialiased overflow-hidden">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Disc3 className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-extrabold tracking-tighter text-white">Mood<span className="text-white/70">Wave</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm bg-white/5 px-5 py-2.5 rounded-full border border-white/5">
          <p className="text-white/70">Dashboard</p>
          <BarChart3 className="w-5 h-5 text-white/50" />
        </div>
      </header>

      {/* Main Grid: Visualizer & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,28rem] gap-10">
        
        {/* Left Column: Visualizer & Playlists */}
        <div className="flex flex-col gap-10">
          {/* Main Visualizer Area */}
          <MoodVisualizer energy={selectedPlaylist.energy} valence={selectedPlaylist.valence} />

          {/* Special Playlist Section */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-md">
            <h2 className="text-xl font-bold mb-6 text-white/80">Selected Vibe Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mockPlaylists.map(pl => (
                <button 
                  key={pl.id} 
                  onClick={() => setSelectedPlaylist(pl)}
                  className={`relative group flex flex-col items-center gap-4 p-4 text-center rounded-2xl border transition-all duration-300 ${selectedPlaylist.id === pl.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <img src={pl.image} alt={pl.name} className="w-32 h-32 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform" />
                  <p className="text-xs font-semibold text-white/70">{pl.name}</p>
                  
                  {/* Selected Indicator */}
                  {selectedPlaylist.id === pl.id && (
                    <div className="absolute top-3 right-3 bg-white text-black p-1 rounded-full shadow-md">
                      <Star className="w-4 h-4 fill-black text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & User Controls */}
        <aside className="bg-zinc-950 p-8 rounded-3xl border border-white/5 shadow-inner flex flex-col gap-12">
          
          {/* Mood Analysis Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white/80">Current Profile</h3>
              <Layout className="w-5 h-5 text-zinc-600" />
            </div>
            
            <div className="grid grid-cols-5 items-end gap-1.5 h-32 border-b border-white/5 mb-6 pb-4">
              {[0.85, 0.65, 0.45, 0.75, 0.6].map((h, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500" 
                    style={{ height: `${h * 100}%`, backgroundColor: analyticColors[i] }} 
                  />
                </div>
              ))}
            </div>
            
            <p className="text-sm text-zinc-400 font-medium leading-relaxed">
              Your overall auditory landscape is <span className="font-semibold text-white/80">{selectedPlaylist.name}</span>, feeling generally {selectedPlaylist.valence > 0.6 ? 'uplifting' : 'moody'} with {selectedPlaylist.energy > 0.7 ? 'high' : 'gentle'} energy. Great choice.
            </p>
          </div>

          {/* Direct Controls (Mocked, will integrate with Spotify Playback later) */}
          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 shadow-inner">
            <h4 className="text-md font-semibold text-white/80 mb-5">Quick Controls</h4>
            <div className="flex items-center gap-4">
              <button className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition">Sync Now</button>
              <button className="flex-1 px-4 py-3 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition">Demo Mode</button>
            </div>
          </div>

          {/* Creator/Gift note (very important for crush gift aspect!) */}
          <div className="mt-auto bg-green-950/40 p-5 rounded-xl border border-green-900 flex items-start gap-4">
            <Heart className="w-12 h-12 text-green-400 mt-1 flex-shrink-0" fill="#4ade80" />
            <div>
              <p className="text-xs text-green-200">Created specially for</p>
              <p className="text-lg font-bold text-green-100 tracking-tight">[Anusha 💖]</p>
            </div>
          </div>

        </aside>
      </div>

      {/* Basic Footer (Optional) */}
      <footer className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
        Demo Mode | Build with React & Lucide
      </footer>
    </div>
  );
}
