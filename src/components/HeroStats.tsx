import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Sparkles, Calendar, Key, AlertCircle, ArrowUpRight } from 'lucide-react';

export const HeroStats: React.FC = () => {
  const { rooms, bookings, housekeepingTasks, setActiveView, setIsNewReservationOpen } = useHotel();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const reservedRooms = rooms.filter((r) => r.status === 'reserved').length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'cleaning').length;

  const occupancyRate = Math.round((occupiedRooms / (totalRooms || 1)) * 100);

  // Calculate ADR (Average Daily Rate of occupied rooms)
  const occupiedRatesSum = rooms
    .filter((r) => r.status === 'occupied')
    .reduce((sum, r) => sum + r.baseRate, 0);
  const adr = occupiedRooms > 0 ? Math.round(occupiedRatesSum / occupiedRooms) : 340;

  // RevPAR = Total room revenue / Total available rooms
  const revPar = Math.round((occupiedRatesSum / (totalRooms || 1)));

  const todayStr = '2026-10-28';
  const arrivalsToday = bookings.filter((b) => b.checkInDate === todayStr && b.status === 'confirmed').length;
  const departuresToday = bookings.filter((b) => b.checkOutDate === todayStr && b.status === 'checked_in').length;
  const pendingCleanings = housekeepingTasks.filter((t) => t.status !== 'completed').length;

  return (
    <div className="relative mb-8">
      {/* Luxury Property Header Banner with Scrim */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hotel_hero_luxury_1793206986440.jpg"
            alt="The Grand Azure Luxury Hotel"
            className="w-full h-full object-cover object-center filter brightness-[0.45] saturate-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
        </div>

        {/* Content Inside Banner */}
        <div className="relative z-10 px-6 sm:px-8 py-8 lg:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <span>The Grand Azure Hotel & Residences</span>
              <span aria-hidden="true">·</span>
              <span>Live Property Matrix</span>
              <span aria-hidden="true">·</span>
              <span>October 28, 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
              Hospitality Operations Console
            </h1>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed font-sans max-w-xl">
              Enterprise management suite with real-time floor availability, guest folios, automated keycard encoding, and RevPAR revenue performance tracking.
            </p>
          </div>

          {/* Quick Action cluster */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveView('front_desk')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-lg transition-colors shadow-sm"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Front Desk Queue</span>
              {arrivalsToday > 0 && (
                <span className="ml-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                  {arrivalsToday} Arriving
                </span>
              )}
            </button>

            <button
              onClick={() => setIsNewReservationOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Direct Reservation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* High-Density KPI Strip (Full-width row below split) */}
        <div className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <div className="text-[11px] font-medium text-slate-400">Occupancy Rate</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {occupancyRate}%
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({occupiedRooms}/{totalRooms})
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">ADR (Avg Daily Rate)</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-white tabular-nums">
                ${adr}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">/ night</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">RevPAR (Rev/Room)</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                ${revPar}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">index</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">Ready Inventory</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                {availableRooms}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                avail · {reservedRooms} rsvd
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">Today's Movement</div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-sm font-semibold font-mono text-emerald-400 tabular-nums">
                +{arrivalsToday} In
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-sm font-semibold font-mono text-rose-400 tabular-nums">
                -{departuresToday} Out
              </span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400">Housekeeping Queue</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
                {pendingCleanings}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                tickets ({cleaningRooms} dirty)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
