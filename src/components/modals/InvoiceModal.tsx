import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { FolioCategory } from '../../types/hotel';
import { Printer, CreditCard, PlusCircle, CheckCircle, Receipt, DollarSign } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const {
    selectedFolioForInvoice,
    setSelectedFolioForInvoice,
    addFolioCharge,
    settleFolio,
    addToast,
  } = useHotel();

  const [showAddCharge, setShowAddCharge] = useState(false);
  const [chargeCategory, setChargeCategory] = useState<FolioCategory>('Dining & Lounge');
  const [chargeDescription, setChargeDescription] = useState('');
  const [chargeAmount, setChargeAmount] = useState('45.00');
  const [paymentMethod, setPaymentMethod] = useState('Corporate Amex ···· 9821');

  if (!selectedFolioForInvoice) return null;

  const f = selectedFolioForInvoice;

  const handlePostCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(chargeAmount) || 0;
    if (amt <= 0) return;

    addFolioCharge(f.id, {
      category: chargeCategory,
      description: chargeDescription || `${chargeCategory} incidental charge`,
      amount: amt,
    });

    setChargeDescription('');
    setChargeAmount('45.00');
    setShowAddCharge(false);
  };

  const handleSettle = () => {
    settleFolio(f.id, paymentMethod);
    addToast('success', 'Folio Settled', `Folio for Room ${f.roomNumber} balanced with ${paymentMethod}.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Controls bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-white text-base">Guest Folio & Official Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setSelectedFolioForInvoice(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="mt-4 bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-5 print:bg-white print:text-slate-900 print:border-slate-300">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="text-xl font-serif font-bold text-white print:text-slate-950">
                The Grand Azure Resort
              </div>
              <div className="text-[11px] font-mono text-amber-400 print:text-amber-800">
                Tax Invoice & Guest Statement
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                VAT Reg: AZR-992014-EU · Riviera Marina 100
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] uppercase text-slate-400 font-bold">Folio Number</div>
              <div className="font-mono text-base font-bold text-amber-400 print:text-amber-800">{f.id}</div>
              <div className="text-[10px] text-slate-400">Date: {new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          {/* Guest and Room Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Guest Name</span>
              <div className="font-bold text-sm text-white print:text-slate-950 mt-0.5">{f.guestName}</div>
              <div className="text-[11px] text-slate-400">Guest ID: {f.guestId}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Room Billed</span>
              <div className="font-mono font-bold text-base text-amber-400 print:text-amber-800 mt-0.5">
                Room {f.roomNumber}
              </div>
              <div className="text-[11px] text-slate-400">Booking Ref: {f.bookingId}</div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 font-mono text-slate-400 uppercase text-[10px]">
                  <th className="py-2">Date</th>
                  <th className="py-2">Department / Category</th>
                  <th className="py-2">Description</th>
                  <th className="py-2 text-right">Net</th>
                  <th className="py-2 text-right">Tax (10%)</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {f.items.map((item) => (
                  <tr key={item.id} className="font-mono text-[11px]">
                    <td className="py-2 text-slate-400">{item.date}</td>
                    <td className="py-2 text-amber-300/90 print:text-amber-900 font-sans font-medium">
                      {item.category}
                    </td>
                    <td className="py-2 text-slate-200 print:text-slate-800 font-sans">{item.description}</td>
                    <td className="py-2 text-right text-slate-400">${item.amount.toFixed(2)}</td>
                    <td className="py-2 text-right text-slate-400">${item.tax.toFixed(2)}</td>
                    <td className="py-2 text-right font-bold text-slate-100 print:text-slate-950">
                      ${(item.amount + item.tax).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="border-t border-slate-800 print:border-slate-300 pt-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Net Charges:</span>
              <span>${f.totalCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Value Added Tax (VAT 10%):</span>
              <span>${f.totalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Total Payments & Deposits Received:</span>
              <span className="text-emerald-400 print:text-emerald-800">-${f.totalPayments.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white print:text-slate-950 pt-2 border-t border-slate-800 print:border-slate-300">
              <span className="font-sans">Balance Payable / Outstanding:</span>
              <span className={`font-mono ${f.balance > 0 ? 'text-amber-400 print:text-amber-800' : 'text-emerald-400'}`}>
                ${f.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Add Incidental Section (Hidden in print) */}
        <div className="mt-4 print:hidden space-y-3">
          {showAddCharge ? (
            <form onSubmit={handlePostCharge} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300">Post New Incidental to Room {f.roomNumber}</span>
                <button
                  type="button"
                  onClick={() => setShowAddCharge(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={chargeCategory}
                  onChange={(e) => setChargeCategory(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                >
                  <option value="Dining & Lounge">Dining & Lounge</option>
                  <option value="Mini-Bar">Mini-Bar</option>
                  <option value="Spa & Wellness">Spa & Wellness</option>
                  <option value="Laundry & Valet">Laundry & Valet</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                </select>

                <input
                  type="text"
                  placeholder="Charge description..."
                  value={chargeDescription}
                  onChange={(e) => setChargeDescription(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs"
                  required
                />

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-mono">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="Amount"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-400 text-slate-950 font-semibold rounded text-xs whitespace-nowrap"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAddCharge(true)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Post New Incidental Charge</span>
              </button>

              {f.balance > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs font-mono"
                  >
                    <option value="Corporate Amex ···· 9821">Corporate Amex ···· 9821</option>
                    <option value="Visa Platinum ···· 4242">Visa Platinum ···· 4242</option>
                    <option value="Mastercard World ···· 1089">Mastercard World ···· 1089</option>
                    <option value="Wire Transfer / Direct Settle">Wire Transfer / Direct Settle</option>
                    <option value="Cash at Front Desk">Cash at Front Desk</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleSettle}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm whitespace-nowrap"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Settle Balance (${f.balance.toFixed(2)})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
