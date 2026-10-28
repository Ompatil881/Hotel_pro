import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Key, Wifi, Shield, CheckCircle2, Lock } from 'lucide-react';

export const KeycardModal: React.FC = () => {
  const {
    selectedBookingForKeyCard,
    setSelectedBookingForKeyCard,
    issueKeyCard,
  } = useHotel();

  const [isEncoding, setIsEncoding] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!selectedBookingForKeyCard) return null;

  const b = selectedBookingForKeyCard;

  const handleEncode = () => {
    setIsEncoding(true);
    setTimeout(() => {
      setIsEncoding(false);
      setIsSuccess(true);
      issueKeyCard(b.id);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedBookingForKeyCard(null);
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-serif">RFID Keycard Encoder</h3>
          </div>
          <button
            onClick={() => setSelectedBookingForKeyCard(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Realistic Hotel Digital Keycard Visual */}
        <div className="mt-5 relative w-full h-52 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 p-5 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* NFC Wave & Chip */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-600 to-amber-300 border border-amber-400/50 flex items-center justify-center shadow-inner">
              <div className="w-6 h-4 border border-amber-700/60 rounded-[2px]" />
            </div>
            <Wifi className="w-5 h-5 text-amber-400 rotate-90" />
          </div>

          {/* Middle: Hotel Name */}
          <div>
            <div className="font-serif text-lg font-bold text-white tracking-widest uppercase">
              The Grand Azure
            </div>
            <div className="text-[10px] font-mono text-amber-400 tracking-wider uppercase">
              Smart Access Card · 13.56 MHz RFID
            </div>
          </div>

          {/* Bottom: Guest & Room */}
          <div className="flex items-end justify-between border-t border-slate-800 pt-2">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">Guest Access</div>
              <div className="text-xs font-semibold text-slate-100 truncate max-w-[170px]">
                {b.guestName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Assigned Room</div>
              <div className="font-mono text-xl font-bold text-amber-300 tabular-nums">
                {b.roomNumber}
              </div>
            </div>
          </div>

          {/* Background subtle watermark texture */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border border-amber-500/10 pointer-events-none" />
        </div>

        {/* Permissions & Security details */}
        <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Valid Period:</span>
            <span className="text-slate-200">{b.checkInDate} to {b.checkOutDate}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Access Zones:</span>
            <span className="text-emerald-400">Room {b.roomNumber}, Elevator, Fitness, Pool</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>NFC Cipher:</span>
            <span className="text-slate-300">AES-128 Encryption</span>
          </div>
        </div>

        {/* Encode Action */}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedBookingForKeyCard(null)}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleEncode}
            disabled={isEncoding || isSuccess}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow-sm"
          >
            {isEncoding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Writing to Chip...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Keycard Active!</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span>Encode & Issue Keycard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
