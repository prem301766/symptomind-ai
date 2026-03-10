import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, BadgeCheck, Shield, FileCheck, Loader2, Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useVoiceToText } from '../hooks/useVoiceToText';

export default function RegisterDoctor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    license: '',
    bio: '',
    email: ''
  });

  const { isRecording: isRecordingBio, toggleRecording: toggleRecordingBio } = useVoiceToText((transcript) => {
    setFormData(prev => ({ ...prev, bio: prev.bio + (prev.bio ? ' ' : '') + transcript }));
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, this would send to an admin approval queue
    setTimeout(() => {
      setLoading(false);
      alert('Registration submitted for verification. We will contact you soon.');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
          <UserPlus size={16} />
          Provider Onboarding
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Join our Provider Network
        </h1>
        <p className="text-lg text-slate-600">
          Verified medical professionals can join SymptoMind AI to provide virtual consultations and reach more patients.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name (with Title)</label>
              <input
                required
                type="text"
                placeholder="e.g., Dr. Jane Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Specialty</label>
              <input
                required
                type="text"
                placeholder="e.g., Neurologist"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={formData.specialty}
                onChange={e => setFormData({...formData, specialty: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Medical License Number</label>
            <input
              required
              type="text"
              placeholder="e.g., MC-998877"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              value={formData.license}
              onChange={e => setFormData({...formData, license: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Professional Bio</label>
            <div className="relative">
              <textarea
                required
                rows={4}
                placeholder={isRecordingBio ? "Listening..." : "Tell patients about your experience and expertise..."}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none",
                  isRecordingBio && "border-red-400 ring-2 ring-red-100"
                )}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
              />
              <button
                type="button"
                onClick={toggleRecordingBio}
                className={cn(
                  "absolute right-3 bottom-3 p-2 rounded-xl transition-all shadow-sm",
                  isRecordingBio ? "bg-red-500 text-white animate-pulse" : "bg-white text-slate-400 hover:text-indigo-600 border border-slate-200"
                )}
                title={isRecordingBio ? "Stop recording" : "Voice input"}
              >
                {isRecordingBio ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <Shield className="text-indigo-600 shrink-0" size={20} />
              <p className="text-xs text-indigo-800 leading-relaxed">
                By submitting this form, you agree to our provider verification process. We will verify your medical license with the respective medical council.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <BadgeCheck size={24} />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: BadgeCheck, title: 'Verified Badge', desc: 'Get a blue checkmark on your profile.' },
          { icon: Shield, title: 'Secure Platform', desc: 'End-to-end encrypted consultations.' },
          { icon: FileCheck, title: 'Easy EMR', desc: 'Manage patient records effortlessly.' },
        ].map((feat, i) => (
          <div key={i} className="text-center p-4">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-sm">
              <feat.icon size={24} />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{feat.title}</h4>
            <p className="text-xs text-slate-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
