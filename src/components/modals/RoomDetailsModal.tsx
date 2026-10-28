import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { RoomStatus, CleanStatus } from '../../types/hotel';
import {
  BedDouble,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
  Wrench,
  Calendar,
  Layers,
} from 'lucide-react';

export const RoomDetailsModal: React.FC = () => {
  const {
    selectedRoom,
    setSelectedRoom,
    updateRoomStatus,
    setIsNewReservationOpen,
  } = useHotel();

  if (!selectedRoom) return null;

  const imageSrc =
    selectedRoom.imageUrl ||
    (selectedRoom.type.includes('Suite') || selectedRoom.type.includes('Villa')
      ? '/src/assets/images/hotel_presidential_suite_1793206987663.jpg'
      : '/src/assets/images/hotel_executive_room_1793206987905.jpg');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
        {/* Room High-Res Image Banner */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={imageSrc}
            alt={`Room ${selectedRoom.number} - ${selectedRoom.type}`}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
          <button
            onClick={() => setSelectedRoom(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>Floor {selectedRoom.floor}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedRoom.view}</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-white mt-0.5">
                Room {selectedRoom.number}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                ${selectedRoom.baseRate}
              </span>
              <span className="text-xs text-slate-400 font-sans ml-1">/ night</span>
            </div>
          </div>
        </div>

        {/* Specs and Details */}
        <div className="p-6 space-y-5 text-xs">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-center font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Category</div>
              <div className="font-semibold text-slate-200 mt-0.5 truncate">{selectedRoom.type}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Bedding</div>
              <div className="font-semibold text-slate-200 mt-0.5">{selectedRoom.bedType}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Living Space</div>
              <div className="font-semibold text-slate-200 mt-0.5">{selectedRoom.squareMeters} m²</div>
            </div>
          </div>

          {/* Current State & Occupant */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Operational Status</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-sm uppercase font-mono text-white">
                  {selectedRoom.status}
                </span>
                <span className="text-xs text-slate-400">({selectedRoom.cleanStatus})</span>
              </div>
              {selectedRoom.currentGuestName && (
                <div className="text-xs text-amber-300 mt-1">
                  Occupant: <span className="font-semibold">{selectedRoom.currentGuestName}</span>
                </div>
              )}
            </div>

            {/* Quick State Switchers */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateRoomStatus(selectedRoom.id, 'available', 'clean')}
                className="px-2.5 py-1 text-xs text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/50 rounded transition-colors"
              >
                Mark Ready
              </button>
              <button
                onClick={() => updateHousekeepingAction(selectedRoom.id)}
                className="px-2.5 py-1 text-xs text-sky-400 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/50 rounded transition-colors"
              >
                Request Clean
              </button>
            </div>
          </div>

          {/* Amenities List */}
          <div>
            <h4 className="font-mono text-[11px] text-slate-400 uppercase tracking-wider mb-2">
              Suite Amenities & Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {selectedRoom.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300 bg-slate-800/40 p-2 rounded border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setSelectedRoom(null)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>

            {selectedRoom.status === 'available' && (
              <button
                onClick={() => {
                  const id = selectedRoom.id;
                  setSelectedRoom(null);
                  setIsNewReservationOpen(true, id);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book This Room</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function updateHousekeepingAction(id: string) {
    updateRoomStatus(id, 'cleaning', 'dirty');
  }
};
