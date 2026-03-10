import { useState } from 'react';
import { 
  ChevronLeft, 
  Play, 
  Search, 
  Zap, 
  Heart, 
  Wind, 
  Droplets, 
  Flame, 
  AlertCircle,
  Loader2,
  MessageSquare,
  ArrowRight,
  Activity,
  Brain,
  Syringe,
  Bug
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Tutorial {
  id: string;
  title: string;
  category: string;
  icon: any;
  videoUrl: string;
  thumbnail: string;
  steps: string[];
  color: string;
}

const tutorials: Tutorial[] = [
  {
    id: 'cpr',
    title: 'Adult CPR (Hands-Only)',
    category: 'Cardiac',
    icon: Heart,
    videoUrl: 'https://www.youtube.com/embed/Plse2FOkV4Q',
    thumbnail: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Check the scene for safety.',
      'Check for responsiveness (tap and shout).',
      'Call 112 or ask someone else to call.',
      'Place hands in the center of the chest.',
      'Push hard and fast (100-120 compressions per minute).',
      'Continue until professional help arrives or an AED is ready.'
    ],
    color: 'bg-rose-500'
  },
  {
    id: 'choking',
    title: 'Heimlich Maneuver',
    category: 'Airway',
    icon: Wind,
    videoUrl: 'https://www.youtube.com/embed/bNwXnJQqA-g',
    thumbnail: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Stand behind the person and wrap your arms around their waist.',
      'Make a fist with one hand.',
      'Place the thumb side of your fist just above the navel.',
      'Grasp your fist with the other hand.',
      'Perform quick, upward thrusts until the object is forced out.'
    ],
    color: 'bg-amber-500'
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding Control',
    category: 'Trauma',
    icon: Droplets,
    videoUrl: 'https://www.youtube.com/embed/jeviYt1Eaow',
    thumbnail: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Apply direct pressure with a clean cloth or bandage.',
      'If the cloth soaks through, add more on top (do not remove the first one).',
      'Maintain pressure until help arrives.',
      'If bleeding is from a limb and direct pressure fails, consider a tourniquet.'
    ],
    color: 'bg-red-600'
  },
  {
    id: 'burns',
    title: 'Treating Minor Burns',
    category: 'Trauma',
    icon: Flame,
    videoUrl: 'https://www.youtube.com/embed/D8L_w_S-m8U',
    thumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Cool the burn under cool (not cold) running water for 10-20 minutes.',
      'Remove jewelry or tight clothing before the area starts to swell.',
      'Do not break blisters.',
      'Apply a loose, sterile bandage.'
    ],
    color: 'bg-orange-500'
  },
  {
    id: 'seizure',
    title: 'Seizure First Aid',
    category: 'Neurological',
    icon: Activity,
    videoUrl: 'https://www.youtube.com/embed/ovOQYFmH_YQ',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Cushion the head and remove glasses.',
      'Loosen tight clothing around the neck.',
      'Turn the person on their side as soon as possible.',
      'Time the seizure. If it lasts >5 mins, call 112.',
      'Do not put anything in their mouth.',
      'Stay with them until they are fully awake.'
    ],
    color: 'bg-indigo-500'
  },
  {
    id: 'stroke',
    title: 'Stroke Recognition (FAST)',
    category: 'Neurological',
    icon: Brain,
    videoUrl: 'https://www.youtube.com/embed/vJpS_v8_QpM',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Face: Ask the person to smile. Does one side droop?',
      'Arms: Ask them to raise both arms. Does one drift downward?',
      'Speech: Ask them to repeat a simple phrase. Is it slurred?',
      'Time: If you see any of these signs, call 112 immediately.',
      'Note the time when symptoms first started.'
    ],
    color: 'bg-purple-600'
  },
  {
    id: 'anaphylaxis',
    title: 'Using an EpiPen',
    category: 'Allergy',
    icon: Syringe,
    videoUrl: 'https://www.youtube.com/embed/EN83u6S_6L0',
    thumbnail: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Flip open the yellow cap and slide the auto-injector out.',
      'Grasp with orange tip pointing down. Remove blue safety release.',
      'Swing and push orange tip firmly into outer thigh until it clicks.',
      'Hold in place for 3 full seconds.',
      'Call 112 immediately after administration.'
    ],
    color: 'bg-teal-600'
  },
  {
    id: 'snakebite',
    title: 'Snake Bite First Aid',
    category: 'Environmental',
    icon: Bug,
    videoUrl: 'https://www.youtube.com/embed/kFbvJkbUukQ',
    thumbnail: 'https://images.unsplash.com/photo-1550147760-44c9966d6bc7?auto=format&fit=crop&q=80&w=600',
    steps: [
      'Keep the person calm and still.',
      'Apply a pressure immobilization bandage over the bite site.',
      'Extend the bandage up the entire limb.',
      'Splint the limb to keep it immobile.',
      'Do not wash, suck, or cut the bite site.',
      'Call 112 immediately.'
    ],
    color: 'bg-emerald-700'
  }
];

export default function EmergencyTutorials() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);
    try {
      const response = await geminiService.getEmergencyInstructions(searchQuery);
      setAiResponse(response);
    } catch (err) {
      console.error("AI Error:", err);
      setAiResponse("I'm sorry, I couldn't retrieve instructions at this moment. Please follow standard emergency protocols or call 112.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            {t('common.back')}
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Emergency <span className="text-red-600">Tutorials</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">AI-powered life-saving guides and videos.</p>
        </div>

        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 max-w-sm">
          <AlertCircle className="text-red-600 shrink-0" size={24} />
          <p className="text-xs font-bold text-red-900">
            In a real emergency, always call 112 first. These guides are for informational purposes.
          </p>
        </div>
      </div>

      {/* AI Assistant Section */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-100 border border-slate-100">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-black uppercase tracking-widest">
              <Zap size={16} />
              AI Emergency Assistant
            </div>
            <h2 className="text-3xl font-black text-slate-900">Need instant instructions?</h2>
            <p className="text-slate-500 font-medium">Ask our AI for step-by-step guidance for any emergency situation.</p>
          </div>

          <form onSubmit={handleAISearch} className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., How to help someone having a seizure?"
              className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-3xl py-6 px-8 text-lg font-medium shadow-sm transition-all outline-none pr-32"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="absolute right-3 top-3 bottom-3 bg-indigo-600 text-white px-6 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
              Ask AI
            </button>
          </form>

          <AnimatePresence mode="wait">
            {aiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-left bg-slate-50 rounded-3xl p-8 border border-slate-200 mt-8"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
                  <div className="bg-indigo-600 p-2 rounded-xl text-white">
                    <MessageSquare size={20} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">AI Instructions</h3>
                </div>
                <div className="prose prose-slate max-w-none prose-headings:font-black prose-p:font-medium">
                  <Markdown>{aiResponse}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Tutorials Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Common Procedures</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorials.map((tutorial) => (
            <motion.div
              key={tutorial.id}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedTutorial(tutorial)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={tutorial.thumbnail} 
                  alt={tutorial.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <div className={cn("absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest", tutorial.color)}>
                  {tutorial.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-2 rounded-xl text-white", tutorial.color)}>
                    <tutorial.icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{tutorial.title}</h3>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-sm font-bold">
                  <span>{tutorial.steps.length} Steps</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Video Modal / Detail Section */}
      <AnimatePresence>
        {selectedTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-10 bg-slate-900/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row h-full max-h-[85vh]"
            >
              <button 
                onClick={() => setSelectedTutorial(null)}
                className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-md text-white md:text-slate-900 p-2 rounded-full hover:bg-white/40 transition-all"
              >
                <ChevronLeft size={24} className="rotate-180" />
              </button>

              {/* Video Player */}
              <div className="w-full md:w-3/5 bg-black flex items-center justify-center relative aspect-video md:aspect-auto">
                <iframe
                  src={selectedTutorial.videoUrl}
                  title={selectedTutorial.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Instructions Sidebar */}
              <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto bg-slate-50">
                <div className="space-y-8">
                  <div>
                    <div className={`${selectedTutorial.color} inline-flex p-2 rounded-xl text-white mb-4`}>
                      <selectedTutorial.icon size={20} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedTutorial.title}</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">{selectedTutorial.category} Protocol</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Step-by-Step Guide</h4>
                    <div className="space-y-4">
                      {selectedTutorial.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0 font-black text-indigo-600 text-sm shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                            {index + 1}
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed pt-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-slate-200">
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                      <AlertCircle className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs font-bold text-amber-900 leading-relaxed">
                        Disclaimer: This video is for educational purposes. In a real emergency, call professional help immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Tips Footer */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Zap size={300} />
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-black tracking-tight leading-tight">Be Prepared. <br/><span className="text-indigo-400">Save a Life.</span></h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              Knowledge is the best tool in an emergency. Take a few minutes to watch these videos and familiarize yourself with basic life-saving techniques.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Verified</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Access</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 space-y-6">
            <h3 className="font-black text-xl">Quick Emergency Checklist</h3>
            <ul className="space-y-4">
              {[
                'Call 112 immediately.',
                'Check for breathing and pulse.',
                'Do not move the victim unless necessary.',
                'Keep the victim warm and calm.',
                'Stay with them until help arrives.'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
