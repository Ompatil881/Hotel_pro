import React from 'react';
import { useHotel } from '../../context/HotelContext';
import { Printer, Check, QrCode, Shield, Download } from 'lucide-react';

export const VoucherModal: React.FC = () => {
  const { selectedBookingForVoucher, setSelectedBookingForVoucher, addToast } = useHotel();

  if (!selectedBookingForVoucher) return null;

  const b = selectedBookingForVoucher;

  const handlePrint = () => {
    window.print();
    addToast('success', 'Print Job Sent', `Voucher for ${b.guestName} sent to default printer.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls (Hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-white text-base">Guest Stay Voucher</span>
            <span className="text-xs font-mono text-amber-400">({b.bookingCode})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={() => setSelectedBookingForVoucher(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Voucher Paper Layout */}
        <div className="mt-4 bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-5 print:bg-white print:text-slate-900 print:border-slate-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="text-xl font-serif font-bold text-white print:text-slate-950">
                The Grand Azure
              </div>
              <div className="text-[11px] font-mono text-amber-400 print:text-amber-700">
                Resort, Residences & Spa
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                100 Ocean Crest Boulevard · Riviera Marina
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-xs uppercase font-bold text-slate-400">
                Booking Reference
              </div>
              <div className="font-mono text-lg font-bold text-amber-400 print:text-amber-700">
                {b.bookingCode}
              </div>
              <div className="text-[10px] text-slate-400">Issued: {b.createdAt}</div>
            </div>
          </div>

          {/* Guest & Room Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Primary Guest</span>
              <div className="font-bold text-sm text-white print:text-slate-950 mt-0.5">{b.guestName}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{b.guestEmail}</div>
              <div className="text-[11px] text-slate-400 font-mono">{b.guestPhone}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Accommodation</span>
              <div className="font-mono font-bold text-base text-amber-400 print:text-amber-800 mt-0.5">
                Room {b.roomNumber}
              </div>
              <div className="text-xs font-medium text-slate-200 print:text-slate-800">{b.roomType}</div>
              <div className="text-[11px] text-slate-400">
                {b.adults} Adult(s), {b.children} Child(ren)
              </div>
            </div>
          </div>

          {/* Dates Strip */}
          <div className="bg-slate-900 print:bg-slate-100 p-3 rounded-lg border border-slate-800 print:border-slate-300 grid grid-cols-3 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Check-In</span>
              <div className="font-bold text-white print:text-slate-950 text-xs mt-0.5">{b.checkInDate}</div>
              <div className="text-[10px] text-slate-400">From 15:00</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Check-Out</span>
              <div className="font-bold text-white print:text-slate-950 text-xs mt-0.5">{b.checkOutDate}</div>
              <div className="text-[10px] text-slate-400">By 12:00</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase">Duration</span>
              <div className="font-bold text-amber-400 print:text-amber-800 text-xs mt-0.5">
                {b.nights} Night(s)
              </div>
              <div className="text-[10px] text-slate-400">${b.nightlyRate}/night</div>
            </div>
          </div>

          {/* Tariff Breakdown */}
          <div className="space-y-1 font-mono text-xs border-t border-slate-800 print:border-slate-300 pt-3">
            <div className="flex justify-between text-slate-400">
              <span>Room Charges ({b.nights} nights @ ${b.nightlyRate})</span>
              <span>${b.subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes & Resort Assessment (10%)</span>
              <span>${b.taxAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white print:text-slate-950 pt-2 border-t border-slate-800 print:border-slate-300">
              <span className="font-sans">Total Guaranteed:</span>
              <span className="text-amber-400 print:text-amber-800">${b.totalAmount}</span>
            </div>
            <div className="flex justify-between text-[11px] text-emerald-400 print:text-emerald-700">
              <span>Paid / Authorized:</span>
              <span>${b.paidAmount} ({b.paymentStatus.toUpperCase()})</span>
            </div>
          </div>

          {/* Barcode & Security verification */}
          <div className="pt-3 border-t border-slate-800 print:border-slate-300 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[10px] font-mono text-slate-400">
                SYSTEM VERIFICATION CODE: HP-AUTH-89210-SHA256
              </div>
              <div className="text-[9px] text-slate-500 max-w-xs">
                Present government-issued photo ID & payment credit card upon arrival. 24h complimentary cancellation applies.
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="text-right">
              <div className="font-mono text-lg tracking-widest text-slate-400 select-none">
                ||||| | |||| ||| ||||| || |||
              </div>
              <div className="text-[9px] font-mono text-slate-500">{b.bookingCode}-VOUCHER</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
