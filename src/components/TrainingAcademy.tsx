import React, { useState } from 'react';
import { useHeartAlarm } from '../context/HeartAlarmContext';
import { CPRMetronomeVisualizer } from './CPRMetronomeVisualizer';
import { 
  GraduationCap, 
  Download, 
  CheckCircle2, 
  Play, 
  Award, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  RefreshCw, 
  Heart,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TrainingModule } from '../types';

export const TrainingAcademy: React.FC = () => {
  const {
    language,
    trainingModules,
    completeQuiz,
    downloadOfflineModule
  } = useHeartAlarm();

  const isTamil = language === 'ta';

  const [selectedModule, setSelectedModule] = useState<TrainingModule>(trainingModules[0]);
  const [quizState, setQuizState] = useState<{
    inProgress: boolean;
    currentQuestionIdx: number;
    selectedOptionId: string | null;
    isSubmitted: boolean;
    score: number;
    completed: boolean;
  }>({
    inProgress: false,
    currentQuestionIdx: 0,
    selectedOptionId: null,
    isSubmitted: false,
    score: 0,
    completed: false
  });

  const [showCertificate, setShowCertificate] = useState(false);

  const startQuiz = (module: TrainingModule) => {
    setSelectedModule(module);
    setQuizState({
      inProgress: true,
      currentQuestionIdx: 0,
      selectedOptionId: null,
      isSubmitted: false,
      score: 0,
      completed: false
    });
    setShowCertificate(false);
  };

  const handleOptionSelect = (optionId: string) => {
    if (quizState.isSubmitted) return;
    setQuizState(prev => ({ ...prev, selectedOptionId: optionId }));
  };

  const handleQuestionSubmit = () => {
    const currentQ = selectedModule.questions[quizState.currentQuestionIdx];
    const selectedOpt = currentQ.options.find(o => o.id === quizState.selectedOptionId);
    const isCorrect = !!selectedOpt?.isCorrect;

    const newScore = isCorrect ? quizState.score + 1 : quizState.score;

    setQuizState(prev => ({
      ...prev,
      isSubmitted: true,
      score: newScore
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestionIdx + 1 < selectedModule.questions.length) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIdx: prev.currentQuestionIdx + 1,
        selectedOptionId: null,
        isSubmitted: false
      }));
    } else {
      // Quiz Completed!
      const totalQuestions = selectedModule.questions.length;
      const finalPercentage = Math.round((quizState.score / totalQuestions) * 100);
      
      completeQuiz(selectedModule.id, finalPercentage);
      
      setQuizState(prev => ({
        ...prev,
        inProgress: false,
        completed: true
      }));

      // Fire confetti if high score
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Academy Header */}
      <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-600/30">
            <GraduationCap className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                OFFLINE VILLAGE ACADEMY
              </span>
              <span className="text-xs text-slate-400 font-mono">100% Caching Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isTamil ? 'கிராம இதய பாதுகாப்பு & CPR பயிற்சி மையம்' : 'Village Cardiac First-Aid Training'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isTamil 
                ? 'ASHA பணியாளர்கள், சுய உதவிக் குழுக்கள் & கிராம இளைஞர்களுக்கான எளிய தமிழ் வீடியோக்கள் மற்றும் வினாடி வினா' 
                : 'Interactive Tamil video modules, hands-only rhythm game & icon-based quizzes for rural responders.'}
            </p>
          </div>
        </div>

        {/* Certificate shortcut button */}
        <button
          onClick={() => setShowCertificate(true)}
          className="px-5 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-600/30 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all"
        >
          <Award className="w-4 h-4" />
          <span>{isTamil ? 'சான்றிதழைப் பார்க்க' : 'View Village Hero Certificate'}</span>
        </button>
      </div>

      {/* CPR METRONOME INTERACTIVE RHYTHM PRACTICE WIDGET */}
      <CPRMetronomeVisualizer compact={false} />

      {/* TRAINING MODULES LIST & QUIZ INTERACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: MODULES LIST (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Play className="w-4 h-4 text-amber-400" />
            <span>{isTamil ? 'பயிற்சி பாடங்கள் (Training Modules)' : 'Curriculum Modules'}</span>
          </h3>

          <div className="space-y-3">
            {trainingModules.map((mod) => {
              const isSelected = selectedModule.id === mod.id;
              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    setSelectedModule(mod);
                    setQuizState(prev => ({ ...prev, inProgress: false, completed: false }));
                  }}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-950/40 via-[#140a0a] to-[#0A0505] border-amber-500/50 shadow-xl ring-1 ring-amber-500/30'
                      : 'bg-black/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={mod.videoThumbnail}
                      alt={mod.titleEn}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-white/10"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono text-amber-400 font-bold">{mod.videoDuration}</span>
                        {mod.completed && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{mod.score}% Score</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-sm line-clamp-2">
                        {isTamil ? mod.titleTa : mod.titleEn}
                      </h4>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {mod.isDownloadedOffline ? (isTamil ? 'ஆஃப்லைனில் உள்ளது ✓' : 'Cached Offline ✓') : 'Ready to Cache'}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startQuiz(mod);
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-600/20 cursor-pointer transition-all"
                        >
                          {isTamil ? 'வினாடி வினா' : 'Take Quiz'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: ACTIVE MODULE DETAILS OR QUIZ ENGINE (7 cols) */}
        <div className="lg:col-span-7">
          
          {/* QUIZ IN PROGRESS VIEW */}
          {quizState.inProgress ? (
            <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isTamil ? 'வினாடி வினா பரிசோதனை' : 'Offline Knowledge Check'}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {isTamil ? selectedModule.titleTa : selectedModule.titleEn}
                  </h3>
                </div>

                <span className="text-xs font-mono font-bold text-slate-300 px-3 py-1 bg-black/60 rounded-xl border border-white/10">
                  Q {quizState.currentQuestionIdx + 1} / {selectedModule.questions.length}
                </span>
              </div>

              {/* Current Question */}
              {(() => {
                const q = selectedModule.questions[quizState.currentQuestionIdx];
                return (
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white mb-4">
                      {isTamil ? q.questionTa : q.questionEn}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2.5 mb-6">
                      {q.options.map((opt) => {
                        const isSelected = quizState.selectedOptionId === opt.id;
                        let optionStyle = 'bg-black/60 border-white/10 text-slate-300 hover:border-white/20';

                        if (quizState.isSubmitted) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-amber-950/40 border-amber-500 text-white font-bold';
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => handleOptionSelect(opt.id)}
                            className={`p-4 rounded-2xl border cursor-pointer text-xs sm:text-sm transition-all ${optionStyle}`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{isTamil ? opt.textTa : opt.textEn}</span>
                              {quizState.isSubmitted && opt.isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {quizState.isSubmitted && (
                      <div className="p-4 bg-black/60 rounded-2xl border border-white/10 mb-6 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-amber-400">{isTamil ? 'விளக்கம்:' : 'Explanation:'} </strong>
                        {isTamil ? q.explanationTa : q.explanationEn}
                      </div>
                    )}

                    {/* Quiz Navigation Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button
                        onClick={() => setQuizState(prev => ({ ...prev, inProgress: false }))}
                        className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border border-white/10 text-xs font-semibold rounded-xl"
                      >
                        {isTamil ? 'வெளியேறு' : 'Exit Quiz'}
                      </button>

                      {!quizState.isSubmitted ? (
                        <button
                          disabled={!quizState.selectedOptionId}
                          onClick={handleQuestionSubmit}
                          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
                        >
                          {isTamil ? 'விடையை சமர்ப்பி' : 'Submit Answer'}
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                        >
                          <span>{isTamil ? 'அடுத்த கேள்வி' : 'Next Question'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

            </div>
          ) : (
            
            /* ACTIVE MODULE OVERVIEW CARD */
            <div className="bg-gradient-to-b from-[#140a0a] to-[#0A0505] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isTamil ? 'பாட விவரங்கள்' : 'Selected Course Overview'}
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">
                    {isTamil ? selectedModule.titleTa : selectedModule.titleEn}
                  </h3>
                </div>

                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold font-mono">
                  {selectedModule.videoDuration}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                {isTamil ? selectedModule.descriptionTa : selectedModule.descriptionEn}
              </p>

              {/* Key Clinical Takeaways */}
              <div className="bg-black/60 p-5 rounded-2xl border border-white/10 mb-6">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isTamil ? 'முக்கிய உயிர் காக்கும் குறிப்புகள்' : 'Key Clinical Protocols'}</span>
                </h4>

                <div className="space-y-2">
                  {(isTamil ? selectedModule.keyTakeawaysTa : selectedModule.keyTakeawaysEn).map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">✓</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions: Start Quiz & Offline Download */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => startQuiz(selectedModule)}
                  className="w-full sm:w-auto flex-1 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isTamil ? 'வினாடி வினா தொடங்கு (Start Quiz)' : 'START ICON QUIZ'}</span>
                </button>

                <button
                  onClick={() => downloadOfflineModule(selectedModule.id)}
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/10 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>{isTamil ? 'ஆஃப்லைன் சேமிப்பு' : 'Cache Offline (4.2 MB)'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* VILLAGE HERO CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gradient-to-b from-[#180d0d] via-[#100808] to-[#0A0505] border-2 border-amber-500/50 rounded-3xl p-8 max-w-xl w-full shadow-2xl text-center relative overflow-hidden">
            
            {/* Certificate Header */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mx-auto mb-4 text-slate-950 shadow-xl shadow-amber-500/30">
              <Award className="w-10 h-10" />
            </div>

            <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
              GOVERNMENT OF TAMIL NADU • DPH PILOT
            </span>

            <h3 className="text-2xl font-black text-white mt-1">
              {isTamil ? 'கிராம இதய பாதுகாப்பு சான்றிதழ்' : 'Village Cardiac First Responder Certificate'}
            </h3>

            <p className="text-xs text-slate-400 mt-2">
              {isTamil 
                ? 'கீழ்வேளூர் கிராமத்தில் கைமுறை CPR மற்றும் ஆஸ்பிரின் முதலுதவி பயிற்சியை வெற்றிகரமாக முடித்தமைக்காக வழங்கப்படுகிறது.' 
                : 'Presented for mastering hands-only CPR, 110 BPM compression rhythm, and rural cardiac emergency triage.'}
            </p>

            <div className="my-6 p-4 bg-black/60 rounded-2xl border border-white/10 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient:</span>
                <span className="font-bold text-white">Kavitha R. (ASHA Worker)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Village & District:</span>
                <span className="font-bold text-white">Kilvelur, Nagapattinam</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CPR Score:</span>
                <span className="font-bold text-emerald-400 font-mono">100% Certified</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 cursor-pointer"
            >
              {isTamil ? 'மூடு (Close)' : 'Close Certificate'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
