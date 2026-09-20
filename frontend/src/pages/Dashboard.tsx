import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { Calendar, User, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await apiClient.get('/appointments');
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-primary font-bold text-xl">
          <Calendar className="w-6 h-6" />
          <span>HealthPortal</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Hello, {user?.fullName} ({user?.role})</span>
          <button onClick={logout} className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-primary" />
            Your Appointments
          </h2>
          
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments scheduled yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">
                      {user?.role === 'PATIENT' ? `Dr. ${apt.doctor.user.fullName}` : `Patient: ${apt.patient.user.fullName}`}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Date: {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                    <p>Time: {apt.timeSlot}</p>
                    <p className="mt-2 text-gray-700 italic">"{apt.symptoms}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}