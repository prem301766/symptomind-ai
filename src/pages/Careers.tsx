import { motion } from 'motion/react';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Users, Heart, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  const jobs = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / Bengaluru",
      type: "Full-time",
      description: "Help us build the next generation of medical diagnostic models using LLMs."
    },
    {
      title: "Medical Content Specialist",
      department: "Medical Affairs",
      location: "Mumbai",
      type: "Full-time",
      description: "Verify and curate medical knowledge to ensure our AI remains accurate and safe."
    },
    {
      title: "Product Designer (UX/UI)",
      department: "Design",
      location: "Remote",
      type: "Contract",
      description: "Design intuitive interfaces for patients and healthcare providers."
    },
    {
      title: "Data Scientist (Healthcare)",
      department: "Data",
      location: "Bengaluru",
      type: "Full-time",
      description: "Analyze health trends and improve our predictive symptom awareness engine."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070" 
            alt="Team working" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-indigo-900/80 to-indigo-900" />
        </div>
        
        <div className="relative px-8 py-20 md:px-16 md:py-32 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 px-4 py-1.5 rounded-full text-sm font-bold mb-8"
          >
            <Sparkles size={16} />
            We're Hiring!
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight"
          >
            Build the Future of <span className="text-indigo-400">Healthcare</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-indigo-100/80 mb-10 leading-relaxed"
          >
            Join a mission-driven team dedicated to making healthcare accessible, intelligent, and human-centric for everyone, everywhere.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Mission Driven",
            desc: "We put patient health and safety at the core of everything we build.",
            icon: Heart,
            color: "text-rose-600",
            bg: "bg-rose-50"
          },
          {
            title: "Innovation First",
            desc: "We push the boundaries of what AI can do in the medical field.",
            icon: Zap,
            color: "text-amber-600",
            bg: "bg-amber-50"
          },
          {
            title: "Inclusive Culture",
            desc: "We believe diverse perspectives lead to better healthcare solutions.",
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
          }
        ].map((value, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${value.bg} ${value.color}`}>
              <value.icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">{value.title}</h3>
            <p className="text-slate-500 leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </section>

      {/* Open Positions */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Open Positions
          </h2>
          <p className="text-lg text-slate-500">
            Find your next challenge and help us redefine medical awareness.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full">
                      {job.department}
                    </span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-6 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      Posted 2 days ago
                    </div>
                  </div>
                  <p className="text-slate-600 max-w-2xl">
                    {job.description}
                  </p>
                </div>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 group-hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 group-hover:shadow-indigo-100">
                  Apply Now
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Perks Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
              Why Join SymptoMind?
            </h2>
            <div className="space-y-8">
              {[
                "Comprehensive health insurance for you and your family",
                "Flexible working hours and remote-first policy",
                "Annual learning and development budget",
                "Equity options for all full-time employees",
                "Regular team offsites and wellness retreats"
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                  <p className="text-lg text-slate-300 font-medium">{perk}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000" 
              alt="Office Life" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
