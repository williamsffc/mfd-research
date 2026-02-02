import React, { useState } from 'react';
import { SlideLayout } from '@/components/slides/SlideLayout';
import { Clock, Video, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const getDaysInMonth = () => {
  const days: (number | null)[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  return days;
};

export default function Slide04CalendarBooking() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const days = getDaysInMonth();
  const today = new Date().getDate();
  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setIsBooked(true);
    }
  };

  if (isBooked) {
    return (
      <SlideLayout variant="default">
        <div className="flex flex-col justify-center items-center h-full px-20 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-slide-success/20 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-slide-success" strokeWidth={2} />
          </div>
          <h2 className="type-h2 text-slide-gray-900 mb-4">Demo Booked!</h2>
          <p className="type-body text-slide-gray-600 mb-8">
            {monthName.split(' ')[0]} {selectedDate} at {selectedTime}
          </p>
          <button
            onClick={() => {
              setIsBooked(false);
              setSelectedDate(null);
              setSelectedTime(null);
            }}
            className="px-6 py-3 rounded-xl bg-slide-primary text-white type-body font-medium hover:opacity-90 transition-opacity"
          >
            Book Another
          </button>
        </div>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout variant="default">
      <div className="flex flex-col h-full px-20 py-16">
        {/* Header */}
        <div className="mb-8">
          <p className="type-label text-slide-accent mb-2">Schedule a Demo</p>
          <h2 className="type-h2 text-slide-gray-900 mb-2">Forms and Booking Flows</h2>
          <p className="type-body text-slide-gray-500">
            Interactive calendar component — try selecting a date and time
          </p>
        </div>

        {/* Calendar layout */}
        <div className="flex-1 flex gap-8">
          {/* Calendar */}
          <div className="flex-1 bg-slide-gray-100 rounded-2xl p-6 border border-slide-gray-200">
            {/* Month header */}
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-slide-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slide-gray-600" />
              </button>
              <h3 className="type-body font-semibold text-slide-gray-900">{monthName}</h3>
              <button className="p-2 hover:bg-slide-gray-200 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-slide-gray-600" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center type-caption font-medium text-slide-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <button
                  key={index}
                  disabled={day === null || day < today}
                  onClick={() => day && day >= today && setSelectedDate(day)}
                  className={cn(
                    "h-12 w-full rounded-lg type-body font-medium transition-all flex items-center justify-center",
                    day === null && "invisible",
                    day !== null && day < today && "text-slide-gray-300 cursor-not-allowed",
                    day !== null && day >= today && "hover:bg-slide-accent-muted text-slide-gray-700 cursor-pointer",
                    day === today && "ring-2 ring-slide-accent ring-offset-2",
                    selectedDate === day && day !== null && "bg-slide-accent text-white hover:bg-slide-accent"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time slots */}
          <div className="w-64 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-slide-gray-400" />
              <span className="type-caption font-medium text-slide-gray-600">Available Times</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto">
              {timeSlots.map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  disabled={!selectedDate}
                  className={cn(
                    "w-full py-3 px-4 rounded-xl type-caption font-medium transition-all",
                    !selectedDate && "bg-slide-gray-100 text-slide-gray-400 cursor-not-allowed",
                    selectedDate && "bg-slide-gray-100 hover:bg-slide-accent-muted text-slide-gray-700",
                    selectedTime === time && "bg-slide-accent text-white hover:bg-slide-accent"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>

            {/* Book button */}
            <button
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
              className={cn(
                "mt-4 w-full py-4 rounded-xl type-body font-semibold flex items-center justify-center gap-2 transition-all",
                selectedDate && selectedTime
                  ? "bg-slide-accent text-white hover:opacity-90"
                  : "bg-slide-gray-200 text-slide-gray-400 cursor-not-allowed"
              )}
            >
              <Video className="w-5 h-5" />
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}
