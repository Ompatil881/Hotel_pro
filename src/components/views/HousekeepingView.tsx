import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { HousekeepingTask, HousekeepingPriority } from '../../types/hotel';
import {
  Sparkles,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  CheckCheck,
} from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const {
    housekeepingTasks,
    rooms,
    updateHousekeepingTask,
    createHousekeepingTask,
    currentUser,
  } = useHotel();

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [targetRoomNumber, setTargetRoomNumber] = useState('102');
  const [taskType, setTaskType] = useState<HousekeepingTask['taskType']>('Full Turnover');
  const [priority, setPriority] = useState<HousekeepingPriority>('urgent');
  const [assignedStaff, setAssignedStaff] = useState('Elena Rostova');
  const [notes, setNotes] = useState('');

  const pendingTasks = housekeepingTasks.filter((t) => t.status === 'pending');
  const inProgressTasks = housekeepingTasks.filter((t) => t.status === 'in_progress');
  const inspectedTasks = housekeepingTasks.filter((t) => t.status === 'inspected');
  const completedTasks = housekeepingTasks.filter((t) => t.status === 'completed');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find((r) => r.number === targetRoomNumber);
    if (!room) return;

    createHousekeepingTask({
      roomId: room.id,
      roomNumber: room.number,
      roomType: room.type,
      floor: room.floor,
      taskType,
      priority,
      status: 'pending',
      assignedStaff,
      estimatedMinutes: taskType === 'Deep Clean' ? 60 : 35,
      notes: notes.trim() || undefined,
    });

    setIsNewTaskModalOpen(false);
    setNotes('');
  };

  const getPriorityBadge = (p: HousekeepingPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-rose-400 font-mono text-[10px] font-bold">URGENT</span>;
      case 'normal':
        return <span className="text-amber-400 font-mono text-[10px] font-medium">NORMAL</span>;
      case 'low':
        return <span className="text-slate-400 font-mono text-[10px] font-medium">LOW</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Dispatch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-serif font-bold text-white">Housekeeping Operations Board</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time turnover dispatch, sanitization inspection, and room release management.
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Dispatch Clean Ticket</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Column 1: Needs Cleaning / Pending */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Pending Queue ({pendingTasks.length})</span>
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-850 bg-slate-800/90 border border-slate-700/80 rounded-lg p-3 text-xs shadow-sm hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono font-bold text-base text-white">
                    Room {task.roomNumber}
                  </div>
                  <div>{getPriorityBadge(task.priority)}</div>
                </div>

                <div className="text-[11px] font-medium text-amber-300 mt-1">{task.taskType}</div>
                <div className="text-[11px] text-slate-400">{task.roomType} · Fl {task.floor}</div>

                {task.notes && (
                  <p className="mt-2 text-[11px] text-slate-300 bg-slate-900/70 p-1.5 rounded border border-slate-800 italic">
                    "{task.notes}"
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <User className="w-3 h-3" />
                    <span>{task.assignedStaff}</span>
                  </div>

                  <button
                    onClick={() => updateHousekeepingTask(task.id, 'in_progress')}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            ))}

            {pendingTasks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No pending tickets.</p>
            )}
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>In Turnover ({inProgressTasks.length})</span>
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {inProgressTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/90 border border-amber-500/30 rounded-lg p-3 text-xs shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono font-bold text-base text-white">
                    Room {task.roomNumber}
                  </div>
                  <div>{getPriorityBadge(task.priority)}</div>
                </div>

                <div className="text-[11px] font-medium text-amber-300 mt-1">{task.taskType}</div>
                <div className="text-[11px] text-slate-400">{task.roomType} · ~{task.estimatedMinutes}m est</div>

                {task.notes && (
                  <p className="mt-2 text-[11px] text-slate-300 bg-slate-900/70 p-1.5 rounded border border-slate-800 italic">
                    "{task.notes}"
                  </p>
                )}

                <div className="mt-3 pt-2 border-t border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <User className="w-3 h-3" />
                    <span>{task.assignedStaff}</span>
                  </div>

                  <button
                    onClick={() => updateHousekeepingTask(task.id, 'inspected')}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-sky-200 bg-sky-950/80 hover:bg-sky-900/80 border border-sky-800 rounded transition-colors"
                  >
                    <span>Request Audit</span>
                  </button>
                </div>
              </div>
            ))}

            {inProgressTasks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No rooms currently being cleaned.</p>
            )}
          </div>
        </div>

        {/* Column 3: Ready for Inspection */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspection ({inspectedTasks.length})</span>
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {inspectedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/90 border border-sky-500/30 rounded-lg p-3 text-xs shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono font-bold text-base text-white">
                    Room {task.roomNumber}
                  </div>
                  <span className="text-sky-300 font-mono text-[10px]">AWAITING AUDIT</span>
                </div>

                <div className="text-[11px] font-medium text-slate-200 mt-1">{task.taskType}</div>
                <div className="text-[11px] text-slate-400">Attendant: {task.assignedStaff}</div>

                <div className="mt-3 pt-2 border-t border-slate-700/70 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">Updated {task.updatedAt}</span>

                  <button
                    onClick={() => updateHousekeepingTask(task.id, 'completed', 'Supervisor certified clean')}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Pass & Release</span>
                  </button>
                </div>
              </div>
            ))}

            {inspectedTasks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No rooms awaiting inspection.</p>
            )}
          </div>
        </div>

        {/* Column 4: Completed & Released */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Released Clean ({completedTasks.length})</span>
            </span>
          </div>

          <div className="space-y-3 flex-1">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/60 border border-emerald-500/30 rounded-lg p-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono font-bold text-base text-slate-300">
                    Room {task.roomNumber}
                  </div>
                  <span className="text-emerald-400 font-mono text-[10px] font-bold">RELEASED</span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1">{task.taskType} · Completed</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Logged {task.updatedAt}</div>
              </div>
            ))}

            {completedTasks.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">No completed tasks yet today.</p>
            )}
          </div>
        </div>
      </div>

      {/* New Clean Ticket Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white font-serif">Dispatch Housekeeping Ticket</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Room</label>
                <select
                  value={targetRoomNumber}
                  onChange={(e) => setTargetRoomNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} - {r.type} (Currently: {r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Type</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Full Turnover">Full Turnover (Linen & Amenities)</option>
                  <option value="Daily Tidy">Daily Tidy (Make bed & towels)</option>
                  <option value="Deep Clean">Deep Clean & Sanitization</option>
                  <option value="VIP Turndown">VIP Turndown & Welcome Setup</option>
                  <option value="Sanitization Check">Sanitization & Safety Audit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="urgent">Urgent (Arrival Imminent)</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Attendant</label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Elena Rostova">Elena Rostova (Lead)</option>
                    <option value="Maria Santos">Maria Santos</option>
                    <option value="Carlos Mendoza">Carlos Mendoza</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Feather-free bedding, replenish Nespresso pods, sanitize terrace..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Dispatch to Attendant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
