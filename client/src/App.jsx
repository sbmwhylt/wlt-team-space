import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import TimeTracker from "@/pages/TimeTracker";
import Microsites from "@/pages/Microsites";

import ProtectedRoute from "@/context/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-tracker"
        element={
          <ProtectedRoute>
            <TimeTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/microsites"
        element={
          <ProtectedRoute>
            <Microsites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
