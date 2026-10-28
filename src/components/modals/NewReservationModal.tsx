import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room } from '../../types/hotel';
import { Calendar, User, DollarSign, BedDouble, AlertCircle } from 'lucide-react';

export const NewReservationModal: React.FC = () => {
  const {
    isNewReservationOpen,
    setIsNewReservationOpen,
    preselectedRoomIdForBooking,
    rooms,
    guests,
    createReservation,
  } = useHotel();

  // Filter available rooms or the preselected room
  const availableRooms = rooms.filter(
    (r) => r.status === 'available' || r.id === preselectedRoomIdForBooking
  );

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    preselectedRoomIdForBooking || (availableRooms[0]?.id ?? '')
  );
  const [selectedGuestMode, setSelectedGuestMode] = useState<'existing' | 'new'>('existing');
  const [existingGuestId, setExistingGuestId] = useState<string>(guests[0]?.id ?? '');

  // New guest fields
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Dates
  const [checkInDate, setCheckInDate] = useState('2026-10-28');
  const [checkOutDate, setCheckOutDate] = useState('2026-10-31');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [payOption, setPayOption] = useState<'full' | 'deposit' | 'later'>('full');

  useEffect(() => {
    if (preselectedRoomIdForBooking) {
      setSelectedRoomId(preselectedRoomIdForBooking);
    } else if (availableRooms.length > 0 && !availableRooms.some((r) => r.id === selectedRoomId)) {
      setSelectedRoomId(availableRooms[0].id);
    }
  }, [preselectedRoomIdForBooking, availableRooms, selectedRoomId]);

  if (!isNewReservationOpen) return null;

  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || availableRooms[0];

  // Calculate nights
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = d2.getTime() - d1.getTime();
  const calculatedNights = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)));

  const nightlyRate = currentRoom ? currentRoom.baseRate : 280;
  const subtotal = nightlyRate * calculatedNights;
  const taxAmount = Math.round(subtotal * 0.1);
  const totalAmount = subtotal + taxAmount;

  const paidAmount =
    payOption === 'full' ? totalAmount : payOption === 'deposit' ? Math.round(totalAmount * 0.5) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom) return;

    let finalGuestName = guestName;
    let finalGuestEmail = guestEmail;
    let finalGuestPhone = guestPhone;
    let finalGuestId = `gst_${Date.now()}`;

    if (selectedGuestMode === 'existing') {
      const g = guests.find((x) => x.id === existingGuestId) || guests[0];
      finalGuestName = g.name;
      finalGuestEmail = g.email;
      finalGuestPhone = g.phone;
      finalGuestId = g.id;
    }

    createReservation({
      guestId: finalGuestId,
      guestName: finalGuestName || 'Valued Guest',
      guestEmail: finalGuestEmail || 'guest@example.com',
      guestPhone: finalGuestPhone || '+1 (555) 000-0000',
      roomId: currentRoom.id,
      roomNumber: currentRoom.number,
      roomType: currentRoom.type,
      checkInDate,
      checkOutDate,
      nights: calculatedNights,
      adults,
      children,
      nightlyRate,
      paidAmount,
      paymentStatus: payOption === 'full' ? 'paid' : payOption === 'deposit' ? 'partial' : 'pending',
      specialRequests: specialRequests.trim() || undefined,
      source: 'Direct Web',
    });

    setIsNewReservationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white font-serif">New Hotel Reservation</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Create an instant booking with real-time rate & folio calculation.
            </p>
          </div>
          <button
            onClick={() => setIsNewReservationOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Room Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Select Room & Category</label>
            {availableRooms.length === 0 ? (
              <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No rooms are currently listed as Available. Please change room status first.</span>
              </div>
            ) : (
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Room {r.number} · {r.type} (${r.baseRate}/night) · {r.bedType} · Fl {r.floor}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Dates & Guests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Check-In Date</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Check-Out Date</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Adults</label>
              <input
                type="number"
                min={1}
                max={6}
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Children</label>
              <input
                type="number"
                min={0}
                max={4}
                value={children}
                onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Guest Selection (Existing CRM vs New Guest) */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-medium">Guest Assignment</label>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded">
                <button
                  type="button"
                  onClick={() => setSelectedGuestMode('existing')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    selectedGuestMode === 'existing'
                      ? 'bg-slate-700 text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  Existing CRM Guest
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGuestMode('new')}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    selectedGuestMode === 'new'
                      ? 'bg-slate-700 text-amber-400 font-semibold'
                      : 'text-slate-400'
                  }`}
                >
                  New Guest Entry
                </button>
              </div>
            </div>

            {selectedGuestMode === 'existing' ? (
              <select
                value={existingGuestId}
                onChange={(e) => setExistingGuestId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.loyaltyTier}) · {g.email}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  required={selectedGuestMode === 'new'}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  required={selectedGuestMode === 'new'}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  required={selectedGuestMode === 'new'}
                />
              </div>
            )}
          </div>

          {/* Payment Option */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Billing & Settlement Terms</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayOption('full')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  payOption === 'full'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                <div>Pay Full Upfront</div>
                <div className="font-mono text-[11px] mt-0.5">${totalAmount}</div>
              </button>

              <button
                type="button"
                onClick={() => setPayOption('deposit')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  payOption === 'deposit'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                <div>50% Deposit</div>
                <div className="font-mono text-[11px] mt-0.5">${Math.round(totalAmount * 0.5)}</div>
              </button>

              <button
                type="button"
                onClick={() => setPayOption('later')}
                className={`p-2 rounded-lg border text-center transition-colors ${
                  payOption === 'later'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-semibold'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400'
                }`}
              >
                <div>Pay on Arrival</div>
                <div className="font-mono text-[11px] mt-0.5">$0 now</div>
              </button>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Guest Special Requests</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Early check-in 13:00, high floor, anniversary setup..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Rate Breakdown Box */}
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1 font-mono">
            <div className="flex justify-between text-slate-400">
              <span>
                Nightly Tariff ({calculatedNights} nights × ${nightlyRate})
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hospitality & Resort Tax (10%)</span>
              <span>${taxAmount}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-slate-800">
              <span className="font-sans">Total Reservation Cost:</span>
              <span className="text-amber-400">${totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewReservationOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableRooms.length === 0}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg shadow-sm"
            >
              Confirm Reservation & Post Folio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
