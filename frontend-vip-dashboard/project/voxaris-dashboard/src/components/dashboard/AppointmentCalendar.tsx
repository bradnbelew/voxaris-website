import React from 'react';
import { Appointment } from '../../types/dashboard.types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onStatusChange: () => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ appointments }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments scheduled.</p>
        ) : (
            appointments.map(apt => (
                <div key={apt.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-medium text-gray-900">{apt.contactName}</p>
                        <p className="text-sm text-gray-600">{apt.vehicle}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">
                            {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                        </p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{apt.status}</span>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
