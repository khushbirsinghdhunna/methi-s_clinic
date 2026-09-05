import React, { useState, useEffect } from 'react';

type WaStatus = 'disconnected' | 'initializing' | 'qr_ready' | 'connected' | 'auth_failure';

export default function WhatsAppStatusPage() {
  const [status, setStatus] = useState<WaStatus>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/whatsapp/status');
      const data = await res.json();
      setStatus(data.status);
      setQrCode(data.qr);
    } catch (err) {
      console.error("Failed to fetch WhatsApp status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp/reconnect', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setQrCode(null);
      }
    } catch (err) {
      console.error("Failed to reconnect", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return { label: 'Connected', color: 'text-green-700', bg: 'bg-green-100', icon: 'check_circle' };
      case 'qr_ready':
        return { label: 'Waiting for Scan', color: 'text-[#C9A96E]', bg: 'bg-[#C9A96E]/20', icon: 'qr_code_scanner' };
      case 'initializing':
        return { label: 'Initializing...', color: 'text-blue-700', bg: 'bg-blue-100', icon: 'sync' };
      case 'auth_failure':
        return { label: 'Auth Failed', color: 'text-[#93000a]', bg: 'bg-[#ffdad6]', icon: 'error' };
      case 'disconnected':
      default:
        return { label: 'Disconnected', color: 'text-[#4A5568]', bg: 'bg-[#F0EDE8]', icon: 'link_off' };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="min-h-screen bg-[#F8F6F2] font-sans text-[#0B1426]">
      <header className="bg-white border-b border-[#D6D2CC] p-4 flex items-center justify-between sticky top-0 z-10">
        <a href="#/admin" className="text-[#0B1426] hover:text-[#C9A96E] flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-display text-xs uppercase tracking-widest font-bold">Admin</span>
        </a>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-xs uppercase tracking-widest font-bold">WhatsApp Status</h1>
        </div>
        <div className="w-6"></div>
      </header>

      <div className="max-w-3xl mx-auto p-4 md:p-8 mt-8">
        <div className="bg-white rounded-[28px] border border-[#D6D2CC] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${display.bg} ${display.color}`}>
                <span className="material-symbols-outlined text-3xl">{display.icon}</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold">Connection Status</h2>
                <div className={`font-display text-xs uppercase tracking-widest font-bold mt-1 ${display.color}`}>
                  {display.label}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleReconnect}
              disabled={loading || status === 'initializing'}
              className="bg-[#0B1426] hover:bg-[#C9A96E] text-white px-6 py-3 rounded-full font-display text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className={`material-symbols-outlined text-[18px] ${status === 'initializing' ? 'animate-spin' : ''}`}>
                refresh
              </span>
              Restart Bot
            </button>
          </div>

          <div className="border-t border-[#D6D2CC] pt-8">
            {status === 'qr_ready' ? (
              <div className="text-center space-y-6">
                <h3 className="font-serif text-xl font-semibold">Link WhatsApp</h3>
                <p className="text-sm text-[#4A5568] max-w-md mx-auto">
                  Open WhatsApp on your phone, go to Linked Devices, and point your camera at this QR code to connect the clinic's bot.
                </p>
                {qrCode ? (
                  <div className="bg-white p-4 rounded-xl border border-[#D6D2CC] inline-block shadow-sm">
                    <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64 object-contain" />
                  </div>
                ) : (
                  <div className="w-64 h-64 border border-[#D6D2CC] border-dashed rounded-xl flex items-center justify-center mx-auto text-[#4A5568]">
                    Loading QR...
                  </div>
                )}
              </div>
            ) : status === 'connected' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">verified</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Successfully Connected</h3>
                <p className="text-sm text-[#4A5568]">
                  The WhatsApp bot is online and ready to handle patient appointments.
                </p>
              </div>
            ) : status === 'initializing' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Starting Browser...</h3>
                <p className="text-sm text-[#4A5568]">
                  Initializing Puppeteer. This might take a few seconds.
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#F0EDE8] text-[#4A5568] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">mobile_off</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Bot Offline</h3>
                <p className="text-sm text-[#4A5568]">
                  The WhatsApp bot is currently disconnected. Click "Restart Bot" to spin it back up.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
