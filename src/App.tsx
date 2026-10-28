import React from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Navbar } from './components/Navbar';
import { HeroStats } from './components/HeroStats';
import { ToastContainer } from './components/ToastContainer';
import { RoomMatrixView } from './components/views/RoomMatrixView';
import { ReservationsView } from './components/views/ReservationsView';
import { FrontDeskView } from './components/views/FrontDeskView';
import { FolioBillingView } from './components/views/FolioBillingView';
import { HousekeepingView } from './components/views/HousekeepingView';
import { GuestCRMView } from './components/views/GuestCRMView';
import { AnalyticsView } from './components/views/AnalyticsView';

// Modals
import { NewReservationModal } from './components/modals/NewReservationModal';
import { RoomDetailsModal } from './components/modals/RoomDetailsModal';
import { VoucherModal } from './components/modals/VoucherModal';
import { KeycardModal } from './components/modals/KeycardModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { EpicsTasksModal } from './components/modals/EpicsTasksModal';
import { ApiMongoExplorerModal } from './components/modals/ApiMongoExplorerModal';

const MainHotelApp: React.FC = () => {
  const { activeView, setIsEpicsModalOpen, setIsApiExplorerOpen } = useHotel();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* KPI Strip & Hotel Showcase Header */}
        <HeroStats />

        {/* Dynamic Views */}
        {activeView === 'matrix' && <RoomMatrixView />}
        {activeView === 'reservations' && <ReservationsView />}
        {activeView === 'front_desk' && <FrontDeskView />}
        {activeView === 'folios' && <FolioBillingView />}
        {activeView === 'housekeeping' && <HousekeepingView />}
        {activeView === 'guests' && <GuestCRMView />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>

      {/* Universal Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-300">HotelPro Enterprise</span>
            <span aria-hidden="true">·</span>
            <span>The Grand Azure Hotel & Residences</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-500">v4.2.0</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEpicsModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              6 Epics & 19 Tasks
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsApiExplorerOpen(true)}
              className="hover:text-sky-400 transition-colors font-mono"
            >
              Express API & MongoDB Explorer
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <NewReservationModal />
      <RoomDetailsModal />
      <VoucherModal />
      <KeycardModal />
      <InvoiceModal />
      <EpicsTasksModal />
      <ApiMongoExplorerModal />

      {/* Real-time Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainHotelApp />
    </HotelProvider>
  );
}
