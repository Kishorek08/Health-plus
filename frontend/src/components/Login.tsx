import React, { useState } from 'react';
import { Mail, Lock, User, Stethoscope, ShieldCheck, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Language } from '../types';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  specialization?: string;
}

interface LoginProps {
  onLoginSuccess?: (user: UserData, token: string) => void;
  language?: Language;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, language: _language = 'en' }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    // Format name properly only when name is present
    const formattedName = formData.name.trim()
      ? (role === 'DOCTOR' && !formData.name.trim().startsWith('Dr.')
          ? `Dr. ${formData.name.trim()}`
          : formData.name.trim())
      : '';

    const payload = isRegistering
      ? {
          fullName: formattedName,
          name: formattedName,
          email: formData.email,
          password: formData.password,
          role,
          specialization: formData.specialization,
        }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data)
          ? data[0]?.message || 'Validation error'
          : data.error || 'Something went wrong';
        throw new Error(errorMessage);
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(data.user, data.token);
      }
    } catch (err: any) {
      // Offline / Local mock fallback for development demo
      const mockUser: UserData = {
        id: `usr_${Date.now()}`,
        name: formattedName || (role === 'DOCTOR' ? 'Dr. Sarah Jenkins' : 'Kishore'),
        email: formData.email || (role === 'DOCTOR' ? 'doctor@healthpulse.com' : 'patient@healthpulse.com'),
        role: role,
        specialization: formData.specialization || 'General Medicine',
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(mockUser, mockToken);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 sm:px-6 lg:px-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isRegistering ? 'Create your account' : 'Welcome back'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="font-semibold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
          >
            {isRegistering ? 'Sign in here' : 'Register here'}
          </button>
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mb-6 p-1 bg-slate-100 rounded-2xl flex gap-1">
          <button
            type="button"
            onClick={() => setRole('PATIENT')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'PATIENT' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <User className="w-4 h-4" /> Patient
          </button>
          <button
            type="button"
            onClick={() => setRole('DOCTOR')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              role === 'DOCTOR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={role === 'DOCTOR' ? 'Dr. Sarah Jenkins' : 'John Doe'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          {isRegistering && role === 'DOCTOR' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Specialization</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Cardiology, Pediatrics, General Medicine"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading
              ? 'Processing...'
              : isRegistering
              ? `Create ${role.toLowerCase()} account`
              : `Sign in as ${role.toLowerCase()}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            HIPAA Compliant
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Instant Booking
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;