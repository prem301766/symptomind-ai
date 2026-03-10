import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Zap,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Feedback() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rating, setRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'accuracy', label: 'Accuracy', icon: Zap },
    { id: 'usability', label: 'Usability', icon: Heart },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'other', label: 'Other', icon: MessageSquare },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !category || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Feedback submitted:', { rating, category, message, email });
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-indigo-100 border border-indigo-50"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">Thank You!</h1>
          <p className="text-slate-500 text-lg mb-10 leading-relaxed">
            Your feedback helps us improve SymptoMind AI for everyone. We truly appreciate your time and insights.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-8"
      >
        <ChevronLeft size={20} />
        {t('common.back')}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Help us <span className="text-indigo-600">improve</span>.
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Your experience matters. Whether it's a bug report, a feature request, or just a thought on how we can do better, we're listening.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600">
                <ThumbsUp size={20} />
              </div>
              <p className="text-sm font-bold text-indigo-900">We read every message</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="bg-white p-2 rounded-xl shadow-sm text-emerald-600">
                <Zap size={20} />
              </div>
              <p className="text-sm font-bold text-emerald-900">Fast improvements based on data</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-100 border border-slate-100 space-y-8">
            {/* Rating */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">How would you rate your experience?</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      rating === star 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                        : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <Star size={24} fill={rating === star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">What's this about?</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                      category === cat.id
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'
                    }`}
                  >
                    <cat.icon size={18} />
                    <span className="font-bold text-sm">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-medium"
              />
            </div>

            {/* Email (Optional) */}
            <div className="space-y-4">
              <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
              />
              <p className="text-[10px] text-slate-400 font-medium">We'll only use this if we need to follow up on your feedback.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Zap size={20} />
                  </motion.div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
