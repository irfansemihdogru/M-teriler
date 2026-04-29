/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, ChevronLeft, ChevronRight, User, Mail, CheckCircle2, AlertCircle, RefreshCcw, Send, Calendar } from 'lucide-react';

interface Question {
  q: string;
  opts: string[];
  ans: number;
}

const QUESTIONS: Question[] = [
  {
    q: "Kaan Sekban hangi şehirde doğmuştur?",
    opts: ["İstanbul", "Ankara", "İzmir", "Bursa"],
    ans: 0
  },
  {
    q: "Lisans eğitimini hangi üniversitede tamamlamıştır?",
    opts: ["Boğaziçi Üniversitesi", "Yıldız Teknik Üniversitesi", "İstanbul Üniversitesi", "Marmara Üniversitesi"],
    ans: 1
  },
  {
    q: "Komedyenliğe geçmeden önce hangi bankada yaklaşık 10 yıl çalışmıştır?",
    opts: ["İş Bankası", "Yapı Kredi", "Garanti Bankası", "Akbank"],
    ans: 2
  },
  {
    q: "2017'de yayımlanan ve çok satanlar listesine giren kitabının adı nedir?",
    opts: ["Plaza Günlükleri", "Tebrikler Kovuldunuz!", "Beyaz Yaka", "Saçmalar"],
    ans: 1
  },
  {
    q: "Evinde çektiği ve geniş kitlelere ulaştığı canlı talk show'un adı nedir?",
    opts: ["Ofis Hayatı", "Kaan Sekban Saçmalar", "Plaza Komedisi", "Beyaz Yaka Show"],
    ans: 1
  }
];

type Screen = 'welcome' | 'form' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [userData, setUserData] = useState({ name: '', surname: '', email: '' });
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let timer: any;
    if (screen === 'quiz' && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft, isFinished]);

  const handleStartQuiz = () => {
    setStartTime(Date.now());
    setScreen('quiz');
  };

  const handleFinish = () => {
    setEndTime(Date.now());
    setIsFinished(true);
    setScreen('result');
  };

  const getScore = () => {
    return answers.reduce((score, ans, idx) => {
      return ans === QUESTIONS[idx].ans ? score + 1 : score;
    }, 0);
  };

  const getTimeTaken = () => {
    return Math.floor((endTime - startTime) / 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-black/10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold italic">A</div>
          <span className="font-bold tracking-tight text-xl">ARCA <span className="font-light text-gray-500">OTOMOTİV</span></span>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <WelcomeScreen onNext={() => setScreen('form')} />
          )}

          {screen === 'form' && (
            <FormScreen 
              userData={userData} 
              setUserData={setUserData} 
              onNext={handleStartQuiz} 
            />
          )}

          {screen === 'quiz' && (
            <QuizScreen 
              currentQ={currentQ} 
              setCurrentQ={setCurrentQ}
              answers={answers}
              setAnswers={setAnswers}
              onFinish={handleFinish}
              timeLeft={timeLeft}
            />
          )}

          {screen === 'result' && (
            <ResultScreen 
              userData={userData}
              onRestart={() => {
                setScreen('welcome');
                setCurrentQ(0);
                setAnswers(new Array(QUESTIONS.length).fill(null));
                setTimeLeft(60);
                setIsFinished(false);
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100"
    >
      <div className="w-16 h-16 bg-black/5 rounded-2xl flex items-center justify-center mb-6 text-black">
        <Trophy size={32} />
      </div>
      <h1 className="text-3xl font-extrabold mb-4 tracking-tight leading-none">
        Kaan Sekban Bilgi Yarışması
      </h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Arca Otomotiv çalışanlarına özel bu yarışmada, Kaan Sekban hakkındaki bilgini test et!
      </p>

      <div className="space-y-4 mb-10">
        <div className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Algoritma</p>
            <p className="text-xs text-gray-500">Yüksek Puan + Hızlı Bitirme + Erken Yanıt = Zirve!</p>
          </div>
        </div>
        <div className="flex gap-4 items-start bg-indigo-50 p-4 rounded-2xl">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Trophy size={20} className="text-indigo-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Ödül</p>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">KAAN SEKBAN STAND-UP BİLETİ</p>
          </div>
        </div>
        <div className="flex gap-4 items-start bg-amber-50 p-4 rounded-2xl">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <Calendar size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Son Katılım</p>
            <p className="text-xs text-gray-500">5 Mayıs Salı günü saat 21:00'e kadar vaktiniz var!</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Hadi Başlayalım <ChevronRight size={20} />
      </button>
    </motion.div>
  );
}

function FormScreen({ userData, setUserData, onNext }: { userData: any, setUserData: any, onNext: () => void }) {
  const [error, setError] = useState('');

  const isValid = () => {
    if (!userData.name || !userData.surname || !userData.email) return false;
    return userData.email.toLowerCase().endsWith('@arcaotomotiv.com.tr');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userData.email.toLowerCase().endsWith('@arcaotomotiv.com.tr')) {
      setError('Lütfen kurumsal mail adresinizi kullanın (@arcaotomotiv.com.tr)');
      return;
    }
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100"
    >
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Kişisel Bilgiler</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">İsim</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              required
              type="text"
              placeholder="Adınız"
              value={userData.name}
              onChange={(e) => setUserData({...userData, name: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Soyisim</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              required
              type="text"
              placeholder="Soyadınız"
              value={userData.surname}
              onChange={(e) => setUserData({...userData, surname: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Kurumsal E-Posta</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              required
              type="email"
              placeholder="eposta@arcaotomotiv.com.tr"
              value={userData.email}
              onChange={(e) => {
                setUserData({...userData, email: e.target.value});
                setError('');
              }}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
        </div>

        <button
          disabled={!isValid()}
          type="submit"
          className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
        >
          Yarışmayı Başlat <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}

function QuizScreen({ currentQ, setCurrentQ, answers, setAnswers, onFinish, timeLeft }: { 
  currentQ: number, 
  setCurrentQ: (n: number) => void, 
  answers: (number | null)[], 
  setAnswers: any, 
  onFinish: () => void,
  timeLeft: number
}) {
  const currentQuestion = QUESTIONS[currentQ];

  const handleSelect = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
    
    // Auto advance with small delay for visual feedback
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        onFinish();
      }
    }, 300);
  };

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <span className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 w-fit">
              Soru {currentQ + 1} / {QUESTIONS.length}
            </span>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
              <motion.div 
                className="h-full bg-black" 
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-300 shadow-md ${
            timeLeft <= 15 ? 'bg-red-50 border-red-500 text-red-600 animate-heartbeat' : 
            timeLeft <= 30 ? 'bg-amber-50 border-amber-500 text-amber-600' : 
            'bg-white border-black text-black'
          }`}>
            <span className="text-[8px] font-black uppercase opacity-60">SÜRE</span>
            <span className="text-2xl font-black font-mono leading-none">{timeLeft}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-tight mb-8">
          {currentQuestion.q}
        </h3>

        <div className="space-y-3">
          {currentQuestion.opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                answers[currentQ] === idx 
                ? 'border-black bg-black text-white' 
                : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}
            >
              <span className="font-medium">{opt}</span>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                answers[currentQ] === idx ? 'border-white bg-white/20' : 'border-gray-200 group-hover:border-gray-300'
              }`}>
                {answers[currentQ] === idx && <CheckCircle2 size={14} />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ResultScreen({ userData, onRestart }: { userData: any, onRestart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100 text-center"
    >
      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} />
      </div>
      
      <h2 className="text-3xl font-extrabold mb-1">Tebrikler {userData.name}!</h2>
      <p className="text-gray-400 font-medium mb-8 uppercase tracking-widest text-xs">Yarışmayı Tamamladın</p>

      <div className="bg-black/5 p-8 rounded-3xl mb-10 text-center space-y-3">
        <p className="text-lg font-bold leading-tight">Katılımın için teşekkür ederiz!</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Yanıtların ve bitirme süren sistemimize kaydedildi. 
          Değerlendirme sonucunda kazananlar belirlendiğinde sizinle iletişime geçeceğiz.
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <RefreshCcw size={18} /> Ana Sayfaya Dön
      </button>
    </motion.div>
  );
}
