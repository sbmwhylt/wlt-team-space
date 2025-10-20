import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Microsites from "@/pages/Microsites";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import MicrositeTemplate from "@/pages/page-mircosites/MicrositeTemplate";

function App() {
  return (
    <>
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
          path="/microsites"
          element={
            <ProtectedRoute>
              <Microsites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microsites/:slug/"
          element={
            <ProtectedRoute>
              <MicrositeTemplate />
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
    </>
  );
}

export default App;
