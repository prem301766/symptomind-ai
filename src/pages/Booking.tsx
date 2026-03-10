import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, Loader2, Star, BadgeCheck } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Booking({ user }: { user: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => setDoctor(data));
  }, [id]);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const handleBook = async () => {
    if (!selectedTime) return;
    setLoading(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest-123',
          doctorId: id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime
        })
      });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Directory
      </button>

      {success ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Appointment Scheduled!</h2>
          <p className="text-slate-500 mb-8">Your session with {doctor.name} has been confirmed.</p>
          <p className="text-sm font-bold text-indigo-600 animate-pulse">Redirecting to dashboard...</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Star size={40} className="fill-indigo-600" />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                  <BadgeCheck className="text-indigo-600" size={18} />
                </div>
                <p className="text-indigo-600 font-bold text-sm uppercase tracking-wider mb-4">{doctor.specialty}</p>
                <div className="flex items-center justify-center gap-4 text-sm font-bold text-slate-500">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    {doctor.rating}
                  </div>
                  <span>•</span>
                  <span>{doctor.distance}</span>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-200">
              <h4 className="font-bold mb-2">Booking Info</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                Please arrive 10 minutes before your scheduled time. Virtual consultation link will be sent via email.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CalendarIcon className="text-indigo-600" />
                Select Date
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {dates.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[80px] py-4 rounded-2xl border-2 transition-all",
                      format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                    )}
                  >
                    <span className="text-xs font-bold uppercase mb-1">{format(date, 'EEE')}</span>
                    <span className="text-xl font-black">{format(date, 'd')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="text-indigo-600" />
                Select Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "py-3 rounded-xl border-2 font-bold text-sm transition-all",
                      selectedTime === time
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={loading || !selectedTime}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
