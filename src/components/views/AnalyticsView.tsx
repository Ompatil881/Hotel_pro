import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  TrendingUp,
  Download,
  Calendar,
  Building,
  Users,
  Compass,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { rooms, bookings, folios, addToast } = useHotel();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;
  const occupancyRate = Math.round((occupiedRooms / (totalRooms || 1)) * 100);

  const occupiedSum = rooms
    .filter((r) => r.status === 'occupied')
    .reduce((sum, r) => sum + r.baseRate, 0);

  const adr = occupiedRooms > 0 ? Math.round(occupiedSum / occupiedRooms) : 340;
  const revPar = Math.round(occupiedSum / (totalRooms || 1));

  const totalRevenue = folios.reduce((sum, f) => sum + f.totalCharges + f.totalTax, 0);
  const totalIncidentals = folios.reduce(
    (sum, f) =>
      sum +
      f.items
        .filter((i) => i.category !== 'Room Rate')
        .reduce((s, i) => s + i.amount, 0),
    0
  );

  // Group performance by room type
  const roomTypes = ['Deluxe Room', 'Executive Suite', 'Ocean Villa', 'Presidential Suite', 'Penthouse Suite'] as const;
  const roomTypeMetrics = roomTypes.map((type) => {
    const matchingRooms = rooms.filter((r) => r.type === type);
    const count = matchingRooms.length;
    const occupiedCount = matchingRooms.filter((r) => r.status === 'occupied').length;
    const occPercent = count > 0 ? Math.round((occupiedCount / count) * 100) : 0;
    const avgBase = count > 0 ? Math.round(matchingRooms.reduce((s, r) => s + r.baseRate, 0) / count) : 0;
    const totalRev = matchingRooms
      .filter((r) => r.status === 'occupied')
      .reduce((s, r) => s + r.baseRate, 0);

    return {
      type,
      count,
      occupiedCount,
      occPercent,
      avgBase,
      totalRev,
    };
  });

  const exportReportCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Unit'],
      ['Total Property Rooms', totalRooms.toString(), 'Rooms'],
      ['Occupied Rooms', occupiedRooms.toString(), 'Rooms'],
      ['Occupancy Rate', `${occupancyRate}%`, 'Percentage'],
      ['Average Daily Rate (ADR)', `$${adr}`, 'USD'],
      ['RevPAR', `$${revPar}`, 'USD'],
      ['Total Folio Revenue', `$${totalRevenue.toFixed(2)}`, 'USD'],
      ['Incidental / POS Sales', `$${totalIncidentals.toFixed(2)}`, 'USD'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HotelPro_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Report Exported', 'Executive RevPAR & Occupancy report downloaded as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div>
          <h2 className="text-lg font-serif font-bold text-white">Revenue & Yield Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Key hospitality metrics including RevPAR, ADR, and category yield optimizations.
          </p>
        </div>

        <button
          onClick={exportReportCSV}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Occupancy Rate</span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">+4.2% vs target</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-white tabular-nums">
            {occupancyRate}%
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {occupiedRooms} of {totalRooms} rooms occupied today
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Daily Rate (ADR)</span>
            <span className="font-mono text-amber-400 text-[11px] font-bold">Yield +12%</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-amber-400 tabular-nums">
            ${adr}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Weighted across occupied premium suites
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>RevPAR Performance</span>
            <span className="font-mono text-emerald-400 text-[11px] font-bold">Strong</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            ${revPar}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Occupancy × ADR revenue metric
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Non-Room Incidentals</span>
            <span className="font-mono text-sky-400 text-[11px] font-bold">Dining & Spa</span>
          </div>
          <div className="mt-2 text-3xl font-bold font-mono text-sky-400 tabular-nums">
            ${totalIncidentals.toFixed(0)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Restaurant, Mini-bar & Spa folio postings
          </div>
        </div>
      </div>

      {/* Yield by Category Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white font-serif mb-4 flex items-center justify-between">
          <span>Room Category Performance & Inventory Distribution</span>
          <span className="text-xs font-mono text-slate-400 font-normal">Active Property Snapshot</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="py-2.5 px-3">Room Category</th>
                <th className="py-2.5 px-3 text-center">Total Inventory</th>
                <th className="py-2.5 px-3 text-center">Occupied</th>
                <th className="py-2.5 px-3 text-center">Category Occ %</th>
                <th className="py-2.5 px-3 text-right">Avg Nightly Rate</th>
                <th className="py-2.5 px-3 text-right">Today's Room Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {roomTypeMetrics.map((item) => (
                <tr key={item.type} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-semibold text-slate-200">{item.type}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{item.count}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300 font-bold">{item.occupiedCount}</td>
                  <td className="py-3 px-3 text-center font-mono">
                    <span className={item.occPercent > 50 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {item.occPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-amber-300">
                    ${item.avgBase}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-white">
                    ${item.totalRev}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
