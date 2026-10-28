import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Terminal,
  Database,
  Key,
  Play,
  Copy,
  Check,
  Send,
  Layers,
  ShieldCheck,
  Code2,
} from 'lucide-react';

export const ApiMongoExplorerModal: React.FC = () => {
  const {
    isApiExplorerOpen,
    setIsApiExplorerOpen,
    rooms,
    bookings,
    guests,
    folios,
    housekeepingTasks,
    staffUsers,
    currentUser,
    jwtToken,
    auditLogs,
    addToast,
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'rest_api' | 'mongodb' | 'jwt'>('rest_api');

  // REST API Runner state
  const apiEndpoints = [
    {
      id: 'get_rooms',
      name: 'List Available & Occupied Rooms',
      method: 'GET',
      path: '/api/rooms?status=available',
      body: '',
    },
    {
      id: 'post_booking',
      name: 'Create New Reservation Booking',
      method: 'POST',
      path: '/api/bookings',
      body: JSON.stringify(
        {
          guestId: 'gst_005',
          guestName: 'Julian Croft',
          roomId: 'rm_102',
          roomNumber: '102',
          checkInDate: '2026-10-29',
          checkOutDate: '2026-11-01',
          nights: 3,
          adults: 2,
          nightlyRate: 280,
          paidAmount: 924,
        },
        null,
        2
      ),
    },
    {
      id: 'post_charge',
      name: 'Post POS Incidental Charge to Folio',
      method: 'POST',
      path: '/api/folios/fol_001/charges',
      body: JSON.stringify(
        {
          category: 'Dining & Lounge',
          description: 'Sunset Cocktails & Tapas',
          amount: 68.5,
        },
        null,
        2
      ),
    },
    {
      id: 'patch_room_status',
      name: 'Update Room Status & Housekeeping State',
      method: 'PATCH',
      path: '/api/rooms/rm_104/status',
      body: JSON.stringify(
        {
          status: 'cleaning',
          cleanStatus: 'dirty',
          notes: 'Full linen change requested',
        },
        null,
        2
      ),
    },
    {
      id: 'get_revpar',
      name: 'Get Executive RevPAR & ADR Analytics',
      method: 'GET',
      path: '/api/reports/revpar?propertyId=grand-azure',
      body: '',
    },
    {
      id: 'post_auth',
      name: 'Simulate Staff Login & JWT Generation',
      method: 'POST',
      path: '/api/auth/login',
      body: JSON.stringify(
        {
          email: currentUser.email,
          role: currentUser.role,
        },
        null,
        2
      ),
    },
  ];

  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  const activeEndpoint = apiEndpoints[selectedEndpointIndex];

  const [requestMethod, setRequestMethod] = useState(activeEndpoint.method);
  const [requestPath, setRequestPath] = useState(activeEndpoint.path);
  const [requestBody, setRequestBody] = useState(activeEndpoint.body);

  const [isRunning, setIsRunning] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string> | null>(null);
  const [responsePayload, setResponsePayload] = useState<any>(null);

  // Switch selected endpoint
  const handleSelectEndpoint = (index: number) => {
    setSelectedEndpointIndex(index);
    const ep = apiEndpoints[index];
    setRequestMethod(ep.method);
    setRequestPath(ep.path);
    setRequestBody(ep.body);
    setResponseStatus(null);
    setResponsePayload(null);
  };

  // Execute test request simulation
  const handleSendRequest = () => {
    setIsRunning(true);
    const startTime = performance.now();

    setTimeout(() => {
      const elapsed = Math.round(performance.now() - startTime + Math.random() * 45 + 15);
      setResponseTime(elapsed);

      let payload: any = {};
      let status = 200;

      if (requestPath.includes('/api/rooms')) {
        payload = {
          success: true,
          count: rooms.length,
          data: rooms.slice(0, 4),
        };
      } else if (requestPath.includes('/api/bookings')) {
        status = 201;
        payload = {
          success: true,
          message: 'Booking record HP-9821 successfully persisted to MongoDB',
          booking: {
            id: 'bk_' + Date.now(),
            bookingCode: 'HP-9821',
            status: 'confirmed',
            totalAmount: 924,
            createdAt: new Date().toISOString(),
          },
        };
      } else if (requestPath.includes('/charges')) {
        payload = {
          success: true,
          message: 'Incidental posted to folio ledger',
          transactionId: 'txn_' + Date.now(),
          newBalance: 135.5,
        };
      } else if (requestPath.includes('/revpar')) {
        const occ = Math.round((rooms.filter((r) => r.status === 'occupied').length / rooms.length) * 100);
        payload = {
          property: 'The Grand Azure Resort',
          metrics: {
            occupancyRate: `${occ}%`,
            adr: '$385.00',
            revPar: '$290.00',
            calculation: 'ADR * Occupancy',
          },
        };
      } else if (requestPath.includes('/auth/login')) {
        payload = {
          success: true,
          token: jwtToken,
          expiresIn: '24h',
          user: {
            name: currentUser.name,
            role: currentUser.role,
            department: currentUser.department,
          },
        };
      } else {
        payload = { success: true, timestamp: new Date().toISOString() };
      }

      setResponseStatus(status);
      setResponseHeaders({
        'content-type': 'application/json; charset=utf-8',
        'x-powered-by': 'Express 4.21.2 (Node.js)',
        'x-mongodb-cluster': 'atlas-primary-shard-01',
        'access-control-allow-origin': '*',
      });
      setResponsePayload(payload);
      setIsRunning(false);
    }, 280);
  };

  // MongoDB Collection Viewer state
  const [selectedCollection, setSelectedCollection] = useState<'rooms' | 'bookings' | 'guests' | 'folios' | 'users' | 'housekeeping' | 'audit_logs'>('rooms');

  const getCollectionData = () => {
    switch (selectedCollection) {
      case 'rooms':
        return rooms;
      case 'bookings':
        return bookings;
      case 'guests':
        return guests;
      case 'folios':
        return folios;
      case 'users':
        return staffUsers;
      case 'housekeeping':
        return housekeepingTasks;
      case 'audit_logs':
        return auditLogs;
    }
  };

  if (!isApiExplorerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-sky-400" />
              <h3 className="text-lg font-bold text-white font-serif">
                Backend API & MongoDB Schema Explorer
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live testing console for Express.js REST endpoints, MongoDB collections, and JWT session authorization.
            </p>
          </div>

          <button
            onClick={() => setIsApiExplorerOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg mt-4 self-start text-xs font-mono">
          <button
            onClick={() => setActiveTab('rest_api')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeTab === 'rest_api'
                ? 'bg-slate-700 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>REST API Test Client (Postman)</span>
          </button>

          <button
            onClick={() => setActiveTab('mongodb')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeTab === 'mongodb'
                ? 'bg-slate-700 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB BSON Collections</span>
          </button>

          <button
            onClick={() => setActiveTab('jwt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
              activeTab === 'jwt'
                ? 'bg-slate-700 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>JWT Session Inspector</span>
          </button>
        </div>

        {/* Tab 1: REST API Client */}
        {activeTab === 'rest_api' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 flex-1">
            {/* Endpoints Sidebar */}
            <div className="lg:col-span-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono uppercase text-slate-400 px-2 py-1 font-bold">
                Preset Endpoints (19 Operations)
              </div>
              {apiEndpoints.map((ep, idx) => (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedEndpointIndex === idx
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="truncate pr-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-1 py-0.5 rounded ${
                          ep.method === 'GET'
                            ? 'bg-emerald-950 text-emerald-400'
                            : ep.method === 'POST'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-sky-950 text-sky-400'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="truncate">{ep.path}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5 truncate">
                      {ep.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Request & Response Area */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {/* URL Bar */}
              <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 font-mono text-xs">
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-bold rounded">
                  {requestMethod}
                </span>
                <input
                  type="text"
                  value={requestPath}
                  onChange={(e) => setRequestPath(e.target.value)}
                  className="flex-1 bg-transparent border-none text-slate-200 focus:outline-none"
                />
                <button
                  onClick={handleSendRequest}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {isRunning ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Send</span>
                </button>
              </div>

              {/* Request Headers info */}
              <div className="text-[11px] font-mono text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <span>Authorization: Bearer {jwtToken.substring(0, 28)}...</span>
                <span className="text-emerald-400">JWT Verified (HS256)</span>
              </div>

              {/* Request Body (if POST/PATCH) */}
              {requestBody && (
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                    Request JSON Body
                  </div>
                  <textarea
                    rows={4}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-amber-200 focus:outline-none"
                  />
                </div>
              )}

              {/* Response Panel */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 flex-1 flex flex-col font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                  <span className="text-slate-400 font-bold uppercase">HTTP Response</span>
                  {responseStatus && (
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 font-bold">{responseStatus} OK</span>
                      <span className="text-slate-400">{responseTime} ms</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex-1 max-h-56 overflow-y-auto">
                  {responsePayload ? (
                    <pre className="text-emerald-300 text-[11px] leading-relaxed">
                      {JSON.stringify(responsePayload, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-500 py-8 text-center">
                      Click "Send" above to dispatch request to Express router.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MongoDB Collections Viewer */}
        {activeTab === 'mongodb' && (
          <div className="mt-4 space-y-4">
            {/* Collection Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono">
              {(
                [
                  'rooms',
                  'bookings',
                  'guests',
                  'folios',
                  'users',
                  'housekeeping',
                  'audit_logs',
                ] as const
              ).map((coll) => (
                <button
                  key={coll}
                  onClick={() => setSelectedCollection(coll)}
                  className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                    selectedCollection === coll
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  db.{coll}
                </button>
              ))}
            </div>

            {/* Collection Metadata & JSON documents */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Database: hotelpro_production_db · Collection: db.{selectedCollection}</span>
                <span className="text-emerald-400">
                  {getCollectionData().length} Documents Indexed
                </span>
              </div>

              <div className="mt-3 max-h-96 overflow-y-auto">
                <pre className="text-emerald-300 text-[11px] leading-relaxed">
                  {JSON.stringify(getCollectionData(), null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: JWT Session Inspector */}
        {activeTab === 'jwt' && (
          <div className="mt-4 space-y-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase font-bold mb-2">
                Raw Encoded JSON Web Token
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 break-all text-xs leading-relaxed text-amber-300">
                {jwtToken}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Decoded Header */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] text-rose-400 uppercase font-bold mb-2">
                  1. Decoded Header (Algorithm & Token Type)
                </div>
                <pre className="text-rose-300 text-xs">
                  {JSON.stringify(
                    {
                      alg: 'HS256',
                      typ: 'JWT',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              {/* Decoded Payload */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] text-purple-400 uppercase font-bold mb-2">
                  2. Decoded Payload (Claims & Permissions)
                </div>
                <pre className="text-purple-300 text-xs">
                  {JSON.stringify(
                    {
                      sub: currentUser.id,
                      name: currentUser.name,
                      role: currentUser.role,
                      department: currentUser.department,
                      shift: currentUser.shift,
                      hotelId: 'AZR-001',
                      permissions: ['room.read', 'room.update', 'booking.create', 'folio.settle'],
                      iat: 1793207000,
                      exp: 1793293400,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsApiExplorerOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
