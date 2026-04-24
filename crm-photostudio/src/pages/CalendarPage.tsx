import { useState, useEffect } from 'react';
import { demoApi } from '@/services/demoApi';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Clock, MapPin } from 'lucide-react';
import type { CalendarEvent } from '@/types';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demoApi.getEvents().then((data) => { setEvents(data); setLoading(false); });
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const eventsForDay = (day: number) =>
    events.filter((e) => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Calendar</h2>
          <p className="text-slate-400 text-sm">{events.length} upcoming events</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold w-32 text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-xs text-slate-500 font-medium py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month;
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg p-1.5 border transition-colors ${
                    isToday ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>{day}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayEvents.map((e) => (
                        <div key={e.id} className="w-full h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="bg-[#0d1321] border border-white/5 rounded-xl p-4">
          <h3 className="font-semibold text-sm mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: evt.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{evt.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><CalIcon className="w-3 h-3" />{evt.date.slice(0, 10)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(evt.duration_minutes / 60 * 10) / 10}h</span>
                  </div>
                  {evt.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{evt.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
