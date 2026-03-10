import { useState, useEffect } from 'react';
import { Phone, MapPin, Navigation, AlertCircle, Loader2, ChevronLeft, Siren, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

export default function EmergencyAmbulance() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ text: string; groundingChunks: any[] } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Please enable location access to find nearby ambulances.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const findAmbulances = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);
    try {
      const data = await geminiService.findNearbyAmbulances(location.lat, location.lng);
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to find nearby services. Please dial emergency numbers directly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      findAmbulances();
    }
  }, [location]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
      >
        <ChevronLeft size={20} />
        {t('common.back')}
      </button>

      <div className="bg-red-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-red-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Siren size={200} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Emergency Assistance</h1>
          </div>
          
          <p className="text-xl text-red-100 mb-10 max-w-2xl leading-relaxed">
            If you are in a life-threatening situation, please call emergency services immediately.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="tel:112" 
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 hover:bg-red-50 transition-all shadow-xl"
            >
              <Phone size={24} />
              Call 112 (National)
            </a>
            <a 
              href="tel:102" 
              className="bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-xl flex items-center gap-3 hover:bg-red-800 transition-all shadow-xl"
            >
              <Phone size={24} />
              Call 102 (Ambulance)
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Navigation className="text-indigo-600" />
              Nearby Emergency Services
            </h2>

            {loading ? (
              <div className="py-20 text-center space-y-4">
                <Loader2 className="animate-spin text-indigo-600 mx-auto" size={48} />
                <p className="text-slate-500 font-bold">Locating nearest ambulances...</p>
              </div>
            ) : error ? (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-800 flex items-start gap-4">
                <AlertCircle className="shrink-0 mt-1" />
                <div>
                  <p className="font-bold mb-1">Location Access Required</p>
                  <p className="text-sm opacity-80">{error}</p>
                </div>
              </div>
            ) : results ? (
              <div className="space-y-8">
                <div className="prose prose-slate max-w-none">
                  <Markdown>{results.text}</Markdown>
                </div>

                {results.groundingChunks.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Verified Locations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.groundingChunks.map((chunk: any, i: number) => (
                        chunk.maps && (
                          <motion.a
                            key={i}
                            href={chunk.maps.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600">
                                <MapPin size={18} />
                              </div>
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">
                                {chunk.maps.title}
                              </span>
                            </div>
                            <Navigation size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                          </motion.a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-10">Detecting location to find services...</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-100">
            <h3 className="font-black text-lg mb-4">Emergency Tutorials</h3>
            <p className="text-sm text-indigo-100 mb-6 font-medium">Learn life-saving techniques like CPR, Heimlich maneuver, and more with our AI-guided tutorials.</p>
            <button 
              onClick={() => navigate('/emergency-tutorials')}
              className="w-full bg-white text-indigo-600 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
            >
              <Play size={16} fill="currentColor" />
              Watch Tutorials
            </button>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg shadow-slate-100">
            <h3 className="font-black text-lg mb-4">First Aid Tips</h3>
            <ul className="space-y-4 text-sm font-medium text-indigo-100">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
                Stay calm and ensure the area is safe.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
                Check for responsiveness and breathing.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
                If bleeding, apply firm pressure with a clean cloth.
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">4</div>
                Do not move the person unless they are in immediate danger.
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 mb-4">Important Numbers</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-600">Police</span>
                <span className="font-black text-indigo-600">100</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-600">Fire</span>
                <span className="font-black text-indigo-600">101</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm font-bold text-slate-600">Women Helpline</span>
                <span className="font-black text-indigo-600">1091</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
