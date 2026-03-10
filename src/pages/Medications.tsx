import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Pill, Plus, Trash2, Clock, Calendar, Bell, Loader2, Info, Mic, MicOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useVoiceToText } from '../hooks/useVoiceToText';

export default function Medications({ user }: { user: any }) {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '08:00'
  });
  const userId = user?.id || 'guest-123';

  const { isRecording: isRecordingName, toggleRecording: toggleRecordingName } = useVoiceToText((transcript) => {
    setFormData(prev => ({ ...prev, name: prev.name + (prev.name ? ' ' : '') + transcript }));
  });

  const { isRecording: isRecordingDosage, toggleRecording: toggleRecordingDosage } = useVoiceToText((transcript) => {
    setFormData(prev => ({ ...prev, dosage: prev.dosage + (prev.dosage ? ' ' : '') + transcript }));
  });

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    try {
      const res = await fetch(`/api/medications/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch meds');
      setMeds(await res.json());
    } catch (error) {
      console.error('Failed to fetch meds:', error);
      setMeds([]);
    }
  };

  const handleAddMed = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      setFormData({ name: '', dosage: '', frequency: 'Daily', time: '08:00' });
      setShowForm(false);
      fetchMeds();
    } catch (error) {
      console.error('Failed to add medication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/medications/${id}`, { method: 'DELETE' });
    fetchMeds();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-rose-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=2070" 
            alt="Medications" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900 via-rose-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-16 md:px-12 md:py-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-rose-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Pill size={16} />
              Medicine Reminder
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Stay on Track with Your Health
            </h1>
            <p className="text-lg text-rose-100 leading-relaxed">
              Track your daily medications, set reminders, and never miss a dose again.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-rose-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-rose-50 transition-all flex items-center gap-3 shadow-xl shadow-rose-900/40 shrink-0"
          >
            {showForm ? <Plus className="rotate-45" /> : <Plus />}
            Add Medication
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl"
          >
            <form onSubmit={handleAddMed} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Medicine Name</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder={isRecordingName ? "Listening..." : "e.g., Paracetamol"}
                    className={cn(
                      "w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      isRecordingName && "border-red-400 ring-2 ring-red-100"
                    )}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={toggleRecordingName}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                      isRecordingName ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-indigo-600"
                    )}
                  >
                    {isRecordingName ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Dosage</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder={isRecordingDosage ? "Listening..." : "e.g., 500mg"}
                    className={cn(
                      "w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all",
                      isRecordingDosage && "border-red-400 ring-2 ring-red-100"
                    )}
                    value={formData.dosage}
                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={toggleRecordingDosage}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all",
                      isRecordingDosage ? "text-red-500 animate-pulse" : "text-slate-400 hover:text-indigo-600"
                    )}
                  >
                    {isRecordingDosage ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Frequency</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.frequency}
                  onChange={e => setFormData({...formData, frequency: e.target.value})}
                >
                  <option>Daily</option>
                  <option>Twice Daily</option>
                  <option>Weekly</option>
                  <option>As Needed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Reminder Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Save Medication'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meds.length > 0 ? meds.map((med, i) => (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Pill size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{med.name}</h3>
                  <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{med.dosage}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(med.id)}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
                <Calendar className="text-slate-400" size={18} />
                <span className="text-sm font-bold text-slate-600">{med.frequency}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
                <Clock className="text-slate-400" size={18} />
                <span className="text-sm font-bold text-slate-600">{med.time}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                <Bell size={14} className="animate-bounce" />
                Reminder Active
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Added {new Date(med.created_at).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="md:col-span-2 bg-white p-12 rounded-[2.5rem] border border-slate-200 text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Pill size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Medications Tracked</h3>
            <p className="text-slate-500 mb-8">Add your first medicine to start receiving reminders.</p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex items-start gap-4">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Important Note</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            This tool is for tracking purposes only. Always follow the instructions provided by your doctor or pharmacist. If you experience severe side effects, seek medical attention immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
