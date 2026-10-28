import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomStatus } from '../../types/hotel';
import {
  BedDouble,
  Users,
  Eye,
  CalendarPlus,
  Sparkles,
  Wrench,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
} from 'lucide-react';

export const RoomMatrixView: React.FC = () => {
  const {
    rooms,
    setSelectedRoom,
    setIsNewReservationOpen,
    updateRoomStatus,
    setActiveView,
    setSelectedFolioForInvoice,
    folios,
  } = useHotel();

  const [floorFilter, setFloorFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const floors = [1, 2, 3, 4];

  const filteredRooms = rooms.filter((room) => {
    const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      room.number.includes(searchQuery.trim()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (room.currentGuestName && room.currentGuestName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFloor && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return <span className="text-emerald-400 font-mono text-xs font-semibold">AVAILABLE</span>;
      case 'occupied':
        return <span className="text-rose-400 font-mono text-xs font-semibold">OCCUPIED</span>;
      case 'reserved':
        return <span className="text-amber-400 font-mono text-xs font-semibold">RESERVED</span>;
      case 'cleaning':
        return <span className="text-sky-400 font-mono text-xs font-semibold">CLEANING</span>;
      case 'maintenance':
        return <span className="text-orange-400 font-mono text-xs font-semibold">OUT OF ORDER</span>;
      default:
        return null;
    }
  };

  const getCardBorder = (status: RoomStatus) => {
    switch (status) {
      case 'available':
        return 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/10';
      case 'occupied':
        return 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10';
      case 'reserved':
        return 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10';
      case 'cleaning':
        return 'border-sky-500/30 hover:border-sky-500/60 bg-sky-950/10';
      case 'maintenance':
        return 'border-orange-500/30 hover:border-orange-500/60 bg-orange-950/10';
      default:
        return 'border-slate-800 bg-slate-900/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        {/* Floor Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg overflow-x-auto">
          <button
            onClick={() => setFloorFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              floorFilter === 'all'
                ? 'bg-slate-700 text-amber-400 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Floors
          </button>
          {floors.map((fl) => (
            <button
              key={fl}
              onClick={() => setFloorFilter(fl)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                floorFilter === fl
                  ? 'bg-slate-700 text-amber-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Floor {fl}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg overflow-x-auto">
          {(['all', 'available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Room #, type, guest..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Room Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const associatedFolio = folios.find((f) => f.roomNumber === room.number && f.status === 'open');

          return (
            <div
              key={room.id}
              className={`rounded-xl border p-4.5 transition-all duration-150 flex flex-col justify-between ${getCardBorder(
                room.status
              )}`}
            >
              {/* Card Header: Room Number, Status, Rate */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums">
                      {room.number}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Fl {room.floor}</span>
                  </div>
                  <div className="text-right">{getStatusBadge(room.status)}</div>
                </div>

                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{room.type}</span>
                  <span className="font-mono text-amber-300 font-semibold tabular-nums">
                    ${room.baseRate}
                    <span className="text-[10px] text-slate-400 font-sans">/nt</span>
                  </span>
                </div>

                {/* Occupant or Maintenance note */}
                <div className="mt-3 min-h-[40px] p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
                  {room.status === 'occupied' && (
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-mono">In-House Guest</div>
                      <div className="font-medium text-slate-200 truncate">{room.currentGuestName || 'Registered Guest'}</div>
                    </div>
                  )}
                  {room.status === 'reserved' && (
                    <div>
                      <div className="text-[10px] text-amber-400/90 uppercase font-mono">Incoming Arrival</div>
                      <div className="font-medium text-slate-200 truncate">{room.currentGuestName || 'Confirmed Booking'}</div>
                    </div>
                  )}
                  {room.status === 'available' && (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Ready for Check-In</span>
                    </div>
                  )}
                  {room.status === 'cleaning' && (
                    <div className="flex items-center gap-1.5 text-sky-300">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Housekeeping Assigned ({room.cleanStatus})</span>
                    </div>
                  )}
                  {room.status === 'maintenance' && (
                    <div className="text-orange-300 flex items-start gap-1.5">
                      <Wrench className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="truncate text-[11px]">{room.maintenanceNote || 'Facility maintenance'}</span>
                    </div>
                  )}
                </div>

                {/* Metadata row with zero-pill typography */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    <span>{room.bedType}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Max {room.maxGuests}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{room.squareMeters}m²</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedRoom(room)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Specs</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {room.status === 'available' && (
                    <button
                      onClick={() => setIsNewReservationOpen(true, room.id)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
                    >
                      Book Room
                    </button>
                  )}

                  {room.status === 'cleaning' && (
                    <button
                      onClick={() => updateRoomStatus(room.id, 'available', 'clean')}
                      className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/40 rounded transition-colors whitespace-nowrap"
                    >
                      Mark Clean
                    </button>
                  )}

                  {room.status === 'occupied' && associatedFolio && (
                    <button
                      onClick={() => {
                        setSelectedFolioForInvoice(associatedFolio);
                        setActiveView('folios');
                      }}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
                    >
                      <FileText className="w-3 h-3 text-amber-400" />
                      <span>Folio</span>
                    </button>
                  )}

                  {/* Status Toggle helper dropdown */}
                  <div className="relative group">
                    <button className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors">
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute right-0 bottom-full mb-1 w-36 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 hidden group-hover:block z-20 text-[11px]">
                      <div className="px-2 py-1 text-[10px] text-slate-400 font-mono uppercase">Change State</div>
                      <button
                        onClick={() => updateRoomStatus(room.id, 'available', 'clean')}
                        className="w-full text-left px-2 py-1 text-emerald-400 hover:bg-slate-800 rounded"
                      >
                        Available (Clean)
                      </button>
                      <button
                        onClick={() => updateRoomStatus(room.id, 'cleaning', 'dirty')}
                        className="w-full text-left px-2 py-1 text-sky-400 hover:bg-slate-800 rounded"
                      >
                        Cleaning (Dirty)
                      </button>
                      <button
                        onClick={() => updateRoomStatus(room.id, 'maintenance', room.cleanStatus, 'Routine check')}
                        className="w-full text-left px-2 py-1 text-orange-400 hover:bg-slate-800 rounded"
                      >
                        Out of Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl">
          <p className="text-sm text-slate-400">No rooms match the selected floor, status, or search query.</p>
        </div>
      )}
    </div>
  );
};
