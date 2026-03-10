import { useState } from 'react';
import type { FormEvent } from 'react';
import { 
  Activity, 
  Search, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Stethoscope, 
  FileText, 
  ShieldCheck, 
  HeartPulse,
  Sparkles,
  Pill,
  Calculator,
  MessageSquare,
  Mic,
  MicOff,
  Siren
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useVoiceToText } from '../hooks/useVoiceToText';
import { useTranslation } from 'react-i18next';

export default function Home({ user }: { user: any }) {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { isRecording, toggleRecording } = useVoiceToText((transcript) => {
    setSymptoms(prev => prev + (prev ? ' ' : '') + transcript);
  });

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    try {
      const analysis = await geminiService.analyzeSymptoms(symptoms);
      setResult(analysis);
      
      await fetch('/api/symptom-checks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest-123',
          symptoms,
          analysis: analysis.analysis,
          urgency: analysis.urgency,
          specialist: analysis.specialist
        })
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
            alt="Medical Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-20 md:px-16 md:py-32 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Stethoscope className="text-white" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter leading-none">SymptoMind<span className="text-indigo-400">AI</span></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300/60 mt-1">Intelligence for Life</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 px-4 py-1.5 rounded-full text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            Next-Gen Healthcare Assistant
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] flex flex-wrap items-center gap-x-6"
          >
            <span>{t('home.heroTitle').split(',')[0]},</span>
            <span className="flex items-center gap-4">
              <span className="text-indigo-400">{t('home.heroTitle').split(',')[1]?.trim().split(' ')[0]}</span>
              <HeartPulse className="text-indigo-400 animate-pulse" size={64} />
            </span>
            <span>{t('home.heroTitle').split(',')[1]?.trim().split(' ').slice(1).join(' ')}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl"
          >
            {t('home.heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <motion.a 
              href="#checker" 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-900/40"
            >
              Start Symptom Check
            </motion.a>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/doctors" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-black text-lg transition-all">
                Find a Doctor
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/emergency" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-900/40 flex items-center gap-2">
                <Siren size={20} />
                {t('common.emergency')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Symptom Checker Section */}
      <section id="checker" className="max-w-4xl mx-auto scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t('home.symptomAwareness')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('home.heroSubtitle')}
          </p>
        </div>

        <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100">
          <form onSubmit={handleAnalyze} className="relative">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={isRecording ? t('home.listening') : t('home.symptomPlaceholder')}
              className={cn(
                "w-full min-h-[200px] p-8 text-xl bg-transparent border-none focus:ring-0 transition-all resize-none placeholder:text-slate-300",
                isRecording && "text-indigo-600"
              )}
            />
            <div className="absolute top-8 right-8">
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "p-4 rounded-2xl transition-all shadow-lg",
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-white text-slate-400 hover:text-indigo-600 border border-slate-100"
                )}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-slate-50">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium px-4">
                <ShieldCheck size={18} className="text-emerald-500" />
                {t('home.privateSecure')}
              </div>
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-3 shadow-lg shadow-indigo-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    {t('home.analyzing')}
                  </>
                ) : (
                  <>
                    {t('home.checkNow')}
                    <ArrowRight size={24} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              <div className={cn(
                "p-8 rounded-3xl border-l-[12px] shadow-xl",
                result.urgency === 'Emergency' ? "bg-red-50 border-red-600" :
                result.urgency === 'High' ? "bg-orange-50 border-orange-500" :
                "bg-emerald-50 border-emerald-500"
              )}>
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "p-4 rounded-2xl",
                    result.urgency === 'Emergency' ? "bg-red-100 text-red-600" :
                    result.urgency === 'High' ? "bg-orange-100 text-orange-600" :
                    "bg-emerald-100 text-emerald-600"
                  )}>
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                      Urgency: {result.urgency}
                    </h3>
                    <p className="text-lg text-slate-700 leading-relaxed">
                      {result.analysis}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Possible Match</h4>
                  <p className="text-2xl font-bold text-slate-900">{result.probabilityMatch}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recommended Specialist</h4>
                  <p className="text-2xl font-bold text-indigo-600">{result.specialist}</p>
                </div>
              </div>

              <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                <h4 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={28} />
                  Recommended Next Steps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.nextSteps.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            title: "Report Explainer",
            desc: "Upload lab results and get instant, plain-English explanations of every marker.",
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            link: "/report-explainer",
            img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
          },
          {
            title: "Doctor Network",
            desc: "Connect with verified specialists and book virtual or in-person consultations.",
            icon: Stethoscope,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            link: "/doctors",
            img: "https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=1000"
          },
          {
            title: "Natural Remedies",
            desc: "Explore science-backed traditional wisdom for holistic wellness and recovery.",
            icon: HeartPulse,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            link: "/remedies",
            img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000"
          },
          {
            title: "Medicine Tracker",
            desc: "Stay on top of your health with smart reminders and medication logs.",
            icon: Pill,
            color: "text-rose-600",
            bg: "bg-rose-50",
            link: "/medications",
            img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1000"
          },
          {
            title: "Health Calculators",
            desc: "Quickly calculate BMI, BMR, and other vital body metrics.",
            icon: Calculator,
            color: "text-blue-600",
            bg: "bg-blue-50",
            link: "/calculators",
            img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000"
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={feature.img} 
                alt={feature.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", feature.bg, feature.color)}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {feature.desc}
              </p>
              <motion.div whileHover={{ x: 5 }}>
                <Link to={feature.link} className="inline-flex items-center gap-2 font-black text-indigo-600 hover:text-indigo-700 transition-all">
                  Learn More
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Trust Section */}
      <section className="bg-white rounded-[3rem] p-12 md:p-20 border border-slate-100 shadow-sm text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
            Trusted by Patients & Providers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: "Active Users", value: "50k+" },
              { label: "Verified Doctors", value: "2.5k" },
              { label: "Reports Analyzed", value: "120k" },
              { label: "User Rating", value: "4.9/5" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <p className="text-4xl font-black text-indigo-600 mb-2">{stat.value}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
