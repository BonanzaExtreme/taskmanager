import React from "react";
import Card from "../../components/card";
import "../../components/card.css";
import Calendar from "../../components/calendar";
import "../../components/calendar.css";
import PieChart from "../../components/piechart";
import StatText from "../../components/stattext";

const Dashboard = () => {
  let openTasks = 10;
  let inProgress = 7;
  let completed = 3;
  let cancelled = 2;
  let activeTasks = openTasks + inProgress;
  let closedTasks = completed + cancelled;

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
          <div className="TitleBottomLeft">
            <h3>Calendar</h3>
          </div>
          <div className="CalendarPlaceholder">
            <Calendar />
          </div>
        </div>
        <div className="BottomRight-Section">
          <div className="TitleBottomRight">
            <h3>Task Statistics</h3>
          </div>
          <div className="StatisticsPlaceholder">
            <PieChart
              data={[
                { id: 0, value: openTasks, label: "Open" },
                { id: 1, value: inProgress, label: "In Progress" },
                { id: 2, value: completed, label: "Completed" },
                { id: 3, value: cancelled, label: "Cancelled" },
              ]}
            />
          </div>
          <div className="StatsTextContainer">
            <StatText text="Open Tasks" count={openTasks} />
            <StatText text="In Progress" count={inProgress} />
            <StatText text="Completed" count={completed} />
            <StatText text="Cancelled" count={cancelled} />
            <StatText text="Active Tasks" count={activeTasks} />
            <StatText text="Closed Tasks" count={closedTasks} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
