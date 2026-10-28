export type RoomType = 'Deluxe Room' | 'Executive Suite' | 'Presidential Suite' | 'Ocean Villa' | 'Penthouse Suite';

export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';

export type CleanStatus = 'clean' | 'dirty' | 'inspecting' | 'turn_down';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  baseRate: number; // nightly rate in USD
  status: RoomStatus;
  cleanStatus: CleanStatus;
  bedType: 'King' | 'Double Queen' | 'Super King' | 'Two Twin';
  maxGuests: number;
  squareMeters: number;
  amenities: string[];
  view: 'Ocean View' | 'City Skyline' | 'Courtyard Garden' | 'Mountain Panorama';
  currentBookingId?: string;
  currentGuestName?: string;
  maintenanceNote?: string;
  imageUrl?: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'refunded';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. HP-8942
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  nights: number;
  adults: number;
  children: number;
  nightlyRate: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  source: 'Direct Web' | 'Phone / Walk-in' | 'Corporate' | 'Luxury Escapes OTA';
  createdAt: string;
  keyCardIssued?: boolean;
}

export type LoyaltyTier = 'Standard' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond Elite';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  idType: 'Passport' | 'Driving License' | 'National ID';
  nationality: string;
  loyaltyTier: LoyaltyTier;
  vip: boolean;
  totalStays: number;
  totalSpend: number;
  preferences: string[];
  dietaryRestrictions?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type FolioCategory =
  | 'Room Rate'
  | 'Dining & Lounge'
  | 'Mini-Bar'
  | 'Spa & Wellness'
  | 'Laundry & Valet'
  | 'Airport Transfer'
  | 'Taxes & Fees';

export interface FolioItem {
  id: string;
  date: string;
  category: FolioCategory;
  description: string;
  amount: number;
  tax: number;
  status: 'posted' | 'voided';
}

export interface Folio {
  id: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  roomNumber: string;
  items: FolioItem[];
  totalCharges: number;
  totalTax: number;
  totalPayments: number;
  balance: number;
  status: 'open' | 'settled' | 'closed';
  settledAt?: string;
  paymentMethod?: string;
}

export type HousekeepingPriority = 'low' | 'normal' | 'urgent';

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  floor: number;
  taskType: 'Full Turnover' | 'Daily Tidy' | 'Deep Clean' | 'VIP Turndown' | 'Sanitization Check';
  priority: HousekeepingPriority;
  status: 'pending' | 'in_progress' | 'inspected' | 'completed';
  assignedStaff: string;
  estimatedMinutes: number;
  notes?: string;
  updatedAt: string;
}

export type StaffRole = 'admin' | 'front_desk' | 'housekeeper' | 'general_manager';

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  department: string;
  shift: 'Morning (07:00 - 15:30)' | 'Evening (15:00 - 23:30)' | 'Night Audit (23:00 - 07:30)';
  avatarUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  details: string;
}

export interface EpicDefinition {
  id: number;
  title: string;
  code: string;
  summary: string;
  tasks: {
    taskCode: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress';
    apiEndpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    mongoCollection: string;
  }[];
}
