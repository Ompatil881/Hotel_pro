import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Guest, LoyaltyTier } from '../../types/hotel';
import {
  Search,
  Star,
  Crown,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Coffee,
  Heart,
  Plus,
} from 'lucide-react';

export const GuestCRMView: React.FC = () => {
  const { guests, setIsNewReservationOpen } = useHotel();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<LoyaltyTier | 'all'>('all');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  const filteredGuests = guests.filter((g) => {
    const matchesTier = tierFilter === 'all' || g.loyaltyTier === tierFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.idNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const getTierColor = (tier: LoyaltyTier) => {
    switch (tier) {
      case 'Diamond Elite':
        return 'text-sky-300 font-semibold';
      case 'Platinum':
        return 'text-purple-300 font-semibold';
      case 'Gold':
        return 'text-amber-400 font-semibold';
      case 'Silver':
        return 'text-slate-300 font-semibold';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg overflow-x-auto">
          {(['all', 'Diamond Elite', 'Platinum', 'Gold', 'Silver', 'Standard'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors whitespace-nowrap ${
                tierFilter === t ? 'bg-slate-700 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Tiers' : t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, nationality..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Guest Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuests.map((guest) => (
          <div
            key={guest.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white">{guest.name}</h3>
                    {guest.vip && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1 rounded flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        <span>VIP</span>
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-mono mt-0.5 ${getTierColor(guest.loyaltyTier)}`}>
                    {guest.loyaltyTier} Member
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-mono">Lifetime Spend</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                    ${guest.totalSpend.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{guest.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px] font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-400">
                    {guest.nationality} · {guest.idType}: {guest.idNumber}
                  </span>
                </div>
              </div>

              {/* Preferences Box */}
              {guest.preferences && guest.preferences.length > 0 && (
                <div className="mt-3 p-2 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
                  <div className="text-[10px] text-amber-400/90 font-mono uppercase flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" />
                    <span>Guest Profile Preferences</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-slate-300">
                    {guest.preferences.map((pref, i) => (
                      <span key={i} className="text-slate-300">
                        {pref}{i < guest.preferences.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                {guest.totalStays} completed stay(s)
              </span>

              <button
                onClick={() => setSelectedGuest(guest)}
                className="text-amber-400 hover:text-amber-300 font-medium"
              >
                View Profile & History →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Guest Profile Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-serif">{selectedGuest.name}</h3>
                  {selectedGuest.vip && (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                      VIP
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-amber-400 mt-0.5">
                  {selectedGuest.loyaltyTier} Member · Client ID {selectedGuest.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="text-slate-400">Total Hotel Stays:</span>
                  <div className="font-mono text-base font-bold text-white">{selectedGuest.totalStays}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total Spend (USD):</span>
                  <div className="font-mono text-base font-bold text-emerald-400">
                    ${selectedGuest.totalSpend.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">Primary Contact:</span>
                  <div className="text-slate-200 mt-0.5">{selectedGuest.email} · {selectedGuest.phone}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px]">Identity Document:</span>
                  <div className="text-slate-200 mt-0.5">
                    {selectedGuest.idType}: {selectedGuest.idNumber} ({selectedGuest.nationality})
                  </div>
                </div>
                {selectedGuest.dietaryRestrictions && (
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Dietary Restrictions:</span>
                    <div className="text-amber-300 mt-0.5">{selectedGuest.dietaryRestrictions}</div>
                  </div>
                )}
                {selectedGuest.notes && (
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Concierge Operational Notes:</span>
                    <div className="text-slate-300 bg-slate-800/80 p-2 rounded border border-slate-700 mt-0.5">
                      {selectedGuest.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedGuest(null)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedGuest(null);
                  setIsNewReservationOpen(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
              >
                Create Reservation for Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
