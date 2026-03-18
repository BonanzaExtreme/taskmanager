import React from "react";
import Card from "../../components/card";
import "../../components/card.css";
import Calendar from "../../components/calendar";
import "../../components/calendar.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">Task Dashboard</h3>
      <section className="Top-Section">
        <Card title="Task 1" description="This is the first task." />
        <Card title="Task 2" description="This is the second task." />
        <Card title="Task 3" description="This is the third task." />
        <Card title="Task 4" description="This is the fourth task." />
      </section>
      <section className="Bottom-Section">
        <div className="BottomLeft-Section">
          <div className="TitleBottomLeft">Calendar</div>
          <div className="CalendarPlaceholder">
            <Calendar />
          </div>
        </div>
        <div className="BottomRight-Section">
          <div className="TitleBottomRight">Task Statistics</div>
          <div className="StatisticsPlaceholder"></div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
