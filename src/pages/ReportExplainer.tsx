import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { FileText, Upload, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function ReportExplainer({ user }: { user: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    setLoading(true);
    try {
      const base64Data = preview.split(',')[1];
      const mimeType = file?.type || 'image/png';
      const analysis = await geminiService.explainReport(base64Data, mimeType);
      setResult(analysis);

      // Save to DB
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest-123',
          reportName: file?.name || 'Medical Report',
          analysis: JSON.stringify(analysis)
        })
      });
    } catch (error) {
      console.error('Report analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070" 
            alt="Medical Reports" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent" />
        </div>
        
        <div className="relative px-8 py-16 md:px-12 md:py-20">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-indigo-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <FileText size={16} />
            AI Report Explainer
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Understand Your Health Reports
          </h1>
          <p className="text-lg text-indigo-100 leading-relaxed max-w-xl">
            Upload your lab results or medical reports. We'll translate the complex medical jargon into plain English using advanced AI.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 shadow-sm text-center">
          {preview ? (
            <div className="space-y-6">
              <img src={preview} alt="Report Preview" className="max-h-96 mx-auto rounded-xl shadow-lg border border-slate-200" />
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Remove
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Explain My Report
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer py-12 group"
            >
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Medical Report</h3>
              <p className="text-slate-500 mb-8">Supports JPG, PNG, or PDF images of reports</p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">
                Select File
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Summary of Findings</h2>
            </div>
            <p className="text-lg text-slate-700 leading-relaxed">
              {result.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <h3 className="text-xl font-bold text-slate-900 px-2">Lab Markers Analysis</h3>
            {result.markers.map((marker: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{marker.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-bold uppercase",
                      marker.status === 'Normal' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {marker.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{marker.explanation}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">{marker.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
            <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-600" />
              Recommendations
            </h3>
            <ul className="space-y-4">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-emerald-800">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full py-4 rounded-2xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-white transition-all"
          >
            Analyze Another Report
          </button>
        </motion.div>
      )}
    </div>
  );
}
