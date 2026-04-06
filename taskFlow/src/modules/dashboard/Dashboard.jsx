import React, { useEffect, useMemo, useState } from "react";
import { listTasks } from "../../api";
import Card from "../../components/card";
import "../../components/card.css";
import Calendar from "../../components/calendar";
import "../../components/calendar.css";
import PieChart from "../../components/piechart";
import StatText from "../../components/stattext";

const TASK_COLORS = {
  open: "#64748b",
  inProgress: "#f59e0b",
  completed: "#16a34a",
  cancelled: "#dc2626",
  active: "#0ea5e9",
  closed: "#7c3aed",
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listTasks();
        setTasks(data ?? []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();

    const handleTasksChanged = () => {
      loadTasks();
    };

    window.addEventListener("taskflow:tasks-changed", handleTasksChanged);

    return () => {
      window.removeEventListener("taskflow:tasks-changed", handleTasksChanged);
    };
  }, []);

  const stats = useMemo(() => {
    const counts = {
      openTasks: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const task of tasks) {
      if (task.status === "todo") counts.openTasks += 1;
      else if (task.status === "in_progress") counts.inProgress += 1;
      else if (task.status === "done") counts.completed += 1;
      else if (task.status === "cancelled") counts.cancelled += 1;
    }
    const activeTasks = counts.openTasks + counts.inProgress;
    const closedTasks = counts.completed + counts.cancelled;

    return {
      openTasks: counts.openTasks,
      activeTasks,
      closedTasks,
      inProgress: counts.inProgress,
      completed: counts.completed,
      cancelled: counts.cancelled,
    };
  }, [tasks]);
  if (loading) {
    return <div className="dashboard-container">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard-container">Error: {error}</div>;
  }
  return (
    <div className="dashboard-container">
      <h3 className="dashboard-title">Task Dashboard</h3>
      <section className="Top-Section">
        <Card title="Open Tasks" description={stats.openTasks} />
        <Card title="In Progress" description={stats.inProgress} />
        <Card title="Completed" description={stats.completed} />
        <Card title="Cancelled" description={stats.cancelled} />
      </section>
      <section className="Bottom-Section">
        <div className="BottomLeft-Section">
          <div className="TitleBottomLeft">
            <h3>Calendar</h3>
          </div>
          <div className="CalendarPlaceholder">
            <Calendar tasks={tasks} />
          </div>
        </div>
        <div className="BottomRight-Section">
          <div className="TitleBottomRight">
            <h3>Task Statistics</h3>
          </div>
          <div className="StatisticsPlaceholder">
            <PieChart
              data={[
                {
                  id: 0,
                  value: stats.openTasks,
                  label: "Open",
                  color: TASK_COLORS.open,
                },
                {
                  id: 1,
                  value: stats.inProgress,
                  label: "In Progress",
                  color: TASK_COLORS.inProgress,
                },
                {
                  id: 2,
                  value: stats.completed,
                  label: "Completed",
                  color: TASK_COLORS.completed,
                },
                {
                  id: 3,
                  value: stats.cancelled,
                  label: "Cancelled",
                  color: TASK_COLORS.cancelled,
                },
              ]}
            />
          </div>
          <div className="StatsTextContainer">
            <div className="stats-primary-group">
              <StatText
                text="Open Tasks"
                count={stats.openTasks}
                color={TASK_COLORS.open}
              />
              <StatText
                text="In Progress"
                count={stats.inProgress}
                color={TASK_COLORS.inProgress}
              />
              <StatText
                text="Completed"
                count={stats.completed}
                color={TASK_COLORS.completed}
              />
              <StatText
                text="Cancelled"
                count={stats.cancelled}
                color={TASK_COLORS.cancelled}
              />
            </div>
            <div className="stats-summary-group">
              <StatText
                text="Active Tasks"
                count={stats.activeTasks}
                color={TASK_COLORS.active}
              />
              <StatText
                text="Closed Tasks"
                count={stats.closedTasks}
                color={TASK_COLORS.closed}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
