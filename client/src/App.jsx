import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import TimeTracker from "@/pages/TimeTracker";
import ProtectedRoute from "@/context/ProtectedRoute";

function App() {
  return (
    <Routes>
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
      <Route path="/" element={<Login />} />
    </Routes>
  );
}

export default App;
