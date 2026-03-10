import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Activity, 
  FileText, 
  LayoutDashboard, 
  Users, 
  Leaf, 
  Phone, 
  Play,
  Menu, 
  X, 
  Stethoscope,
  Pill,
  Calculator,
  Siren,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  LogIn,
  LogOut,
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import Home from './pages/Home';
import ReportExplainer from './pages/ReportExplainer';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Booking from './pages/Booking';
import Consultation from './pages/Consultation';
import Remedies from './pages/Remedies';
import RegisterDoctor from './pages/RegisterDoctor';
import Medications from './pages/Medications';
import HealthCalculators from './pages/HealthCalculators';
import Login from './pages/Login';
import AICounsel from './pages/AICounsel';
import Careers from './pages/Careers';
import EmergencyAmbulance from './pages/EmergencyAmbulance';
import EmergencyTutorials from './pages/EmergencyTutorials';
import Feedback from './pages/Feedback';
import AIChatbot from './components/AIChatbot';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: t('common.home'), path: '/', icon: Activity, color: 'text-indigo-600' },
    { name: t('common.reportExplainer'), path: '/report-explainer', icon: FileText, color: 'text-amber-600' },
    { name: t('common.dashboard'), path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
    { name: t('common.doctors'), path: '/doctors', icon: Users, color: 'text-violet-600' },
    { name: t('common.remedies'), path: '/remedies', icon: Leaf, color: 'text-emerald-600' },
    { name: t('common.medications'), path: '/medications', icon: Pill, color: 'text-rose-600' },
    { name: t('common.calculators'), path: '/calculators', icon: Calculator, color: 'text-cyan-600' },
    { name: t('common.tutorials'), path: '/emergency-tutorials', icon: Play, color: 'text-orange-600' },
    { name: t('common.emergency'), path: '/emergency', icon: Siren, color: 'text-red-600' },
    { name: t('common.feedback'), path: '/feedback', icon: MessageSquare, color: 'text-indigo-600' },
  ];

  return (
    <nav className="bg-gradient-to-b from-indigo-50/90 to-white/90 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
      {/* SOS Header */}
      <Link 
        to="/emergency"
        className="bg-red-600 text-white py-1.5 px-4 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b border-red-700/20 hover:bg-red-700 transition-colors"
      >
        <AlertCircle size={14} />
        {t('common.emergency')}: CLICK HERE TO FIND NEARBY AMBULANCE / SOS
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-200">
                <Stethoscope className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SymptoMind<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"
                      : "text-slate-600 hover:bg-indigo-100/50 hover:text-indigo-600"
                  )}
                >
                  <item.icon size={18} className={cn(location.pathname === item.path ? "text-white" : item.color)} />
                  {item.name}
                </Link>
              </motion.div>
            ))}
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{user.name}</span>
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="flex items-center gap-1.5 text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <LogOut size={16} />
                  {t('navbar.logout')}
                </motion.button>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <LogIn size={18} />
                  {t('navbar.login')}
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold transition-all",
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"
                        : "text-slate-600 hover:bg-indigo-100/50 hover:text-indigo-600"
                    )}
                  >
                    <item.icon size={20} className={cn(location.pathname === item.path ? "text-white" : item.color)} />
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              {user ? (
                <div className="px-3 py-4 border-t border-slate-100 bg-slate-50/50 rounded-xl mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                      <User size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-base font-bold"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </motion.button>
                </div>
              ) : (
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full mt-4 bg-indigo-600 text-white px-4 py-3.5 rounded-xl text-base font-bold text-center shadow-lg shadow-indigo-100"
                  >
                    <LogIn size={20} />
                    Sign In
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/ai-counsel" element={<AICounsel user={user} />} />
            <Route path="/report-explainer" element={<ReportExplainer user={user} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/booking/:id" element={<Booking user={user} />} />
            <Route path="/consultation/:id" element={<Consultation />} />
            <Route path="/remedies" element={<Remedies />} />
            <Route path="/register-doctor" element={<RegisterDoctor />} />
            <Route path="/medications" element={<Medications user={user} />} />
            <Route path="/calculators" element={<HealthCalculators />} />
            <Route path="/emergency" element={<EmergencyAmbulance />} />
            <Route path="/emergency-tutorials" element={<EmergencyTutorials />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/careers" element={<Careers />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-slate-200 pt-20 pb-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Stethoscope className="text-white" size={20} />
                  </div>
                  <span className="text-xl font-bold text-slate-900 tracking-tight">SymptoMind<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI</span></span>
                </Link>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Empowering patients with intelligent health awareness and seamless access to professional care.
                </p>
                <div className="flex items-center gap-4">
                  {[
                    { icon: Twitter, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Instagram, href: "#" },
                    { icon: Facebook, href: "#" }
                  ].map((social, i) => (
                    <motion.a 
                      key={i} 
                      href={social.href} 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    >
                      <social.icon size={18} />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">Platform</h4>
                <ul className="space-y-4">
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Symptom Checker</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/report-explainer" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Report Explainer</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/doctors" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Find Doctors</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/remedies" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Natural Remedies</Link></motion.div></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">Company</h4>
                <ul className="space-y-4">
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/careers" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Careers</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/feedback" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">{t('common.feedback')}</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><Link to="/register-doctor" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">For Doctors</Link></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">About Us</a></motion.div></li>
                  <li><motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm font-bold transition-colors">Contact</a></motion.div></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 font-black uppercase tracking-widest text-xs mb-6">Contact Us</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Mail size={18} className="text-indigo-600 shrink-0" />
                    <span className="text-slate-500 text-sm font-medium">support@symptomind.ai</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-indigo-600 shrink-0" />
                    <span className="text-slate-500 text-sm font-medium">+91 800 123 4567</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-indigo-600 shrink-0" />
                    <span className="text-slate-500 text-sm font-medium">123 Health Tech Park, Bengaluru, KA 560001</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-xs font-medium">
                © 2026 SymptoMind AI. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors">Terms of Service</a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors">Cookie Policy</a>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-slate-300 text-[10px] font-medium max-w-2xl mx-auto uppercase tracking-widest">
                Disclaimer: SymptoMind AI is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          </div>
        </footer>
        <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-4">
          <motion.div
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link 
              to="/feedback"
              className="bg-white text-indigo-600 p-4 rounded-2xl shadow-2xl border border-indigo-100 flex items-center justify-center hover:bg-indigo-50 transition-all group"
              title="Give Feedback"
            >
              <MessageSquare size={24} />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-bold whitespace-nowrap">
                {t('common.feedback')}
              </span>
            </Link>
          </motion.div>
        </div>
        <AIChatbot user={user} />
      </div>
    </Router>
  );
}
