import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { StaffRole } from '../types/hotel';
import {
  Plus,
  Terminal,
  CheckSquare,
  ChevronDown,
  User,
  Shield,
  RotateCcw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    currentUser,
    switchUserRole,
    staffUsers,
    setIsNewReservationOpen,
    setIsEpicsModalOpen,
    setIsApiExplorerOpen,
    resetAllData,
  } = useHotel();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navItems = [
    { id: 'matrix', label: 'Room Matrix' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'front_desk', label: 'Front Desk' },
    { id: 'folios', label: 'Folio & POS' },
    { id: 'housekeeping', label: 'Housekeeping' },
    { id: 'guests', label: 'Guest CRM' },
    { id: 'analytics', label: 'RevPAR Analytics' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand title, single line */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('matrix')}
              className="text-left group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-inner">
                <span className="font-serif text-lg font-bold text-white tracking-wider">H</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif group-hover:text-amber-400 transition-colors">
                HotelPro
              </span>
            </button>
            <span className="hidden xl:inline text-xs font-mono text-slate-500 tracking-wider uppercase ml-1">
              Grand Azure Resort PMS
            </span>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Role Switching */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Epics & Tasks Tracker Trigger */}
            <button
              onClick={() => setIsEpicsModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-md transition-colors whitespace-nowrap"
              title="View 6 Epics & 19 Tasks Specification"
            >
              <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Epics & Tasks (6/19)</span>
            </button>

            {/* REST API & Mongo Explorer */}
            <button
              onClick={() => setIsApiExplorerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-sky-400 bg-sky-950/40 hover:bg-sky-900/40 border border-sky-800/50 rounded-md transition-colors whitespace-nowrap"
              title="Test Node.js Express REST API & Inspect MongoDB Schemas"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">API & Mongo</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-700 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-3 h-3 text-slate-300 m-auto mt-1" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium text-slate-200 leading-none">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400/90 font-mono leading-none mt-1 uppercase">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-850 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl p-2 z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    Switch Active RBAC Role
                  </div>
                  <div className="py-1">
                    {staffUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUserRole(user.role as StaffRole);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors ${
                          currentUser.id === user.id
                            ? 'bg-amber-500/10 text-amber-300 font-medium'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium text-slate-100">{user.name}</div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">
                            {user.role.replace('_', ' ')} · {user.department}
                          </div>
                        </div>
                        {currentUser.id === user.id && (
                          <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        resetAllData();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data to Initial</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsNewReservationOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2 border-t border-slate-800/80 -mx-4 px-4 scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                activeView === item.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-800/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
