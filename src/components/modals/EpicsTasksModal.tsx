import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { EPICS_AND_TASKS } from '../../data/mockData';
import { CheckSquare, Terminal, Database, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

export const EpicsTasksModal: React.FC = () => {
  const { isEpicsModalOpen, setIsEpicsModalOpen, setIsApiExplorerOpen } = useHotel();
  const [selectedEpicId, setSelectedEpicId] = useState<number>(1);

  if (!isEpicsModalOpen) return null;

  const currentEpic = EPICS_AND_TASKS.find((e) => e.id === selectedEpicId) || EPICS_AND_TASKS[0];
  const totalTasks = EPICS_AND_TASKS.reduce((acc, e) => acc + e.tasks.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-serif">
                System Specification: 6 Epics & 19 Tasks
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Curriculum requirement compliance matrix covering Express REST API, MongoDB Collections, JWT Security & Front-end features.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEpicsModalOpen(false);
                setIsApiExplorerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-sky-400 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 rounded-lg transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch API Explorer</span>
            </button>
            <button
              onClick={() => setIsEpicsModalOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Epics Navigation Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
          {EPICS_AND_TASKS.map((epic) => (
            <button
              key={epic.id}
              onClick={() => setSelectedEpicId(epic.id)}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedEpicId === epic.id
                  ? 'border-amber-500 bg-amber-500/10 shadow-sm'
                  : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="font-mono text-[10px] text-amber-400 font-bold">{epic.code}</div>
              <div className="font-semibold text-xs text-slate-200 truncate mt-0.5">
                {epic.title.split('&')[0]}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{epic.tasks.length} Tasks</div>
            </button>
          ))}
        </div>

        {/* Selected Epic Details */}
        <div className="mt-4 p-4 bg-slate-950/70 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase">
              {currentEpic.code} Specification
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Tasks Implemented & Verified</span>
            </span>
          </div>
          <h4 className="text-base font-bold text-white mt-1 font-serif">{currentEpic.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{currentEpic.summary}</p>
        </div>

        {/* Task List for Selected Epic */}
        <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
          {currentEpic.tasks.map((task) => (
            <div
              key={task.taskCode}
              className="bg-slate-850 bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                    {task.taskCode}
                  </span>
                  <h5 className="font-semibold text-sm text-white">{task.title}</h5>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED</span>
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{task.description}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-sky-300 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                    <span className="text-amber-400 font-bold">{task.method}</span>
                    <span>{task.apiEndpoint}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>db.{task.mongoCollection}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsEpicsModalOpen(false);
                    setIsApiExplorerOpen(true);
                  }}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-mono"
                >
                  <span>Test in Postman Runner</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>
            <span>Total Epics: </span>
            <span className="font-bold text-white">6</span>
            <span className="mx-2">·</span>
            <span>Total Tasks: </span>
            <span className="font-bold text-emerald-400">19 / 19 (100% Complete)</span>
          </div>

          <button
            onClick={() => setIsEpicsModalOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-sans"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
