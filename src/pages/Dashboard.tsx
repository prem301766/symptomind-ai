import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Activity, 
  FileText, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Stethoscope,
  Pill,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const wellnessData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 78 },
  { name: 'Sat', score: 90 },
  { name: 'Sun', score: 82 },
];

export default function Dashboard({ user }: { user: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [symptomChecks, setSymptomChecks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [meds, setMeds] = useState<any[]>([]);
  const userId = user?.id || 'guest-123';

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const [apptsRes, checksRes, reportsRes, medsRes] = await Promise.all([
          fetch(`/api/appointments/${userId}`),
          fetch(`/api/symptom-checks/${userId}`),
          fetch(`/api/reports/${userId}`),
          fetch(`/api/medications/${userId}`)
        ]);
        setAppointments(await apptsRes.json());
        setSymptomChecks(await checksRes.json());
        setReports(await reportsRes.json());
        setMeds(await medsRes.json());
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Dashboard</h1>
          <p className="text-slate-500">Welcome back, Guest Patient. Here's your health summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">AI Doctor Brief Ready</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Upcoming Appts', value: appointments.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Symptom Checks', value: symptomChecks.length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Medical Reports', value: reports.length, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Health Score', value: '82%', icon: Stethoscope, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'up' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  +4%
                </div>
              )}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wellness Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Wellness Trend</h3>
            <select className="bg-slate-50 border-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={wellnessData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 700, color: '#4f46e5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Appointments</h3>
            <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {appointments.length > 0 ? appointments.map((appt, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                  <Calendar size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{appt.doctor_name}</p>
                  <p className="text-xs text-slate-500 font-medium">{appt.date} • {appt.time}</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm font-medium">No upcoming appointments</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-md">
            Book New Appointment
          </button>
        </div>
      </div>

      {/* Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Symptom Checks</h3>
          <div className="space-y-4">
            {symptomChecks.map((check, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    check.urgency === 'Emergency' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {check.urgency}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(check.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">{check.symptoms}</p>
                <p className="text-xs text-slate-500 line-clamp-2">{check.analysis}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h3>
          <div className="space-y-4">
            {reports.map((report, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{report.report_name}</p>
                  <p className="text-xs text-slate-500">{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
                <button className="text-indigo-600 text-xs font-bold hover:underline">View Analysis</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medication Summary */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900">Active Medications</h3>
          <Link to="/medications" className="text-indigo-600 text-sm font-bold hover:underline">Manage Meds</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meds.length > 0 ? meds.slice(0, 3).map((med, i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-100">
                <Pill size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{med.name}</p>
                <p className="text-xs text-slate-500 font-medium">{med.dosage} • {med.time}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-4">
              <p className="text-slate-400 text-sm font-medium">No active medications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
