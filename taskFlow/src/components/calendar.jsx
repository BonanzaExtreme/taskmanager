import React, { useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reminders, setReminders] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const addReminder = (day) => {
    const text = prompt("Enter reminder:");
    if (!text) return;

    const key = `${year}-${month}-${day}`;

    setReminders((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), text],
    }));
  };

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={"empty-" + i} className="calendar-day empty"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const key = `${year}-${month}-${i}`;

    days.push(
      <div key={i} className="calendar-day" onClick={() => addReminder(i)}>
        <div className="day-number">{i}</div>

        <div className="reminders">
          {(reminders[key] || []).map((r, index) => (
            <div key={index} className="reminder">
              {r}
            </div>
          ))}
        </div>
      </div>,
    );
  }

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h2>
          {monthName} {year}
        </h2>
        <button onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid calendar-days">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="calendar-day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">{days}</div>
    </div>
  );
};

export default Calendar;
