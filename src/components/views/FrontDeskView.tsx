import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  LogIn,
  LogOut,
  Key,
  CreditCard,
  PlusCircle,
  FileText,
  UserCheck,
  Search,
  Phone,
  Mail,
  ShieldCheck,
  Coffee,
} from 'lucide-react';

export const FrontDeskView: React.FC = () => {
  const {
    bookings,
    folios,
    checkInGuest,
    setSelectedBookingForCheckOut,
    setSelectedBookingForKeyCard,
    setSelectedFolioForInvoice,
    setSelectedFolioForCharge,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'arrivals' | 'departures' | 'inhouse'>('arrivals');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = '2026-10-28';

  // Arrivals: Confirmed bookings checking in on or before today
  const arrivalsList = bookings.filter(
    (b) => b.checkInDate <= todayStr && b.status === 'confirmed'
  );

  // Departures: In-house guests scheduled to depart on or before today
  const departuresList = bookings.filter(
    (b) => b.checkOutDate <= todayStr && b.status === 'checked_in'
  );

  // Currently In-House: All active checked-in guests
  const inHouseList = bookings.filter((b) => b.status === 'checked_in');

  const filteredInHouse = inHouseList.filter((b) =>
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.roomNumber.includes(searchQuery.trim()) ||
    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Front Desk Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'arrivals'
                ? 'bg-slate-700 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Today's Arrivals</span>
            <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              {arrivalsList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('departures')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'departures'
                ? 'bg-slate-700 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Today's Departures</span>
            <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
              {departuresList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inhouse')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'inhouse'
                ? 'bg-slate-700 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Currently In-House</span>
            <span className="font-mono text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold">
              {inHouseList.length}
            </span>
          </button>
        </div>

        {activeTab === 'inhouse' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in-house guest..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Arrivals Queue */}
      {activeTab === 'arrivals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Awaiting arrival confirmation & RFID keycard issuance</span>
            <span className="font-mono">Default Check-in Policy: 15:00 onwards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arrivalsList.map((booking) => (
              <div
                key={booking.id}
                className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-amber-400 font-semibold">{booking.bookingCode}</div>
                      <h3 className="text-base font-bold text-white mt-0.5">{booking.guestName}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl font-bold text-white tabular-nums">
                        Rm {booking.roomNumber}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">{booking.roomType}</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{booking.guestEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{booking.guestPhone}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
                    <div className="text-[10px] text-slate-400 font-mono uppercase">Stay Duration & Bill</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-200">
                        {booking.nights} night(s) · {booking.checkInDate} to {booking.checkOutDate}
                      </span>
                      <span className="font-mono font-bold text-amber-300">${booking.totalAmount}</span>
                    </div>
                    {booking.specialRequests && (
                      <div className="mt-1 pt-1 border-t border-slate-700/60 text-[11px] text-amber-200/90 italic">
                        "{booking.specialRequests}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedBookingForKeyCard(booking)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40 rounded-lg transition-colors"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Encode Keycard</span>
                  </button>

                  <button
                    onClick={() => checkInGuest(booking.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Confirm Check-In</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {arrivalsList.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-200">All arrivals for today are checked in!</p>
              <p className="text-xs text-slate-400 mt-1">No pending arrivals remain in the reception queue.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Departures Queue */}
      {activeTab === 'departures' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Scheduled for checkout today (Oct 28) - Folio settlement required</span>
            <span className="font-mono">Standard Check-out: 12:00 PM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departuresList.map((booking) => {
              const folio = folios.find((f) => f.bookingId === booking.id);
              const balanceDue = folio ? folio.balance : 0;

              return (
                <div
                  key={booking.id}
                  className="bg-slate-900/70 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-rose-400 font-semibold">{booking.bookingCode}</div>
                        <h3 className="text-base font-bold text-white mt-0.5">{booking.guestName}</h3>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xl font-bold text-white tabular-nums">
                          Rm {booking.roomNumber}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">{booking.roomType}</div>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total Charges:</span>
                        <span className="font-mono text-slate-200">${folio?.totalCharges || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Taxes & Fees (10%):</span>
                        <span className="font-mono text-slate-200">${folio?.totalTax || 0}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-700 font-semibold">
                        <span className="text-slate-300">Remaining Balance:</span>
                        <span
                          className={`font-mono text-sm tabular-nums ${
                            balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          ${balanceDue.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    {folio && (
                      <button
                        onClick={() => setSelectedFolioForInvoice(folio)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Folio</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedBookingForCheckOut(booking)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-lg transition-colors shadow-sm ml-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Settle & Check-Out</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {departuresList.length === 0 && (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-400">No remaining departures scheduled for today.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Currently In-House Roster */}
      {activeTab === 'inhouse' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Stay Timeline</th>
                  <th className="py-3 px-4">Key Status</th>
                  <th className="py-3 px-4 text-right">Active Balance</th>
                  <th className="py-3 px-4 text-right">Quick Front Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredInHouse.map((b) => {
                  const folio = folios.find((f) => f.bookingId === b.id);
                  const balance = folio ? folio.balance : 0;

                  return (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        {b.roomNumber}
                        <div className="text-[10px] text-slate-400 font-sans font-normal">{b.roomType}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{b.guestName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{b.bookingCode}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-200">
                          {b.checkInDate} <span className="text-slate-500">→</span> {b.checkOutDate}
                        </div>
                        <div className="text-[11px] text-slate-400">{b.nights} night(s)</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-emerald-400 font-mono text-xs flex items-center gap-1">
                          <Key className="w-3.5 h-3.5" />
                          <span>Active RFID</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono tabular-nums">
                        <span className={`font-bold ${balance > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                          ${balance.toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {folio && (
                            <button
                              onClick={() => setSelectedFolioForCharge(folio)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/50 rounded transition-colors"
                              title="Post Dining, Mini-bar, Spa charge"
                            >
                              <Coffee className="w-3 h-3" />
                              <span>+ Add Charge</span>
                            </button>
                          )}

                          {folio && (
                            <button
                              onClick={() => setSelectedFolioForInvoice(folio)}
                              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                              title="View Folio Statement"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedBookingForCheckOut(b)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/50 rounded transition-colors"
                            title="Process Guest Departure"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Depart</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
