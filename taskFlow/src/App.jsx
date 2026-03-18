import React from "react";
import { MainLayout } from "./layouts";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Login, Signup, Settings, TaskList } from "./modules";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* MainLayout wraps the protected components */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <MainLayout>
            <TaskList />
          </MainLayout>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
