import React, { useState } from 'react';
import { loginAdmin } from '../services/appointmentService';

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(password);
      onLogin();
    } catch (err) {
      setError('Invalid password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full rounded-[24px] border border-[#D6D2CC] p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-sm uppercase tracking-widest font-bold text-[#0B1426] mb-2">
            Admin Access
          </h1>
          <p className="text-sm text-[#4A5568]">
            Please enter your password to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F6F2] border border-[#D6D2CC] rounded-[12px] focus:outline-none focus:border-[#C9A96E] text-sm text-[#0B1426]"
              required
            />
            {error && (
              <p className="text-[#93000a] text-xs mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-full font-display text-xs uppercase tracking-widest font-semibold transition-colors flex justify-center items-center gap-2
              ${loading ? 'bg-[#0B1426]/70 cursor-not-allowed' : 'bg-[#0B1426] hover:bg-[#0B1426]/90'} text-white`}
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#/" className="text-xs text-[#4A5568] hover:text-[#C9A96E] transition-colors underline underline-offset-4">
            Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
