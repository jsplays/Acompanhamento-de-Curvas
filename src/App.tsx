/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Heart, 
  HelpCircle, 
  Info, 
  Layers, 
  LineChart, 
  Lock, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Plus, 
  RefreshCw, 
  Scale, 
  Settings, 
  Smile, 
  Trash2, 
  TrendingUp, 
  User, 
  Volume2, 
  X,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Check
} from 'lucide-react';

export type TrackingMode = 'measures' | 'habits' | 'none';

export interface RecordItem {
  id: string;
  date: string;
  waist?: number; // cm
  hip?: number; // cm
  thigh?: number; // cm
  thighSide?: 'direita' | 'esquerda';
  notes?: string;
  workoutHabits?: string;
  feeling?: 'Tranquilo(a)' | 'Indiferente' | 'Desconfortável' | 'Prefiro não responder';
}

export interface HabitItem {
  id: string;
  date: string;
  activities: string;
  consistency: boolean;
  energy: 'Baixa' | 'Moderada' | 'Boa' | 'Excelente';
  notes?: string;
}

export default function App() {
  // Navigation & State
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [trackingMode, setTrackingMode] = useState<TrackingMode | null>(null);
  const [hasAcceptedSafety, setHasAcceptedSafety] = useState<boolean>(false);
  const [showSafetyModal, setShowSafetyModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home'); // home, record, evolution, habits, guidance, settings
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Stored Data
  const [records, setRecords] = useState<RecordItem[]>(() => {
    const saved = localStorage.getItem('curves_records');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Initial sample neutral record
    return [
      {
        id: '1',
        date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
        waist: 78,
        hip: 102,
        thigh: 56,
        thighSide: 'direita',
        notes: 'Início do registro quinzenal de acompanhamento.',
        workoutHabits: 'Caminhada 3x na semana e alongamento.',
        feeling: 'Tranquilo(a)'
      }
    ];
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('curves_habits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '1',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        activities: 'Musculação leve e mobilidade',
        consistency: true,
        energy: 'Boa',
        notes: 'Boa disposição, treino fluido.'
      }
    ];
  });

  // Settings & Reminders
  const [reminderFreq, setReminderFreq] = useState<string>('2weeks'); // 1week, 2weeks, 4weeks, none
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Record Form State
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newWaist, setNewWaist] = useState<string>('');
  const [newHip, setNewHip] = useState<string>('');
  const [newThigh, setNewThigh] = useState<string>('');
  const [thighSide, setThighSide] = useState<'direita' | 'esquerda'>('direita');
  const [newNotes, setNewNotes] = useState<string>('');
  const [newWorkoutHabits, setNewWorkoutHabits] = useState<string>('');
  const [newFeeling, setNewFeeling] = useState<RecordItem['feeling']>('Tranquilo(a)');

  // New Habit Form State
  const [habitDate, setHabitDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [habitActivities, setHabitActivities] = useState<string>('');
  const [habitConsistency, setHabitConsistency] = useState<boolean>(true);
  const [habitEnergy, setHabitEnergy] = useState<HabitItem['energy']>('Boa');
  const [habitNotes, setHabitNotes] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('curves_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('curves_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    const savedMode = localStorage.getItem('curves_mode');
    if (savedMode) {
      setTrackingMode(savedMode as TrackingMode);
      setHasAcceptedSafety(true);
      setCurrentScreen('main');
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectMode = (mode: TrackingMode) => {
    setTrackingMode(mode);
    localStorage.setItem('curves_mode', mode);
    if (mode === 'measures') {
      setShowSafetyModal(true);
    } else {
      setHasAcceptedSafety(true);
      setCurrentScreen('main');
      setActiveTab('habits');
    }
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const item: RecordItem = {
      id: Date.now().toString(),
      date: newDate,
      waist: newWaist ? parseFloat(newWaist) : undefined,
      hip: newHip ? parseFloat(newHip) : undefined,
      thigh: newThigh ? parseFloat(newThigh) : undefined,
      thighSide: newThigh ? thighSide : undefined,
      notes: newNotes || undefined,
      workoutHabits: newWorkoutHabits || undefined,
      feeling: newFeeling
    };

    setRecords([item, ...records]);
    setNewWaist('');
    setNewHip('');
    setNewThigh('');
    setNewNotes('');
    setNewWorkoutHabits('');
    showToast('Registro salvo com sucesso. Uma medida isolada não define seu valor.');
    setActiveTab('evolution');
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    const item: HabitItem = {
      id: Date.now().toString(),
      date: habitDate,
      activities: habitActivities,
      consistency: habitConsistency,
      energy: habitEnergy,
      notes: habitNotes || undefined
    };

    setHabits([item, ...habits]);
    setHabitActivities('');
    setHabitNotes('');
    showToast('Hábitos e treino salvos. Progresso também é manter a rotina!');
    setActiveTab('habits');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Deseja realmente apagar este registro?')) {
      setRecords(records.filter(r => r.id !== id));
      showToast('Registro apagado.');
    }
  };

  const handleDeleteHabit = (id: string) => {
    if (confirm('Deseja realmente apagar este registro de hábito?')) {
      setHabits(habits.filter(h => h.id !== id));
      showToast('Registro apagado.');
    }
  };

  // Render Screens
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C2A29] flex flex-col items-center justify-start antialiased selection:bg-[#E5DDD0]">
      {/* Top Banner / Mode Switcher bar for testing & preview */}
      <header className="w-full bg-[#EFECE6] border-b border-[#E2DBD0] py-2 px-4 text-xs flex items-center justify-between z-50">
        <div className="flex items-center gap-2 font-medium text-[#6B6560]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#8C8275]"></span>
          <span>Bônus 6 — Acompanhamento de Curvas</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#DCD5CB] rounded-md text-[#524B45] hover:bg-[#FAF8F5] transition-colors"
          >
            {isPhoneFrame ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
            <span>{isPhoneFrame ? 'Tela Cheia' : 'Modo Celular'}</span>
          </button>
          {trackingMode && (
            <button 
              onClick={() => {
                if (confirm('Deseja redefinir o modo de acompanhamento?')) {
                  localStorage.removeItem('curves_mode');
                  setTrackingMode(null);
                  setCurrentScreen('welcome');
                }
              }}
              className="text-[#8C8275] hover:text-[#2C2A29] transition-colors underline"
            >
              Reiniciar
            </button>
          )}
        </div>
      </header>

      {/* Main Container with optional Phone Frame */}
      <div className={`w-full transition-all duration-300 ${isPhoneFrame ? 'max-w-[430px] my-4 md:my-8 shadow-2xl rounded-[40px] border-[10px] border-[#2C2A29] bg-white overflow-hidden min-h-[850px] relative flex flex-col' : 'max-w-4xl mx-auto bg-white min-h-screen shadow-sm'}`}>
        
        {/* Phone Speaker notch simulator if phone frame */}
        {isPhoneFrame && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-[#2C2A29] rounded-b-xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-[#4A4542] rounded-full"></div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-[#2C2A29] text-white px-4 py-3 rounded-2xl shadow-lg text-xs flex items-center gap-3 animate-fade-in">
            <Sparkles size={16} className="text-[#D4C5B9] shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}

        {/* Safety Modal (Before Measures) */}
        {showSafetyModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
            <div className="w-full md:max-w-md bg-white rounded-t-[32px] md:rounded-3xl p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
              <div className="w-12 h-1.5 bg-[#E5DDD0] rounded-full mx-auto mb-6"></div>
              <div className="w-10 h-10 rounded-2xl bg-[#F7F5F0] text-[#6B6560] flex items-center justify-center mb-4">
                <ShieldAlert size={22} />
              </div>
              <h3 className="text-xl font-serif font-medium text-[#2C2A29] mb-3">Orientação de segurança</h3>
              <p className="text-sm text-[#6B6560] leading-relaxed mb-6">
                Medir o corpo não é necessário para cuidar da saúde ou acompanhar seus hábitos. Se isso aumenta sua ansiedade, faz você se comparar ou leva a restrições alimentares ou exercícios como punição, escolha o modo sem medidas e converse com alguém de confiança ou com um profissional.
              </p>
              <p className="text-xs text-[#8C8275] mb-6 leading-relaxed bg-[#F7F5F0] p-3 rounded-xl">
                O app sugere o modo sem medidas e evita incentivar automedições para menores de 18 anos, gravidez ou preocupação intensa com o corpo. Este app não transforma medidas em avaliação de saúde.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setTrackingMode('none');
                    localStorage.setItem('curves_mode', 'none');
                    setShowSafetyModal(false);
                    setHasAcceptedSafety(true);
                    setCurrentScreen('main');
                    setActiveTab('habits');
                  }}
                  className="w-full py-3.5 px-4 bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#2C2A29] font-medium text-sm rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <span>Prefiro não medir (Modo Sem Medidas)</span>
                </button>
                <button
                  onClick={() => {
                    setShowSafetyModal(false);
                    setHasAcceptedSafety(true);
                    setCurrentScreen('main');
                    setActiveTab('home');
                  }}
                  className="w-full py-3.5 px-4 bg-[#2C2A29] hover:bg-[#1A1817] text-white font-medium text-sm rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Continuar com medidas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 1: WELCOME */}
        {currentScreen === 'welcome' && (
          <div className="flex-1 flex flex-col justify-between p-6 pt-10 bg-[#FAF8F5]">
            <div className="space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EFECE6] text-[#2C2A29] flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#8C8275]">Bônus 6 · Acompanhamento de Curvas</span>
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-[#2C2A29] tracking-tight">
                  Acompanhe sua evolução do seu jeito
                </h1>
              </div>
              <p className="text-sm text-[#6B6560] leading-relaxed">
                Você pode registrar medidas, hábitos de treino ou usar o app sem medir o corpo. As medidas são apenas registros: não definem seu valor e não explicam, sozinhas, o que mudou no corpo. Escolha o que for confortável para você.
              </p>

              <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[#2C2A29]">
                  <Sparkles size={14} className="text-[#8C8275]" />
                  <span>Sem promessa de resultados e sem pressão estética.</span>
                </div>
                <p className="text-xs text-[#7A726B]">
                  Você pode mudar de modo, pausar lembretes ou excluir registros a qualquer momento.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-6 pb-4">
              <p className="text-xs font-medium text-[#8C8275] text-center mb-2">Escolha como prefere começar:</p>
              <button
                onClick={() => handleSelectMode('measures')}
                className="w-full py-3.5 px-4 bg-[#2C2A29] hover:bg-[#1A1817] text-white font-medium text-sm rounded-2xl transition-colors flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Scale size={18} className="text-[#D4C5B9]" />
                  <span>Acompanhar medidas</span>
                </div>
                <ChevronRight size={16} className="text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectMode('habits')}
                className="w-full py-3.5 px-4 bg-white border border-[#DCE5DC] hover:bg-[#FAF8F5] text-[#2C2A29] font-medium text-sm rounded-2xl transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-[#8C8275]" />
                  <span>Acompanhar hábitos e treino</span>
                </div>
                <ChevronRight size={16} className="text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => handleSelectMode('none')}
                className="w-full py-3.5 px-4 bg-white border border-[#E2DBD0] hover:bg-[#FAF8F5] text-[#6B6560] font-medium text-sm rounded-2xl transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-[#8C8275]" />
                  <span>Usar sem medidas (Modo rotina)</span>
                </div>
                <ChevronRight size={16} className="text-[#8C8275] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: MAIN APP WITH TABS */}
        {currentScreen === 'main' && (
          <div className="flex-1 flex flex-col justify-between bg-white relative">
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pb-24 pt-4 px-4 md:px-6 space-y-6">
              
              {/* Top Header inside App */}
              <div className="flex items-center justify-between pt-2 pb-2 border-b border-[#F0ECE4]">
                <div>
                  <h2 className="text-lg font-serif font-medium text-[#2C2A29]">Acompanhamento de Curvas</h2>
                  <p className="text-xs text-[#8C8275]">
                    {trackingMode === 'measures' ? 'Modo: Medidas e Hábitos' : trackingMode === 'habits' ? 'Modo: Hábitos e Treino' : 'Modo: Sem Medidas'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('guidance')}
                  className="w-9 h-9 rounded-xl bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#6B6560] flex items-center justify-center transition-colors"
                  title="Orientações e Como Medir"
                >
                  <HelpCircle size={18} />
                </button>
              </div>

              {/* TAB: HOME / DASHBOARD */}
              {activeTab === 'home' && (
                <div className="space-y-6">
                  {/* Welcome banner / Mode notice */}
                  <div className="bg-[#F7F5F0] p-5 rounded-3xl border border-[#EFECE6] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Seu Espaço</span>
                      <span className="text-xs px-2 py-0.5 bg-white rounded-full text-[#6B6560] border border-[#E2DBD0]">
                        {trackingMode === 'measures' ? 'Com medidas' : 'Sem medidas'}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif text-[#2C2A29]">
                      Evolução sem pressa nem julgamentos
                    </h3>
                    <p className="text-xs text-[#6B6560] leading-relaxed">
                      Variações acontecem e fita métrica não mede valor ou saúde. Registre apenas o que fizer sentido para você.
                    </p>
                    {trackingMode === 'measures' && (
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => setActiveTab('record')}
                          className="flex-1 py-2.5 px-4 bg-[#2C2A29] hover:bg-[#1A1817] text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={14} />
                          <span>Novo Registro</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('howToMeasure')}
                          className="py-2.5 px-3 bg-white border border-[#DCE5DC] hover:bg-[#FAF8F5] text-[#2C2A29] text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <BookOpen size={14} />
                          <span>Como medir</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats / Latest Record */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Último Registro</h4>
                      <button onClick={() => setActiveTab('evolution')} className="text-xs text-[#6B6560] underline">Ver todos</button>
                    </div>

                    {records.length > 0 ? (
                      <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-3 shadow-xs">
                        <div className="flex items-center justify-between text-xs text-[#8C8275]">
                          <span>Data: {records[0].date}</span>
                          <span className="px-2 py-0.5 bg-[#F7F5F0] rounded-md text-[#524B45]">{records[0].feeling || 'Tranquilo(a)'}</span>
                        </div>
                        {trackingMode === 'measures' && (
                          <div className="grid grid-cols-3 gap-2 py-1">
                            <div className="bg-[#FAF8F5] p-2.5 rounded-xl text-center">
                              <span className="text-[10px] text-[#8C8275] block">Cintura</span>
                              <span className="text-base font-semibold text-[#2C2A29]">{records[0].waist ? `${records[0].waist} cm` : '—'}</span>
                            </div>
                            <div className="bg-[#FAF8F5] p-2.5 rounded-xl text-center">
                              <span className="text-[10px] text-[#8C8275] block">Quadril</span>
                              <span className="text-base font-semibold text-[#2C2A29]">{records[0].hip ? `${records[0].hip} cm` : '—'}</span>
                            </div>
                            <div className="bg-[#FAF8F5] p-2.5 rounded-xl text-center">
                              <span className="text-[10px] text-[#8C8275] block">Coxa ({records[0].thighSide || '—'})</span>
                              <span className="text-base font-semibold text-[#2C2A29]">{records[0].thigh ? `${records[0].thigh} cm` : '—'}</span>
                            </div>
                          </div>
                        )}
                        {records[0].workoutHabits && (
                          <p className="text-xs text-[#6B6560] bg-[#F7F5F0] p-2.5 rounded-xl">
                            <strong>Treino:</strong> {records[0].workoutHabits}
                          </p>
                        )}
                        {records[0].notes && (
                          <p className="text-xs text-[#6B6560] italic">
                            "{records[0].notes}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-[#FAF8F5] rounded-2xl border border-[#EBE5DC] text-xs text-[#8C8275]">
                        Nenhum registro salvo ainda.
                      </div>
                    )}
                  </div>

                  {/* Educational Reminder Box */}
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DBD0] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#2C2A29]">
                      <Info size={14} className="text-[#8C8275]" />
                      <span>Sugestão de intervalo</span>
                    </div>
                    <p className="text-xs text-[#6B6560] leading-relaxed">
                      Recomendamos intervalos de <strong>2 a 4 semanas</strong> entre medições. Medições diárias geram ansiedade por oscilações naturais de retenção e postura.
                    </p>
                    <button 
                      onClick={() => setActiveTab('guidance')}
                      className="text-xs font-medium text-[#2C2A29] underline pt-1 block"
                    >
                      Ler aviso educativo completo →
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: RECORD (NOVO REGISTRO) */}
              {activeTab === 'record' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-medium text-[#2C2A29]">Novo registro</h3>
                    <p className="text-xs text-[#6B6560]">Insira apenas o que for confortável. Todos os campos de medidas são opcionais.</p>
                  </div>

                  <form onSubmit={handleSaveRecord} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#524B45]">Data do registro</label>
                      <input 
                        type="date" 
                        value={newDate} 
                        onChange={e => setNewDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-sm focus:outline-none focus:border-[#2C2A29]"
                        required
                      />
                    </div>

                    {trackingMode === 'measures' && (
                      <div className="space-y-4 bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE5DC]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[#2C2A29]">Medidas corporais (cm)</span>
                          <button
                            type="button"
                            onClick={() => setActiveTab('howToMeasure')}
                            className="text-[11px] text-[#6B6560] underline flex items-center gap-1"
                          >
                            <BookOpen size={12} />
                            Como medir corretamente
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] text-[#8C8275]">Cintura (opcional)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              placeholder="ex: 78" 
                              value={newWaist}
                              onChange={e => setNewWaist(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-[#8C8275]">Quadril (opcional)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              placeholder="ex: 102" 
                              value={newHip}
                              onChange={e => setNewHip(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] text-[#8C8275]">Coxa (opcional)</label>
                            <input 
                              type="number" 
                              step="0.1"
                              placeholder="ex: 56" 
                              value={newThigh}
                              onChange={e => setNewThigh(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-[#8C8275]">Lado da coxa</label>
                            <select 
                              value={thighSide} 
                              onChange={e => setThighSide(e.target.value as any)}
                              className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-sm"
                            >
                              <option value="direita">Direita</option>
                              <option value="esquerda">Esquerda</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#524B45]">Hábitos de treino ou atividade (opcional)</label>
                      <input 
                        type="text" 
                        placeholder="Ex: 3 treinos de força, caminhada no parque"
                        value={newWorkoutHabits}
                        onChange={e => setNewWorkoutHabits(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#524B45]">Algo que queira lembrar? (Observação)</label>
                      <textarea 
                        rows={2}
                        placeholder="Ex: Dormi bem esta semana, período menstrual, etc."
                        value={newNotes}
                        onChange={e => setNewNotes(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E2DBD0] rounded-xl text-sm resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#524B45]">Como se sentiu ao fazer este registro?</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Tranquilo(a)', 'Indiferente', 'Desconfortável', 'Prefiro não responder'] as const).map(feel => (
                          <button
                            key={feel}
                            type="button"
                            onClick={() => setNewFeeling(feel)}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${newFeeling === feel ? 'bg-[#2C2A29] text-white border-[#2C2A29]' : 'bg-[#FAF8F5] text-[#6B6560] border-[#E2DBD0] hover:bg-[#EFECE6]'}`}
                          >
                            {feel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-[#2C2A29] hover:bg-[#1A1817] text-white text-sm font-medium rounded-2xl transition-colors shadow-sm mt-4 flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      <span>Salvar registro</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: EVOLUTION (HISTÓRICO E GRÁFICO NEUTRO) */}
              {activeTab === 'evolution' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-medium text-[#2C2A29]">Evolução e Histórico</h3>
                      <p className="text-xs text-[#6B6560]">Tendências ao longo do tempo, sem faixas ideais.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('record')}
                      className="px-3 py-1.5 bg-[#2C2A29] text-white rounded-xl text-xs font-medium flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      <span>Novo</span>
                    </button>
                  </div>

                  {/* Neutral Explanatory Text */}
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DBD0] text-xs text-[#6B6560] leading-relaxed">
                    "Variações nas medidas não revelam, por si só, se houve mudança de músculo, gordura ou formato corporal. A fita registra circunferências; não identifica a causa de uma mudança."
                  </div>

                  {/* Simple Trend Visualizer / Chart Mock */}
                  {records.length > 0 && trackingMode === 'measures' && (
                    <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#8C8275]">
                        <span className="font-medium text-[#2C2A29]">Tendência de Cintura</span>
                        <span>{records.length} registros</span>
                      </div>
                      <div className="h-28 flex items-end gap-3 pt-4 px-2 bg-[#FAF8F5] rounded-xl border border-[#F0ECE4]">
                        {records.slice().reverse().map((r, i) => {
                          const maxWaist = Math.max(...records.map(x => x.waist || 0), 100);
                          const heightPct = r.waist ? Math.min(100, Math.max(20, (r.waist / maxWaist) * 80)) : 20;
                          return (
                            <div key={r.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                              <span className="text-[10px] text-[#8C8275] opacity-0 group-hover:opacity-100 transition-opacity">{r.waist ? `${r.waist}cm` : '—'}</span>
                              <div 
                                style={{ height: `${heightPct}%` }} 
                                className="w-full bg-[#8C8275] hover:bg-[#2C2A29] rounded-t-md transition-all cursor-pointer"
                                title={`Data: ${r.date} - Cintura: ${r.waist || 'N/A'}cm`}
                              ></div>
                              <span className="text-[9px] text-[#8C8275] truncate w-full text-center">{r.date.slice(5)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Records List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Registros Cronológicos</h4>
                    {records.length > 0 ? (
                      <div className="space-y-3">
                        {records.map(record => (
                          <div key={record.id} className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-3 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#2C2A29] flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#8C8275]" />
                                {record.date}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded text-[#6B6560] border border-[#E2DBD0]">
                                  {record.feeling || 'Tranquilo(a)'}
                                </span>
                                <button 
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="text-[#B2A89E] hover:text-red-600 transition-colors p-1"
                                  title="Apagar registro"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            {trackingMode === 'measures' && (
                              <div className="grid grid-cols-3 gap-2 text-center text-xs bg-[#FAF8F5] p-2.5 rounded-xl">
                                <div>
                                  <span className="text-[10px] text-[#8C8275] block">Cintura</span>
                                  <span className="font-semibold text-[#2C2A29]">{record.waist ? `${record.waist} cm` : '—'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[#8C8275] block">Quadril</span>
                                  <span className="font-semibold text-[#2C2A29]">{record.hip ? `${record.hip} cm` : '—'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-[#8C8275] block">Coxa</span>
                                  <span className="font-semibold text-[#2C2A29]">{record.thigh ? `${record.thigh} cm` : '—'}</span>
                                </div>
                              </div>
                            )}

                            {record.workoutHabits && (
                              <p className="text-xs text-[#6B6560]">
                                <strong>Treino:</strong> {record.workoutHabits}
                              </p>
                            )}

                            {record.notes && (
                              <p className="text-xs text-[#6B6560] italic border-l-2 border-[#D4C5B9] pl-2">
                                "{record.notes}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#EBE5DC] text-xs text-[#8C8275]">
                        Nenhum registro encontrado.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: HABITS & WORKOUTS (HÁBITOS E TREINO) */}
              {activeTab === 'habits' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-medium text-[#2C2A29]">Hábitos e Treino</h3>
                    <p className="text-xs text-[#6B6560]">Progresso também é manter uma rotina que você consegue sustentar.</p>
                  </div>

                  {/* New Habit Form */}
                  <form onSubmit={handleSaveHabit} className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EBE5DC] space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Novo Registro de Hábitos</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#8C8275]">Data</label>
                        <input 
                          type="date"
                          value={habitDate}
                          onChange={e => setHabitDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#8C8275]">Disposição / Energia</label>
                        <select 
                          value={habitEnergy}
                          onChange={e => setHabitEnergy(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs"
                        >
                          <option value="Baixa">Baixa</option>
                          <option value="Moderada">Moderada</option>
                          <option value="Boa">Boa</option>
                          <option value="Excelente">Excelente</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#8C8275]">Atividades / Exercícios praticados</label>
                      <input 
                        type="text"
                        placeholder="Ex: Caminhada de 30 min, musculação"
                        value={habitActivities}
                        onChange={e => setHabitActivities(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#8C8275]">Nota livre (opcional)</label>
                      <input 
                        type="text"
                        placeholder="Ex: Consegui manter o plano da semana"
                        value={habitNotes}
                        onChange={e => setHabitNotes(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#2C2A29] hover:bg-[#1A1817] text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <Plus size={14} />
                      <span>Adicionar nota de hábitos</span>
                    </button>
                  </form>

                  {/* Habit History List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Histórico de Hábitos</h4>
                    {habits.length > 0 ? (
                      <div className="space-y-3">
                        {habits.map(h => (
                          <div key={h.id} className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#2C2A29] flex items-center gap-1.5">
                                <Calendar size={14} className="text-[#8C8275]" />
                                {h.date}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded text-[#6B6560] border border-[#E2DBD0]">
                                  Energia: {h.energy}
                                </span>
                                <button 
                                  onClick={() => handleDeleteHabit(h.id)}
                                  className="text-[#B2A89E] hover:text-red-600 transition-colors p-1"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-[#2C2A29] font-medium">
                              {h.activities}
                            </p>
                            {h.notes && (
                              <p className="text-xs text-[#6B6560] italic">
                                "{h.notes}"
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-[#FAF8F5] rounded-2xl border border-[#EBE5DC] text-xs text-[#8C8275]">
                        Nenhum hábito registrado.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: HOW TO MEASURE & GUIDANCE (COMO MEDIR E AVISOS) */}
              {activeTab === 'howToMeasure' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-medium text-[#2C2A29]">Como usar a fita métrica</h3>
                    <p className="text-xs text-[#6B6560]">Instruções para consistência e precisão comparativa.</p>
                  </div>

                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2DBD0] text-xs text-[#6B6560] leading-relaxed space-y-2">
                    <p><strong>Orientação geral:</strong> Use uma fita métrica flexível, não elástica. Fique em pé, numa posição confortável, sem prender a respiração, encolher a barriga ou apertar a fita contra a pele. Tente repetir o método e o local nas próximas medições.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-2">
                      <h4 className="text-xs font-semibold text-[#2C2A29] uppercase tracking-wide">1. Cintura</h4>
                      <ol className="text-xs text-[#6B6560] space-y-1.5 list-decimal pl-4">
                        <li>Encontre a região entre a parte inferior das costelas e a parte superior do osso do quadril.</li>
                        <li>Posicione a fita sempre no mesmo ponto (ponto intermediário).</li>
                        <li>Mantenha a fita nivelada ao redor do tronco, sem comprimir a pele.</li>
                        <li>Respire normalmente e registre o número sem sugar a barriga.</li>
                      </ol>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-2">
                      <h4 className="text-xs font-semibold text-[#2C2A29] uppercase tracking-wide">2. Quadril</h4>
                      <ol className="text-xs text-[#6B6560] space-y-1.5 list-decimal pl-4">
                        <li>Fique em pé, com os pés próximos e o peso distribuído.</li>
                        <li>Passe a fita ao redor da parte mais larga do quadril e dos glúteos.</li>
                        <li>Confira no espelho se a fita está reta e paralela ao chão.</li>
                        <li>Registre a medida sem apertar.</li>
                      </ol>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-2">
                      <h4 className="text-xs font-semibold text-[#2C2A29] uppercase tracking-wide">3. Coxa (opcional)</h4>
                      <ol className="text-xs text-[#6B6560] space-y-1.5 list-decimal pl-4">
                        <li>Escolha uma perna e use sempre a mesma.</li>
                        <li>Anote o ponto usado (ex: distância a partir do joelho) para repetir a posição.</li>
                        <li>Mantenha a perna relaxada e a fita em contato suave.</li>
                        <li>Registre qual perna e qual local foram medidos.</li>
                      </ol>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('guidance')}
                    className="w-full py-3 bg-[#F7F5F0] hover:bg-[#EFECE6] text-[#2C2A29] text-xs font-medium rounded-2xl transition-colors border border-[#E2DBD0]"
                  >
                    Ler aviso educativo completo →
                  </button>
                </div>
              )}

              {/* TAB: GUIDANCE / EDUCATIONAL NOTICE (AVISOS E EDUCAÇÃO) */}
              {activeTab === 'guidance' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif font-medium text-[#2C2A29]">Aviso educativo</h3>
                    <p className="text-xs text-[#6B6560]">Limites do app e termos de uso consciente.</p>
                  </div>

                  <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-[#E2DBD0] space-y-4 text-xs text-[#6B6560] leading-relaxed">
                    <p>
                      Este mini app é uma ferramenta de registro pessoal. Não oferece avaliação médica, nutricional ou física, e não substitui orientação profissional.
                    </p>
                    <p>
                      As medidas não determinam seu valor, não indicam sozinhas a composição corporal e não garantem mudanças de formato, ganho de curvas, perda de gordura ou qualquer resultado específico. Diferenças entre registros podem ocorrer por mudanças no local da fita ou na forma de medir.
                    </p>
                    <p>
                      Não use estas medidas para diagnosticar problemas de saúde. Se o acompanhamento causar ansiedade, comparação, restrição alimentar ou vontade de se exercitar como punição, pause o registro e procure apoio de uma pessoa de confiança ou de um profissional.
                    </p>
                    <div className="pt-2 border-t border-[#E2DBD0]">
                      <p className="font-semibold text-[#2C2A29]">O app não promete resultados.</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#EBE5DC] space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C8275]">Opções e Controles</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          if (trackingMode === 'measures') {
                            setTrackingMode('none');
                            localStorage.setItem('curves_mode', 'none');
                            showToast('Modo alterado para sem medidas.');
                          } else {
                            setTrackingMode('measures');
                            localStorage.setItem('curves_mode', 'measures');
                            showToast('Modo de medidas ativado.');
                          }
                        }}
                        className="w-full py-2.5 px-3 bg-[#FAF8F5] hover:bg-[#EFECE6] text-[#2C2A29] text-xs font-medium rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span>Alternar modo (Atual: {trackingMode === 'measures' ? 'Com medidas' : 'Sem medidas'})</span>
                        <RefreshCw size={14} className="text-[#8C8275]" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Deseja apagar todos os registros salvos?')) {
                            setRecords([]);
                            setHabits([]);
                            showToast('Todos os registros foram apagados.');
                          }
                        }}
                        className="w-full py-2.5 px-3 bg-[#FAF8F5] hover:bg-red-50 text-red-700 text-xs font-medium rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span>Apagar todos os dados</span>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* FIXED BOTTOM NAVIGATION BAR */}
            <nav className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#EFECE6] grid grid-cols-5 items-center px-2 z-40">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'home' ? 'text-[#2C2A29]' : 'text-[#8C8275] hover:text-[#524B45]'}`}
              >
                <Heart size={20} className={activeTab === 'home' ? 'fill-[#2C2A29]' : ''} />
                <span className="text-[10px] font-medium mt-1">Início</span>
              </button>

              <button
                onClick={() => setActiveTab('record')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'record' ? 'text-[#2C2A29]' : 'text-[#8C8275] hover:text-[#524B45]'}`}
              >
                <Plus size={20} />
                <span className="text-[10px] font-medium mt-1">Registrar</span>
              </button>

              <button
                onClick={() => setActiveTab('evolution')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'evolution' ? 'text-[#2C2A29]' : 'text-[#8C8275] hover:text-[#524B45]'}`}
              >
                <LineChart size={20} />
                <span className="text-[10px] font-medium mt-1">Evolução</span>
              </button>

              <button
                onClick={() => setActiveTab('habits')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'habits' ? 'text-[#2C2A29]' : 'text-[#8C8275] hover:text-[#524B45]'}`}
              >
                <Activity size={20} />
                <span className="text-[10px] font-medium mt-1">Hábitos</span>
              </button>

              <button
                onClick={() => setActiveTab('guidance')}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'guidance' || activeTab === 'howToMeasure' ? 'text-[#2C2A29]' : 'text-[#8C8275] hover:text-[#524B45]'}`}
              >
                <BookOpen size={20} />
                <span className="text-[10px] font-medium mt-1">Avisos</span>
              </button>
            </nav>

          </div>
        )}

      </div>
    </div>
  );
}
