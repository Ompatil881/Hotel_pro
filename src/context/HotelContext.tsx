import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Room,
  Booking,
  Guest,
  Folio,
  FolioItem,
  HousekeepingTask,
  StaffUser,
  StaffRole,
  AuditLog,
  RoomStatus,
  CleanStatus,
} from '../types/hotel';
import {
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_GUESTS,
  INITIAL_FOLIOS,
  INITIAL_HOUSEKEEPING_TASKS,
  INITIAL_STAFF_USERS,
} from '../data/mockData';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface HotelContextType {
  // State
  rooms: Room[];
  bookings: Booking[];
  guests: Guest[];
  folios: Folio[];
  housekeepingTasks: HousekeepingTask[];
  staffUsers: StaffUser[];
  currentUser: StaffUser;
  jwtToken: string;
  auditLogs: AuditLog[];
  activeView: 'matrix' | 'reservations' | 'front_desk' | 'folios' | 'housekeeping' | 'guests' | 'analytics';
  toasts: ToastNotification[];

  // Modals & Drawers state
  selectedRoom: Room | null;
  selectedBookingForVoucher: Booking | null;
  selectedBookingForCheckIn: Booking | null;
  selectedBookingForCheckOut: Booking | null;
  selectedBookingForKeyCard: Booking | null;
  selectedFolioForInvoice: Folio | null;
  selectedFolioForCharge: Folio | null;
  isNewReservationOpen: boolean;
  preselectedRoomIdForBooking: string | null;
  isEpicsModalOpen: boolean;
  isApiExplorerOpen: boolean;

  // Setters
  setActiveView: (view: 'matrix' | 'reservations' | 'front_desk' | 'folios' | 'housekeeping' | 'guests' | 'analytics') => void;
  setSelectedRoom: (room: Room | null) => void;
  setSelectedBookingForVoucher: (booking: Booking | null) => void;
  setSelectedBookingForCheckIn: (booking: Booking | null) => void;
  setSelectedBookingForCheckOut: (booking: Booking | null) => void;
  setSelectedBookingForKeyCard: (booking: Booking | null) => void;
  setSelectedFolioForInvoice: (folio: Folio | null) => void;
  setSelectedFolioForCharge: (folio: Folio | null) => void;
  setIsNewReservationOpen: (open: boolean, roomId?: string) => void;
  setIsEpicsModalOpen: (open: boolean) => void;
  setIsApiExplorerOpen: (open: boolean) => void;

  // Actions
  switchUserRole: (role: StaffRole) => void;
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus, cleanStatus?: CleanStatus, note?: string) => void;
  createReservation: (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'keyCardIssued'>) => Booking;
  checkInGuest: (bookingId: string) => void;
  checkOutGuest: (bookingId: string, paymentMethod?: string) => void;
  cancelBooking: (bookingId: string) => void;
  issueKeyCard: (bookingId: string) => void;
  addFolioCharge: (folioId: string, item: Omit<FolioItem, 'id' | 'date' | 'status' | 'tax'>) => void;
  settleFolio: (folioId: string, paymentMethod: string) => void;
  updateHousekeepingTask: (taskId: string, status: HousekeepingTask['status'], notes?: string) => void;
  createHousekeepingTask: (task: Omit<HousekeepingTask, 'id' | 'updatedAt'>) => void;
  resetAllData: () => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const STORAGE_KEY = 'hotelpro_app_state_v1';

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_guests`);
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [folios, setFolios] = useState<Folio[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_folios`);
    return saved ? JSON.parse(saved) : INITIAL_FOLIOS;
  });

  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hk`);
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING_TASKS;
  });

  const [staffUsers] = useState<StaffUser[]>(INITIAL_STAFF_USERS);
  const [currentUser, setCurrentUser] = useState<StaffUser>(INITIAL_STAFF_USERS[0]); // Sarah Jenkins
  const [jwtToken, setJwtToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMDEiLCJuYW1lIjoiU2FyYWggSmVua2lucyIsInJvbGUiOiJmcm9udF9kZXNrIiwiZGVwdCI6IkZyb250IERlc2siLCJleHAiOjE4MjQ3NDI0MDB9.Z9u_V817HotelProSignatureVerified2026'
  );

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_01',
      timestamp: '2026-10-28 09:30:15',
      user: 'Sarah Jenkins',
      role: 'front_desk',
      action: 'SYSTEM_BOOT',
      details: 'HotelPro core PMS operational session started.',
    },
    {
      id: 'log_02',
      timestamp: '2026-10-28 09:45:22',
      user: 'Sarah Jenkins',
      role: 'front_desk',
      action: 'KEYCARD_ISSUANCE',
      details: 'Issued NFC Keycard for Room 101 to Claire Beauchamp.',
    },
  ]);

  const [activeView, setActiveView] = useState<'matrix' | 'reservations' | 'front_desk' | 'folios' | 'housekeeping' | 'guests' | 'analytics'>('matrix');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Modals & Active selections
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedBookingForVoucher, setSelectedBookingForVoucher] = useState<Booking | null>(null);
  const [selectedBookingForCheckIn, setSelectedBookingForCheckIn] = useState<Booking | null>(null);
  const [selectedBookingForCheckOut, setSelectedBookingForCheckOut] = useState<Booking | null>(null);
  const [selectedBookingForKeyCard, setSelectedBookingForKeyCard] = useState<Booking | null>(null);
  const [selectedFolioForInvoice, setSelectedFolioForInvoice] = useState<Folio | null>(null);
  const [selectedFolioForCharge, setSelectedFolioForCharge] = useState<Folio | null>(null);
  const [isNewReservationOpen, setIsNewReservationOpenState] = useState<boolean>(false);
  const [preselectedRoomIdForBooking, setPreselectedRoomIdForBooking] = useState<string | null>(null);
  const [isEpicsModalOpen, setIsEpicsModalOpen] = useState<boolean>(false);
  const [isApiExplorerOpen, setIsApiExplorerOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_guests`, JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_folios`, JSON.stringify(folios));
  }, [folios]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hk`, JSON.stringify(housekeepingTasks));
  }, [housekeepingTasks]);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `tst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.role,
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const switchUserRole = (role: StaffRole) => {
    const found = staffUsers.find((u) => u.role === role) || staffUsers[0];
    setCurrentUser(found);

    // Generate dynamic mock JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: found.id,
        name: found.name,
        role: found.role,
        department: found.department,
        shift: found.shift,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    );
    const signature = 'hpSig_' + Math.random().toString(36).substring(2, 12);
    setJwtToken(`${header}.${payload}.${signature}`);

    addToast('info', 'Active Role Switched', `Logged in as ${found.name} (${found.role.replace('_', ' ').toUpperCase()})`);
    logAudit('USER_ROLE_SWITCH', `Switched active session to ${found.name} [${found.role}]`);
  };

  const setIsNewReservationOpen = (open: boolean, roomId?: string) => {
    setIsNewReservationOpenState(open);
    setPreselectedRoomIdForBooking(roomId || null);
  };

  const updateRoomStatus = (roomId: string, status: RoomStatus, cleanStatus?: CleanStatus, note?: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const updated = {
            ...r,
            status,
            cleanStatus: cleanStatus || r.cleanStatus,
            maintenanceNote: note !== undefined ? note : r.maintenanceNote,
          };
          return updated;
        }
        return r;
      })
    );

    const room = rooms.find((r) => r.id === roomId);
    addToast('success', 'Room Status Updated', `Room ${room?.number || roomId} is now marked as ${status.toUpperCase()}`);
    logAudit('ROOM_STATUS_CHANGE', `Room ${room?.number} updated to ${status} (clean: ${cleanStatus || room?.cleanStatus})`);
  };

  const createReservation = (bookingData: Omit<Booking, 'id' | 'bookingCode' | 'createdAt' | 'status' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'keyCardIssued'>): Booking => {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `HP-${codeNumber}`;
    const id = `bk_${Date.now()}`;
    const subtotal = bookingData.nightlyRate * bookingData.nights;
    const taxAmount = Math.round(subtotal * 0.1);
    const totalAmount = subtotal + taxAmount;

    const newBooking: Booking = {
      ...bookingData,
      id,
      bookingCode,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      keyCardIssued: false,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update room status to reserved
    setRooms((prev) =>
      prev.map((r) =>
        r.id === bookingData.roomId
          ? { ...r, status: 'reserved', currentBookingId: id, currentGuestName: bookingData.guestName }
          : r
      )
    );

    // Create associated Folio
    const newFolio: Folio = {
      id: `fol_${Date.now()}`,
      bookingId: id,
      guestId: bookingData.guestId,
      guestName: bookingData.guestName,
      roomNumber: bookingData.roomNumber,
      items: [
        {
          id: `fi_${Date.now()}_rm`,
          date: bookingData.checkInDate,
          category: 'Room Rate',
          description: `Room ${bookingData.roomNumber} - ${bookingData.nights} Night(s) Stay`,
          amount: subtotal,
          tax: taxAmount,
          status: 'posted',
        },
      ],
      totalCharges: subtotal,
      totalTax: taxAmount,
      totalPayments: bookingData.paidAmount,
      balance: totalAmount - bookingData.paidAmount,
      status: 'open',
    };
    setFolios((prev) => [newFolio, ...prev]);

    // Check if guest exists or add to CRM
    setGuests((prev) => {
      const exists = prev.some((g) => g.id === bookingData.guestId || g.email === bookingData.guestEmail);
      if (!exists) {
        const newGuest: Guest = {
          id: bookingData.guestId || `gst_${Date.now()}`,
          name: bookingData.guestName,
          email: bookingData.guestEmail,
          phone: bookingData.guestPhone,
          idNumber: 'AUTO_GENERATED',
          idType: 'Passport',
          nationality: 'International',
          loyaltyTier: 'Standard',
          vip: false,
          totalStays: 1,
          totalSpend: totalAmount,
          preferences: ['Standard request'],
          createdAt: new Date().toISOString().split('T')[0],
        };
        return [newGuest, ...prev];
      }
      return prev;
    });

    addToast('success', 'Reservation Confirmed', `Booking ${bookingCode} created for ${bookingData.guestName} in Room ${bookingData.roomNumber}`);
    logAudit('RESERVATION_CREATED', `Created booking ${bookingCode} for ${bookingData.guestName} in Room ${bookingData.roomNumber}`);

    return newBooking;
  };

  const checkInGuest = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'checked_in', keyCardIssued: true } : b))
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.id === booking.roomId || r.number === booking.roomNumber
          ? {
              ...r,
              status: 'occupied',
              currentBookingId: booking.id,
              currentGuestName: booking.guestName,
            }
          : r
      )
    );

    addToast('success', 'Guest Checked In', `${booking.guestName} is checked into Room ${booking.roomNumber}. Keycard issued.`);
    logAudit('GUEST_CHECKIN', `Checked in ${booking.guestName} to Room ${booking.roomNumber} [Booking ${booking.bookingCode}]`);
  };

  const checkOutGuest = (bookingId: string, paymentMethod = 'Credit Card (Visa ···· 4242)') => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'checked_out' } : b))
    );

    // Release room and mark as Dirty for Housekeeping
    setRooms((prev) =>
      prev.map((r) =>
        r.id === booking.roomId || r.number === booking.roomNumber
          ? {
              ...r,
              status: 'cleaning',
              cleanStatus: 'dirty',
              currentBookingId: undefined,
              currentGuestName: undefined,
            }
          : r
      )
    );

    // Settle folio
    setFolios((prev) =>
      prev.map((f) => {
        if (f.bookingId === bookingId) {
          return {
            ...f,
            totalPayments: f.totalCharges + f.totalTax,
            balance: 0,
            status: 'settled',
            settledAt: new Date().toISOString(),
            paymentMethod,
          };
        }
        return f;
      })
    );

    // Auto-create Housekeeping task for turnover
    const room = rooms.find((r) => r.id === booking.roomId || r.number === booking.roomNumber);
    if (room) {
      const newHkTask: HousekeepingTask = {
        id: `hk_${Date.now()}`,
        roomId: room.id,
        roomNumber: room.number,
        roomType: room.type,
        floor: room.floor,
        taskType: 'Full Turnover',
        priority: 'urgent',
        status: 'pending',
        assignedStaff: 'Elena Rostova',
        estimatedMinutes: 35,
        notes: `Turnover after checkout of ${booking.guestName}. Sanitize and restock amenities.`,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHousekeepingTasks((prev) => [newHkTask, ...prev]);
    }

    addToast('success', 'Guest Checked Out', `${booking.guestName} checked out of Room ${booking.roomNumber}. Room assigned to Housekeeping.`);
    logAudit('GUEST_CHECKOUT', `Checked out ${booking.guestName} from Room ${booking.roomNumber}. Folio settled via ${paymentMethod}.`);
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.id === booking.roomId
          ? {
              ...r,
              status: 'available',
              currentBookingId: undefined,
              currentGuestName: undefined,
            }
          : r
      )
    );

    addToast('info', 'Booking Cancelled', `Reservation ${booking.bookingCode} for ${booking.guestName} has been cancelled.`);
    logAudit('BOOKING_CANCELLED', `Cancelled reservation ${booking.bookingCode} for ${booking.guestName}`);
  };

  const issueKeyCard = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, keyCardIssued: true } : b))
    );

    addToast('success', 'RFID Keycard Encoded', `Keycard issued for Room ${booking.roomNumber} (${booking.guestName}). Access enabled.`);
    logAudit('KEYCARD_ENCODED', `Issued NFC keycard for Room ${booking.roomNumber} - Guest: ${booking.guestName}`);
  };

  const addFolioCharge = (folioId: string, item: Omit<FolioItem, 'id' | 'date' | 'status' | 'tax'>) => {
    const tax = Math.round(item.amount * 0.1 * 100) / 100;
    const newItem: FolioItem = {
      ...item,
      id: `fi_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tax,
      status: 'posted',
    };

    setFolios((prev) =>
      prev.map((f) => {
        if (f.id === folioId) {
          const updatedItems = [...f.items, newItem];
          const totalCharges = updatedItems.reduce((acc, curr) => acc + (curr.status === 'posted' ? curr.amount : 0), 0);
          const totalTax = updatedItems.reduce((acc, curr) => acc + (curr.status === 'posted' ? curr.tax : 0), 0);
          const balance = totalCharges + totalTax - f.totalPayments;
          return {
            ...f,
            items: updatedItems,
            totalCharges,
            totalTax,
            balance,
          };
        }
        return f;
      })
    );

    addToast('success', 'Charge Posted to Folio', `$${item.amount.toFixed(2)} (${item.category}) posted to Room folio.`);
    logAudit('FOLIO_CHARGE_POSTED', `Posted $${item.amount} (${item.category}: ${item.description}) to Folio ${folioId}`);
  };

  const settleFolio = (folioId: string, paymentMethod: string) => {
    setFolios((prev) =>
      prev.map((f) => {
        if (f.id === folioId) {
          const totalDue = f.totalCharges + f.totalTax;
          return {
            ...f,
            totalPayments: totalDue,
            balance: 0,
            status: 'settled',
            settledAt: new Date().toISOString(),
            paymentMethod,
          };
        }
        return f;
      })
    );

    addToast('success', 'Folio Settled', `Folio successfully balanced & settled with ${paymentMethod}.`);
    logAudit('FOLIO_SETTLED', `Folio ${folioId} settled via ${paymentMethod}`);
  };

  const updateHousekeepingTask = (taskId: string, status: HousekeepingTask['status'], notes?: string) => {
    let affectedRoomNumber = '';
    setHousekeepingTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          affectedRoomNumber = t.roomNumber;
          return {
            ...t,
            status,
            notes: notes || t.notes,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return t;
      })
    );

    // If marked inspected or completed, update room cleanStatus
    if (affectedRoomNumber && (status === 'completed' || status === 'inspected')) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.number === affectedRoomNumber) {
            return {
              ...r,
              cleanStatus: 'clean',
              status: r.status === 'cleaning' ? 'available' : r.status,
            };
          }
          return r;
        })
      );
    }

    addToast('info', 'Housekeeping Task Updated', `Task for Room ${affectedRoomNumber} marked as ${status.replace('_', ' ').toUpperCase()}`);
    logAudit('HOUSEKEEPING_STATUS', `Housekeeping task for Room ${affectedRoomNumber} updated to ${status}`);
  };

  const createHousekeepingTask = (task: Omit<HousekeepingTask, 'id' | 'updatedAt'>) => {
    const newTask: HousekeepingTask = {
      ...task,
      id: `hk_${Date.now()}`,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHousekeepingTasks((prev) => [newTask, ...prev]);
    addToast('success', 'Task Dispatched', `Housekeeping ticket created for Room ${task.roomNumber}`);
    logAudit('HOUSEKEEPING_DISPATCH', `Dispatched ${task.taskType} for Room ${task.roomNumber} to ${task.assignedStaff}`);
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_rooms`);
    localStorage.removeItem(`${STORAGE_KEY}_bookings`);
    localStorage.removeItem(`${STORAGE_KEY}_guests`);
    localStorage.removeItem(`${STORAGE_KEY}_folios`);
    localStorage.removeItem(`${STORAGE_KEY}_hk`);
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setGuests(INITIAL_GUESTS);
    setFolios(INITIAL_FOLIOS);
    setHousekeepingTasks(INITIAL_HOUSEKEEPING_TASKS);
    addToast('info', 'System Reset', 'All room inventory, bookings, and folios restored to pristine initial state.');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        guests,
        folios,
        housekeepingTasks,
        staffUsers,
        currentUser,
        jwtToken,
        auditLogs,
        activeView,
        toasts,
        selectedRoom,
        selectedBookingForVoucher,
        selectedBookingForCheckIn,
        selectedBookingForCheckOut,
        selectedBookingForKeyCard,
        selectedFolioForInvoice,
        selectedFolioForCharge,
        isNewReservationOpen,
        preselectedRoomIdForBooking,
        isEpicsModalOpen,
        isApiExplorerOpen,
        setActiveView,
        setSelectedRoom,
        setSelectedBookingForVoucher,
        setSelectedBookingForCheckIn,
        setSelectedBookingForCheckOut,
        setSelectedBookingForKeyCard,
        setSelectedFolioForInvoice,
        setSelectedFolioForCharge,
        setIsNewReservationOpen,
        setIsEpicsModalOpen,
        setIsApiExplorerOpen,
        switchUserRole,
        addToast,
        removeToast,
        updateRoomStatus,
        createReservation,
        checkInGuest,
        checkOutGuest,
        cancelBooking,
        issueKeyCard,
        addFolioCharge,
        settleFolio,
        updateHousekeepingTask,
        createHousekeepingTask,
        resetAllData,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
