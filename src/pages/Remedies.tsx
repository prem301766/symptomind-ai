import { useState } from 'react';
import type { FormEvent } from 'react';
import { Leaf, Search, Loader2, Sparkles, Info, ArrowRight, Mic, MicOff } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceToText } from '../hooks/useVoiceToText';

const topics = [
  { name: 'Migraine', img: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Anxiety', img: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&q=80&w=400' },
  { name: 'Digestion', img: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&q=80&w=400' }
];

export default function Remedies() {
  const [ailment, setAilment] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { isRecording, toggleRecording } = useVoiceToText((transcript) => {
    setAilment(prev => prev + (prev ? ' ' : '') + transcript);
  });

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!ailment.trim()) return;

    setLoading(true);
    try {
      const data = await geminiService.getRemedies(ailment);
      setResult(data);
    } catch (error) {
      console.error('Remedies search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-900 text-white mb-12">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=2070" 
            alt="Herbal Medicine" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-16 md:px-12 md:py-20 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Leaf size={16} />
            Global Natural Wisdom
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Natural Remedies Explorer
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed">
            Discover science-backed natural treatments from Ayurveda, TCM, and Mediterranean traditions for common ailments.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative mb-12">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            value={ailment}
            onChange={(e) => setAilment(e.target.value)}
            placeholder={isRecording ? "Listening..." : "e.g., Insomnia, Bloating, Joint Pain..."}
            className={cn(
              "w-full pl-16 pr-56 py-6 text-xl bg-white border-2 border-slate-200 rounded-3xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm outline-none",
              isRecording && "border-red-400 ring-4 ring-red-100"
            )}
          />
          <div className="absolute right-3 top-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={cn(
                "h-full px-4 rounded-2xl transition-all",
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-50 text-slate-400 hover:text-emerald-600 border border-slate-100"
              )}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button
              type="submit"
              disabled={loading || !ailment.trim() || isRecording}
              className="h-full bg-emerald-600 text-white px-8 rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Explore'}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.remedies.map((remedy: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <Sparkles size={24} />
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                      {remedy.origin}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{remedy.name}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {remedy.description}
                  </p>
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Info size={14} />
                      Scientific Basis
                    </h4>
                    <p className="text-sm font-medium text-slate-700 italic">
                      "{remedy.scientificBasis}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex items-start gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
                <Info size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Medical Disclaimer</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  These remedies are based on traditional knowledge and general scientific studies. Always consult with a healthcare professional before starting any new herbal treatment, especially if you are on medication or pregnant.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          {topics.map((topic) => (
            <button
              key={topic.name}
              onClick={() => { setAilment(topic.name); }}
              className="group relative h-48 bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all text-left"
            >
              <img 
                src={topic.img} 
                alt={topic.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Try searching</p>
                <p className="text-xl font-black text-white flex items-center justify-between">
                  {topic.name}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
