import React, { useState, useEffect } from 'react';
import { 
  getAllAppointments, updateAppointment, getAvailabilityConfig, 
  updateAvailabilityConfig, getBlockedDates, blockDate, unblockDate,
  hasAdminToken, logoutAdmin
} from '../services/appointmentService';
import { WhatsAppAppointment, Availability, BlockedDate, AppointmentStatus } from '../types';
import AdminLogin from './AdminLogin';

// Helper: convert 24h time "17:00" to "5:00 PM"
function to12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', 
  friday: 'Fri', saturday: 'Sat', sunday: 'Sun'
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAdminToken());
  const [appointments, setAppointments] = useState<WhatsAppAppointment[]>([]);
  const [availConfig, setAvailConfig] = useState<Availability[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<BlockedDate[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [dateFilter, setDateFilter] = useState<string>(''); // empty string = all dates
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit modal state
  const [editingAppt, setEditingAppt] = useState<WhatsAppAppointment | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Availability form state
  const [addAvailDay, setAddAvailDay] = useState('');
  const [addAvailStart, setAddAvailStart] = useState('');
  const [addAvailEnd, setAddAvailEnd] = useState('');

  // Block date form state
  const [addBlockDate, setAddBlockDate] = useState('');
  const [addBlockReason, setAddBlockReason] = useState('');

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  const loadData = async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) setLoading(true);
    try {
      const [appts, avail, blocked] = await Promise.all([
        getAllAppointments(),
        getAvailabilityConfig(),
        getBlockedDates()
      ]);
      setAppointments(appts);
      setAvailConfig(avail);
      setBlockedDatesList(blocked);
    } catch (err: any) {
      if (err.message.includes('Unauthorized') || err.message.includes('token')) {
        handleLogout();
      } else {
        setError('Failed to load data');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(() => {
        loadData(true);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const filteredAppointments = appointments.filter(a => {
    const matchesDate = !dateFilter || a.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const handleUpdateStatus = async (id: string, status: WhatsAppAppointment['status']) => {
    await updateAppointment(id, { status });
    loadData();
  };

  const handleSaveEdit = async () => {
    if (!editingAppt) return;
    await updateAppointment(editingAppt.id, {
      patientName: editName,
      patientPhone: editPhone
    });
    setEditingAppt(null);
    loadData();
  };

  // Group availability by day for display
  const availByDay: Record<string, Availability[]> = {};
  for (const slot of availConfig) {
    if (!availByDay[slot.day]) availByDay[slot.day] = [];
    availByDay[slot.day].push(slot);
  }

  const handleRemoveTimeRange = async (day: string, rangeIndex: number) => {
    const newConfig = availConfig.filter((a, _) => {
      if (a.day !== day) return true;
      // Count how many we've seen for this day
      const dayItems = availConfig.filter(x => x.day === day);
      return dayItems.indexOf(a) !== rangeIndex;
    });
    await updateAvailabilityConfig(newConfig);
    loadData();
  };

  const handleAddTimeRange = async () => {
    if (!addAvailDay || !addAvailStart || !addAvailEnd) return;
    const newConfig = [...availConfig, {
      day: addAvailDay.toLowerCase(),
      startTime: addAvailStart,
      endTime: addAvailEnd,
      active: true
    }];
    await updateAvailabilityConfig(newConfig);
    setAddAvailDay('');
    setAddAvailStart('');
    setAddAvailEnd('');
    loadData();
  };

  const handleBlockDate = async () => {
    if (!addBlockDate) return;
    await blockDate(addBlockDate, addBlockReason || undefined);
    setAddBlockDate('');
    setAddBlockReason('');
    loadData();
  };

  const handleUnblockDate = async (date: string) => {
    await unblockDate(date);
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-[#C9A96E]/20 text-[#C9A96E]';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-[#ffdad6] text-[#93000a]';
      case 'completed': return 'bg-[#F0EDE8] text-[#4A5568]';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const [waConnected, setWaConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkWa = async () => {
      try {
        const res = await fetch('/api/whatsapp/status');
        const data = await res.json();
        setWaConnected(data.status === 'connected');
      } catch {
        setWaConnected(false);
      }
    };
    checkWa();
    const interval = setInterval(checkWa, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans text-[#0B1426]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#D6D2CC] p-4 flex items-center justify-between sticky top-0 z-10">
        <a href="#/" className="text-[#0B1426] hover:text-[#C9A96E] flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </a>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xs uppercase tracking-widest font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-1.5 bg-[#C9A96E]/10 text-[#C9A96E] px-2 py-0.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C9A96E]"></span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider">Live</span>
          </div>

          <a 
            href="#/whatsapp" 
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
              waConnected ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffdad6]/80'
            }`}
            title="Click to view WhatsApp connection details"
          >
            <span className="material-symbols-outlined text-[12px]">chat</span>
            <span>{waConnected ? 'WhatsApp Online' : 'WhatsApp Offline'}</span>
          </a>
        </div>
        <button
          onClick={handleLogout}
          className="text-[#4A5568] hover:text-[#93000a] flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-[#F0EDE8] transition-colors"
          title="Sign out"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-12">

        {/* Section 1: Appointments */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-bold">
              Appointments Overview
            </h2>
            <button
              onClick={() => loadData()}
              className="text-xs text-[#4A5568] hover:text-[#0B1426] flex items-center gap-1.5 self-start sm:self-auto bg-white border border-[#D6D2CC] px-3 py-1.5 rounded-full shadow-sm hover:border-[#C9A96E] transition-colors"
            >
              <span className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin' : ''}`}>sync</span>
              <span>Refresh Now</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div 
              onClick={() => setStatusFilter('all')}
              className={`bg-white rounded-[20px] border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                statusFilter === 'all' ? 'border-[#0B1426] shadow-sm' : 'border-[#D6D2CC] hover:border-[#0B1426]/50'
              }`}
            >
              <span className="font-serif text-3xl font-semibold">{stats.total}</span>
              <span className="font-display text-[10px] uppercase tracking-wider text-[#4A5568]">Total</span>
            </div>
            <div 
              onClick={() => setStatusFilter('pending')}
              className={`bg-white rounded-[20px] border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                statusFilter === 'pending' ? 'border-[#C9A96E] shadow-sm bg-[#C9A96E]/5' : 'border-[#C9A96E]/40 hover:border-[#C9A96E]'
              }`}
            >
              <span className="font-serif text-3xl font-semibold text-[#C9A96E]">{stats.pending}</span>
              <span className="font-display text-[10px] uppercase tracking-wider text-[#4A5568]">Pending</span>
            </div>
            <div 
              onClick={() => setStatusFilter('confirmed')}
              className={`bg-white rounded-[20px] border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                statusFilter === 'confirmed' ? 'border-green-600 shadow-sm bg-green-50/50' : 'border-[#D6D2CC] hover:border-green-600'
              }`}
            >
              <span className="font-serif text-3xl font-semibold text-green-700">{stats.confirmed}</span>
              <span className="font-display text-[10px] uppercase tracking-wider text-[#4A5568]">Confirmed</span>
            </div>
            <div 
              onClick={() => setStatusFilter('completed')}
              className={`bg-white rounded-[20px] border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                statusFilter === 'completed' ? 'border-[#0B1426] shadow-sm' : 'border-[#D6D2CC] hover:border-[#0B1426]'
              }`}
            >
              <span className="font-serif text-3xl font-semibold text-[#0B1426]">{stats.completed}</span>
              <span className="font-display text-[10px] uppercase tracking-wider text-[#4A5568]">Completed</span>
            </div>
            <div 
              onClick={() => setStatusFilter('cancelled')}
              className={`bg-white rounded-[20px] border p-4 flex flex-col justify-between cursor-pointer transition-all ${
                statusFilter === 'cancelled' ? 'border-[#93000a] shadow-sm bg-red-50/30' : 'border-[#D6D2CC] hover:border-[#93000a]'
              }`}
            >
              <span className="font-serif text-3xl font-semibold text-[#93000a]">{stats.cancelled}</span>
              <span className="font-display text-[10px] uppercase tracking-wider text-[#4A5568]">Cancelled</span>
            </div>
          </div>

          {/* Filters Bar: Status Tabs + Date Filter */}
          <div className="bg-white rounded-[20px] border border-[#D6D2CC] p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#4A5568] mr-1">Status:</span>
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-[#0B1426] text-white'
                      : 'bg-[#F0EDE8] text-[#4A5568] hover:bg-[#D6D2CC]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#4A5568] mr-1">Date:</span>
              <button
                onClick={() => setDateFilter('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  !dateFilter ? 'bg-[#0B1426] text-white' : 'bg-[#F0EDE8] text-[#4A5568] hover:bg-[#D6D2CC]'
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter(todayStr)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  dateFilter === todayStr ? 'bg-[#0B1426] text-white' : 'bg-[#F0EDE8] text-[#4A5568] hover:bg-[#D6D2CC]'
                }`}
              >
                Today
              </button>
              <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1 border border-[#D6D2CC] rounded-lg text-xs bg-[#F8F6F2] outline-none focus:border-[#C9A96E] text-[#0B1426]"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-xs text-[#93000a] hover:underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Appointment List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-[20px] border border-[#D6D2CC] p-8 text-center">
                <span className="material-symbols-outlined text-3xl text-[#D6D2CC] mb-2">event_available</span>
                <p className="text-sm text-[#4A5568]">No appointments match your filters.</p>
                {(dateFilter || statusFilter !== 'all') && (
                  <button
                    onClick={() => { setDateFilter(''); setStatusFilter('all'); }}
                    className="mt-3 text-xs text-[#C9A96E] font-semibold underline underline-offset-4"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              filteredAppointments.map(appt => (
                <div 
                  key={appt.id} 
                  className={`bg-white rounded-[20px] border border-[#D6D2CC] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    appt.status === 'pending' ? 'border-l-4 border-l-[#C9A96E]' : ''
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-serif text-lg font-semibold text-[#0B1426]">
                        {appt.date} • {appt.time}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(appt.status)}`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="text-sm text-[#0B1426] font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#4A5568]">person</span>
                      <span>{appt.patientName || <span className="text-[#4A5568] italic font-normal">Awaiting name via WhatsApp</span>}</span>
                    </div>
                    {appt.patientPhone && (
                      <div className="text-xs text-[#4A5568] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-green-700">call</span>
                        <span>{appt.patientPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-[#4A5568] pt-1">
                      <span className="bg-[#F0EDE8] px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                        <span className="material-symbols-outlined text-[12px] text-green-700">chat</span>
                        WhatsApp
                      </span>
                      <span className="font-display text-[10px]">REF: {appt.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {appt.status === 'pending' && (
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-2 font-display text-[10px] uppercase tracking-widest font-bold transition-colors"
                      >
                        Confirm
                      </button>
                    )}
                    {appt.status === 'confirmed' && (
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, 'completed')}
                        className="bg-[#4A5568] hover:bg-[#0B1426] text-white rounded-full px-4 py-2 font-display text-[10px] uppercase tracking-widest font-bold transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                      <button 
                        onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                        className="text-[#93000a] hover:bg-[#ffdad6] rounded-full px-4 py-2 font-display text-[10px] uppercase tracking-widest font-bold transition-colors"
                      >
                        Decline
                      </button>
                    )}
                    {appt.patientPhone && (
                      <a 
                        href={`tel:${appt.patientPhone}`}
                        className="bg-[#F0EDE8] hover:bg-[#D6D2CC] text-[#0B1426] w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                        title="Call Patient"
                      >
                        <span className="material-symbols-outlined text-[20px]">call</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setEditingAppt(appt);
                        setEditName(appt.patientName || '');
                        setEditPhone(appt.patientPhone || '');
                      }}
                      className="bg-[#F0EDE8] hover:bg-[#D6D2CC] text-[#0B1426] w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      title="Edit Patient Info"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Availability Management */}
        <section className="space-y-6 pt-8 border-t border-[#D6D2CC]">
          <h2 className="font-display text-[11px] uppercase tracking-[0.2em] text-[#C9A96E] font-bold">
            Availability Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Schedule */}
            <div className="bg-white rounded-[20px] border border-[#D6D2CC] p-4 md:p-6 space-y-6">
              <h3 className="font-serif text-xl font-semibold text-[#0B1426]">Weekly Schedule</h3>
              
              <div className="space-y-4">
                {DAYS_OF_WEEK.map(day => {
                  const ranges = availByDay[day] || [];
                  return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-start gap-2 border-b border-[#F0EDE8] pb-4 last:border-0">
                      <div className="w-28 font-medium text-sm pt-1">{DAY_LABELS[day]}</div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {ranges.length === 0 ? (
                          <span className="text-xs text-[#4A5568] italic pt-1">Not available</span>
                        ) : (
                          ranges.map((range, idx) => (
                            <div key={idx} className="bg-[#F0EDE8] text-[#0B1426] text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                              <span>{to12h(range.startTime)} – {to12h(range.endTime)}</span>
                              <button 
                                onClick={() => handleRemoveTimeRange(day, idx)}
                                className="text-[#4A5568] hover:text-[#93000a] flex items-center"
                              >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-[#D6D2CC] space-y-3">
                  <h4 className="text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Add Time Range</h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <select 
                      value={addAvailDay}
                      onChange={e => setAddAvailDay(e.target.value)}
                      className="border border-[#D6D2CC] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#C9A96E]"
                    >
                      <option value="">Select Day</option>
                      {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
                    </select>
                    <input 
                      type="time" 
                      value={addAvailStart}
                      onChange={e => setAddAvailStart(e.target.value)}
                      className="border border-[#D6D2CC] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#C9A96E]"
                    />
                    <span className="text-[#4A5568]">to</span>
                    <input 
                      type="time" 
                      value={addAvailEnd}
                      onChange={e => setAddAvailEnd(e.target.value)}
                      className="border border-[#D6D2CC] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#C9A96E]"
                    />
                    <button 
                      onClick={handleAddTimeRange}
                      className="bg-[#0B1426] hover:bg-[#0B1426]/90 text-white rounded-full px-4 py-2 font-display text-[10px] uppercase tracking-widest font-bold transition-colors ml-auto"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Blocked Dates */}
            <div className="bg-white rounded-[20px] border border-[#D6D2CC] p-4 md:p-6 space-y-6">
              <h3 className="font-serif text-xl font-semibold text-[#0B1426]">Blocked Dates</h3>
              
              <div className="space-y-3">
                {blockedDatesList.length === 0 ? (
                  <p className="text-sm text-[#4A5568]">No blocked dates.</p>
                ) : (
                  blockedDatesList.map(bd => (
                    <div key={bd.date} className="bg-[#ffdad6]/30 border border-[#ffdad6] rounded-lg p-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-sm text-[#93000a]">{bd.date}</div>
                        {bd.reason && <div className="text-xs text-[#93000a]/80 mt-0.5">{bd.reason}</div>}
                      </div>
                      <button 
                        onClick={() => handleUnblockDate(bd.date)}
                        className="text-[#93000a] hover:bg-[#ffdad6] w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                        title="Remove Block"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[#D6D2CC] space-y-3">
                <h4 className="text-xs font-semibold text-[#4A5568] uppercase tracking-wider">Block a Date</h4>
                <div className="flex flex-col gap-3">
                  <input 
                    type="date" 
                    value={addBlockDate}
                    onChange={e => setAddBlockDate(e.target.value)}
                    className="border border-[#D6D2CC] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#C9A96E]"
                  />
                  <input 
                    type="text" 
                    placeholder="Reason (optional)"
                    value={addBlockReason}
                    onChange={e => setAddBlockReason(e.target.value)}
                    className="border border-[#D6D2CC] rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-[#C9A96E]"
                  />
                  <button 
                    onClick={handleBlockDate}
                    className="bg-[#0B1426] hover:bg-[#0B1426]/90 text-white rounded-full px-4 py-2 font-display text-[10px] uppercase tracking-widest font-bold transition-colors w-full"
                  >
                    Block Date
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Edit Patient Info Modal */}
      {editingAppt && (
        <div className="fixed inset-0 bg-[#0B1426]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-semibold">Edit Patient Info</h3>
              <button 
                onClick={() => setEditingAppt(null)}
                className="text-[#4A5568] hover:bg-[#F0EDE8] w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#4A5568] flex items-center gap-2">
              <span>Ref: {editingAppt.id}</span>
              <span>•</span>
              <span>{editingAppt.date} at {editingAppt.time}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1.5">Patient Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full border border-[#D6D2CC] rounded-2xl px-4 py-3 outline-none focus:border-[#C9A96E] bg-[#F8F6F2] focus:bg-white transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block font-display text-[10px] uppercase tracking-[0.15em] text-[#C9A96E] font-bold mb-1.5">Patient Phone</label>
                <input 
                  type="tel" 
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full border border-[#D6D2CC] rounded-2xl px-4 py-3 outline-none focus:border-[#C9A96E] bg-[#F8F6F2] focus:bg-white transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button 
                onClick={() => setEditingAppt(null)}
                className="px-6 py-3 rounded-full font-display text-xs uppercase tracking-widest font-semibold hover:bg-[#F0EDE8] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-[#0B1426] hover:bg-[#C9A96E] text-white px-6 py-3 rounded-full font-display text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
