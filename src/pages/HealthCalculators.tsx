import { useState } from 'react';
import { Calculator, Scale, Ruler, Activity, Info, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function HealthCalculators() {
  const [activeTab, setActiveTab] = useState<'bmi' | 'bmr'>('bmi');
  
  // BMI State
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // BMR State
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bmrResult, setBmrResult] = useState<number | null>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    if (w && h) {
      const bmi = w / (h * h);
      setBmiResult(parseFloat(bmi.toFixed(1)));
    }
  };

  const calculateBMR = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    if (w && h && a) {
      // Mifflin-St Jeor Equation
      let bmr = (10 * w) + (6.25 * h) - (5 * a);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      setBmrResult(Math.round(bmr));
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Obese', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-cyan-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070" 
            alt="Health Metrics" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-cyan-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-16 md:px-12 md:py-20">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 text-cyan-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Calculator size={16} />
            Health Metrics
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Know Your Numbers
          </h1>
          <p className="text-lg text-cyan-100 leading-relaxed max-w-xl">
            Quickly calculate your BMI, BMR, and other vital body metrics to stay informed about your physical health.
          </p>
        </div>
      </div>

      <div className="flex gap-4 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveTab('bmi')}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
            activeTab === 'bmi' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Scale size={18} />
          BMI Calculator
        </button>
        <button
          onClick={() => setActiveTab('bmr')}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
            activeTab === 'bmr' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Activity size={18} />
          BMR Calculator
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <Calculator className="text-indigo-600" />
            Input Details
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Scale size={16} className="text-slate-400" />
                Weight (kg)
              </label>
              <input
                type="number"
                placeholder="e.g., 70"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={weight}
                onChange={e => setWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Ruler size={16} className="text-slate-400" />
                Height (cm)
              </label>
              <input
                type="number"
                placeholder="e.g., 175"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                value={height}
                onChange={e => setHeight(e.target.value)}
              />
            </div>

            {activeTab === 'bmr' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Age</label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setGender('male')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold border-2 transition-all",
                        gender === 'male' ? "bg-indigo-50 border-indigo-600 text-indigo-700" : "bg-white border-slate-100 text-slate-500"
                      )}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold border-2 transition-all",
                        gender === 'female' ? "bg-rose-50 border-rose-600 text-rose-700" : "bg-white border-slate-100 text-slate-500"
                      )}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={activeTab === 'bmi' ? calculateBMI : calculateBMR}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              <RefreshCcw size={20} />
              Calculate {activeTab.toUpperCase()}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <img 
              src={activeTab === 'bmi' 
                ? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1000"
                : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000"
              }
              alt={activeTab}
              className="absolute inset-0 w-full h-full object-cover opacity-5"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              {(activeTab === 'bmi' ? bmiResult : bmrResult) ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Your {activeTab.toUpperCase()}</p>
                  <h2 className="text-7xl font-black text-slate-900">
                    {activeTab === 'bmi' ? bmiResult : bmrResult}
                    <span className="text-xl text-slate-400 ml-2">{activeTab === 'bmi' ? '' : 'kcal/day'}</span>
                  </h2>
                  
                  {activeTab === 'bmi' && bmiResult && (
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm",
                      getBMICategory(bmiResult).bg,
                      getBMICategory(bmiResult).color
                    )}>
                      {getBMICategory(bmiResult).label}
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-slate-300">
                  <Calculator size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold">Enter your details to see results</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Info size={20} />
              What is {activeTab.toUpperCase()}?
            </h4>
            <p className="text-sm text-indigo-800 leading-relaxed">
              {activeTab === 'bmi' 
                ? "Body Mass Index (BMI) is a measure of body fat based on height and weight that applies to adult men and women."
                : "Basal Metabolic Rate (BMR) is the number of calories your body needs to accomplish its most basic (basal) life-sustaining functions."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
