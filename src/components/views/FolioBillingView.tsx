import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Folio, FolioCategory } from '../../types/hotel';
import {
  FileText,
  CreditCard,
  PlusCircle,
  Search,
  CheckCircle,
  Receipt,
  Coffee,
  DollarSign,
  Printer,
} from 'lucide-react';

export const FolioBillingView: React.FC = () => {
  const { folios, setSelectedFolioForInvoice, setSelectedFolioForCharge, settleFolio } = useHotel();

  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'settled'>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolios = folios.filter((f) => {
    const matchesStatus = filterStatus === 'all' || f.status === filterStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      f.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.roomNumber.includes(searchQuery.trim()) ||
      f.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalOutstandingBalance = folios
    .filter((f) => f.status === 'open')
    .reduce((sum, f) => sum + f.balance, 0);

  const totalSettledRevenue = folios
    .reduce((sum, f) => sum + f.totalPayments, 0);

  return (
    <div className="space-y-6">
      {/* Financial Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Total Open Folios</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {folios.filter((f) => f.status === 'open').length}
            </span>
            <span className="text-xs text-slate-400">active guest accounts</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Unsettled Incidentals Balance</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              ${totalOutstandingBalance.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">pending checkout</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] font-medium text-slate-400">Settled Revenue Collected</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              ${totalSettledRevenue.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">processed payments</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
          {(['all', 'open', 'settled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${
                filterStatus === st ? 'bg-slate-700 text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Folios' : `${st} Folios`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Room #, guest, folio ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Folio Ledger Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Folio ID</th>
                <th className="py-3 px-4">Room & Guest</th>
                <th className="py-3 px-4 text-center">Line Items</th>
                <th className="py-3 px-4 text-right">Charges</th>
                <th className="py-3 px-4 text-right">Taxes (10%)</th>
                <th className="py-3 px-4 text-right">Payments</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredFolios.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                    {f.id}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                      <span>{f.guestName}</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-400/90">
                      Room {f.roomNumber}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                    {f.items.length} items
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    ${f.totalCharges.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                    ${f.totalTax.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400">
                    ${f.totalPayments.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        f.balance > 0 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      ${f.balance.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {f.status === 'open' ? (
                      <span className="text-amber-400 font-mono text-xs font-semibold">OPEN</span>
                    ) : (
                      <span className="text-emerald-400 font-mono text-xs font-semibold">SETTLED</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {f.status === 'open' && (
                        <button
                          onClick={() => setSelectedFolioForCharge(f)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/50 rounded transition-colors"
                          title="Post incidental charge"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Post Charge</span>
                        </button>
                      )}

                      {f.status === 'open' && f.balance > 0 && (
                        <button
                          onClick={() => settleFolio(f.id, 'Credit Card (Visa ···· 4242)')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/50 rounded transition-colors"
                          title="Instant Settle Balance"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Settle</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedFolioForInvoice(f)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                        title="View and Print Detailed Invoice"
                      >
                        <FileText className="w-3 h-3 text-amber-400" />
                        <span>Invoice</span>
                      </button>
                    </div>
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
