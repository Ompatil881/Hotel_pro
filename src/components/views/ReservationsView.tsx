import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Booking, BookingStatus } from '../../types/hotel';
import {
  Search,
  Calendar,
  List,
  FileText,
  Key,
  LogIn,
  LogOut,
  XCircle,
  Plus,
} from 'lucide-react';

export const ReservationsView: React.FC = () => {
  const {
    bookings,
    rooms,
    setSelectedBookingForVoucher,
    setSelectedBookingForKeyCard,
    checkInGuest,
    setSelectedBookingForCheckOut,
    cancelBooking,
    setIsNewReservationOpen,
  } = useHotel();

  const [viewMode, setViewMode] = useState<'table' | 'gantt'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.roomNumber.includes(searchQuery.trim()) ||
      b.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calendar dates for Gantt view: Oct 25 to Nov 4, 2026
  const timelineDates = [
    '2026-10-25',
    '2026-10-26',
    '2026-10-27',
    '2026-10-28', // Today
    '2026-10-29',
    '2026-10-30',
    '2026-10-31',
    '2026-11-01',
    '2026-11-02',
    '2026-11-03',
  ];

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="text-amber-400 font-mono text-xs font-semibold">CONFIRMED</span>;
      case 'checked_in':
        return <span className="text-emerald-400 font-mono text-xs font-semibold">CHECKED-IN</span>;
      case 'checked_out':
        return <span className="text-slate-400 font-mono text-xs font-semibold">CHECKED-OUT</span>;
      case 'cancelled':
        return <span className="text-rose-400 font-mono text-xs font-semibold">CANCELLED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-slate-700 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Bookings Table</span>
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'gantt' ? 'bg-slate-700 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timeline Matrix</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg overflow-x-auto">
            {(['all', 'confirmed', 'checked_in', 'checked_out', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors whitespace-nowrap ${
                  statusFilter === st ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Search & New Booking CTA */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, guest, room..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={() => setIsNewReservationOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Booking</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Room & Type</th>
                  <th className="py-3 px-4">Stay Dates</th>
                  <th className="py-3 px-4 text-right">Tariff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Keycard</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Booking Code */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-400 whitespace-nowrap">
                      {b.bookingCode}
                    </td>

                    {/* Guest Name & contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{b.guestName}</div>
                      <div className="text-[11px] text-slate-400">{b.guestEmail}</div>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-slate-200">
                        Room {b.roomNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">{b.roomType}</div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-slate-200">
                        {b.checkInDate} <span className="text-slate-500">→</span> {b.checkOutDate}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {b.nights} night(s) · {b.adults} Ad / {b.children} Ch
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-100 tabular-nums">
                        ${b.totalAmount}
                      </div>
                      <div className="text-[10px] uppercase font-mono font-semibold">
                        {b.paymentStatus === 'paid' ? (
                          <span className="text-emerald-400">Paid in Full</span>
                        ) : b.paymentStatus === 'partial' ? (
                          <span className="text-amber-400">Part Paid (${b.paidAmount})</span>
                        ) : (
                          <span className="text-rose-400">Pending</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusText(b.status)}
                    </td>

                    {/* Keycard */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {b.keyCardIssued ? (
                        <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                          <Key className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedBookingForKeyCard(b)}
                          className="text-[11px] text-amber-400/90 hover:text-amber-300 font-mono flex items-center gap-1 underline underline-offset-2"
                        >
                          <Key className="w-3 h-3" />
                          <span>Encode Key</span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Voucher */}
                        <button
                          onClick={() => setSelectedBookingForVoucher(b)}
                          title="View Registration Voucher"
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Check-In */}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => checkInGuest(b.id)}
                            title="Check-In Guest"
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 rounded transition-colors"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {/* Check-Out */}
                        {b.status === 'checked_in' && (
                          <button
                            onClick={() => setSelectedBookingForCheckOut(b)}
                            title="Check-Out Guest & Settle Folio"
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/60 rounded transition-colors"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {/* Cancel */}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => cancelBooking(b.id)}
                            title="Cancel Reservation"
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Gantt / Timeline Matrix View */
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 overflow-x-auto shadow-xl">
          <div className="min-w-[900px]">
            {/* Timeline Header */}
            <div className="grid grid-cols-12 gap-1 pb-3 border-b border-slate-800 text-xs font-mono">
              <div className="col-span-2 text-slate-400 uppercase tracking-wider font-semibold">
                Room / Category
              </div>
              {timelineDates.map((d) => (
                <div
                  key={d}
                  className={`text-center py-1 rounded ${
                    d === '2026-10-28' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
                  }`}
                >
                  <div className="text-[10px] uppercase">{new Date(d).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  <div className="text-xs">{d.substring(8)} Oct</div>
                </div>
              ))}
            </div>

            {/* Room Rows in Gantt */}
            <div className="divide-y divide-slate-800/60 mt-2">
              {rooms.map((room) => {
                const roomBookings = bookings.filter(
                  (b) => b.roomId === room.id || b.roomNumber === room.number
                );

                return (
                  <div key={room.id} className="grid grid-cols-12 gap-1 py-2 items-center hover:bg-slate-800/30">
                    <div className="col-span-2">
                      <div className="font-mono font-bold text-slate-200">
                        {room.number}
                        <span className="text-[10px] text-slate-400 font-sans ml-1.5">({room.type.split(' ')[0]})</span>
                      </div>
                      <div className="text-[10px] text-amber-400/80 font-mono">${room.baseRate}/nt</div>
                    </div>

                    {/* Timeline Cells */}
                    {timelineDates.map((date) => {
                      const activeBooking = roomBookings.find(
                        (b) => date >= b.checkInDate && date < b.checkOutDate && b.status !== 'cancelled'
                      );

                      if (activeBooking) {
                        const isStart = activeBooking.checkInDate === date;
                        const isCheckedIn = activeBooking.status === 'checked_in';

                        return (
                          <div
                            key={date}
                            onClick={() => setSelectedBookingForVoucher(activeBooking)}
                            className={`h-9 rounded flex items-center justify-center p-1 text-[10px] font-medium cursor-pointer transition-transform hover:scale-105 ${
                              isCheckedIn
                                ? 'bg-emerald-600/80 text-white'
                                : 'bg-amber-600/80 text-white'
                            }`}
                            title={`${activeBooking.guestName} (${activeBooking.bookingCode})`}
                          >
                            <span className="truncate">{isStart ? activeBooking.guestName.split(' ')[0] : '···'}</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={date}
                          onClick={() => setIsNewReservationOpen(true, room.id)}
                          className="h-9 rounded border border-dashed border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors flex items-center justify-center cursor-pointer group"
                          title={`Click to book Room ${room.number} for ${date}`}
                        >
                          <span className="text-[10px] text-slate-600 group-hover:text-amber-400 font-mono">+</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
