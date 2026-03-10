import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Users, 
  Settings,
  Maximize,
  Stethoscope
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Consultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(res => res.json())
      .then(data => setDoctor(data));
  }, [id]);

  useEffect(() => {
    if (isJoined && !isVideoOff) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Error accessing media devices:", err));
    }
  }, [isJoined, isVideoOff]);

  const handleEndCall = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    navigate('/dashboard');
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 bg-slate-900 z-[60] flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Stethoscope className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">{doctor.name}</h3>
            <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Consultation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Users size={14} />
            2 Participants
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative p-4 flex items-center justify-center overflow-hidden">
        {!isJoined ? (
          <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 text-center shadow-2xl">
            <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video size={40} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Ready to join?</h2>
            <p className="text-slate-400 mb-8">The doctor is waiting for you in the virtual room.</p>
            <button 
              onClick={() => setIsJoined(true)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20"
            >
              Join Consultation Now
            </button>
          </div>
        ) : (
          <div className="w-full h-full relative rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl">
            {/* Doctor's View (Simulated) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 text-4xl font-black">
                  {doctor.name[4]}
                </div>
                <p className="text-white font-bold text-xl">{doctor.name}</p>
                <p className="text-slate-400 text-sm">Connecting to secure stream...</p>
              </div>
            </div>

            {/* Patient's View (Self) */}
            <div className="absolute bottom-6 right-6 w-48 h-32 md:w-64 md:h-44 bg-slate-900 rounded-2xl border-2 border-slate-700 shadow-2xl overflow-hidden">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                  <VideoOff size={32} />
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover mirror"
                />
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                You (Patient)
              </div>
            </div>

            {/* Overlay Controls */}
            <div className="absolute top-6 right-6">
              <button className="p-2 bg-black/30 backdrop-blur-md text-white rounded-lg hover:bg-black/50 transition-all">
                <Maximize size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 flex items-center justify-center gap-4 md:gap-8">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg",
            isMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          )}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        
        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg",
            isVideoOff ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          )}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        <button className="w-14 h-14 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-all shadow-lg">
          <MessageSquare size={24} />
        </button>

        <button 
          onClick={handleEndCall}
          className="w-20 h-14 rounded-3xl bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-all shadow-xl shadow-rose-900/20"
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
}
