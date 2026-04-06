import React, { useState, useMemo } from "react";

const Calendar = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  //Hook
  const tasksByDate = useMemo(() => {
    const grouped = {};

    for (const task of tasks) {
      if (!task.end_date) continue;

      // Keep date-only key: YYYY-MM-DD
      const dateKey = String(task.end_date).slice(0, 10);
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(task);
    }

    return grouped;
  }, [tasks]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getReminderStatusClass = (status) => {
    if (status === "done") return "reminder-done";
    if (status === "in_progress") return "reminder-in-progress";
    if (status === "cancelled") return "reminder-cancelled";
    return "reminder-todo";
  };

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={"empty-" + i} className="calendar-day empty"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === i;

    const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dueTasks = tasksByDate[dayKey] || [];
    const isTodayWithTasks = isToday && dueTasks.length > 0;
    days.push(
      <div
        key={i}
        className={`calendar-day ${isToday ? "today" : ""} ${isTodayWithTasks ? "isTodayWithTasks" : ""}`}
      >
        <div
          className={`day-number ${isTodayWithTasks ? "isTodayWithTasks-day-number" : ""}`}
        >
          {i}
        </div>
        <div className="reminders">
          {dueTasks.map((task) => (
            <div
              key={task.id}
              className={`reminder ${isTodayWithTasks ? "today-task" : ""} ${getReminderStatusClass(task.status)}`}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>,
    );
  }

  // Keep a fixed 6-row month view so the calendar height does not jump
  // between months that span 4/5/6 weeks.
  while (days.length < 42) {
    days.push(
      <div
        key={`tail-empty-${days.length}`}
        className="calendar-day empty"
      ></div>,
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

      <div className="calendar-grid calendar-body">{days}</div>
    </div>
  );
};

export default Calendar;
