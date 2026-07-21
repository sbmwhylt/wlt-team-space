import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/context/ProtectedRoute";

import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/Dashboard";
import Announcements from "@/pages/Announcements";
import Microsites from "@/pages/Microsites";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
// import MicrositeTemplate from "@/pages/page-mircosites/MicrositeTemplate"; -> in system microsite
import Profile from "@/pages/Profile";
import Apps from "@/pages/Apps";
import PdfToCsv from "@/pages/apps/PdfToCsv";
import MicrositeLinkAudit from "@/pages/page-mircosites/MicrositeLinkAudit";
import NotFound from "@/pages/404";

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
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
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
            <ProtectedRoute roles={["admin", "super-admin"]}>
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

        <Route
          path="/profile/:username?"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apps"
          element={
            <ProtectedRoute>
              <Apps />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apps/pdf-to-csv"
          element={
            <ProtectedRoute>
              <PdfToCsv />
            </ProtectedRoute>
          }
        />

        <Route
          path="/microsites/link-audit"
          element={
            <ProtectedRoute>
              <MicrositeLinkAudit />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
