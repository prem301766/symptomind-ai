import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, BadgeCheck, Search, Filter, ChevronRight, Stethoscope, Mic, MicOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useVoiceToText } from '../hooks/useVoiceToText';

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const { isRecording, toggleRecording } = useVoiceToText((transcript) => {
    setSearch(prev => prev + (prev ? ' ' : '') + transcript);
  });

  useEffect(() => {
    fetch('/api/doctors')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setDoctors(data))
      .catch(err => console.error('Doctors fetch failed:', err));
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=2070" 
            alt="Doctors Network" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-16 md:px-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Star size={16} className="fill-indigo-200" />
              Verified Specialists
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Find Your Perfect Care Provider
            </h1>
            <p className="text-lg text-indigo-100 leading-relaxed">
              Connect with top-rated, verified medical specialists in your area and book appointments instantly.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={isRecording ? "Listening..." : "Search by name or specialty..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-12 pr-12 py-4 bg-white text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-medium",
                  isRecording && "ring-4 ring-red-400"
                )}
              />
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
                  isRecording ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-indigo-600"
                )}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, i) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Stethoscope size={32} />
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                  <Star size={14} className="fill-amber-700" />
                  {doctor.rating}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                  {doctor.verified && <BadgeCheck className="text-indigo-600" size={18} />}
                </div>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider">{doctor.specialty}</p>
              </div>

              <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                {doctor.bio}
              </p>

              <div className="flex items-center gap-4 mb-6 text-sm font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {doctor.distance}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} />
                  450+ Reviews
                </div>
              </div>

              <Link 
                to={`/booking/${doctor.id}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-sm group-hover:shadow-indigo-200"
              >
                Book Appointment
                <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
