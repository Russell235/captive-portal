import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Login from "./pages/login";
import AdminLogin from "./pages/admin_login";
import BandwidthPage from "./pages/admin/bandwidth";
import ExamsPage from "./pages/admin/exams";
// Layouts
import { StudentLayout } from "./components/ui/student-layout";
import { AdminLayout } from "./components/ui/admin-layout";

// Student Pages
import Dashboard from "./pages/student/dashboard";
import Profile from "./pages/student/profil";
import Timetable from "./pages/student/timetable";
import Notifications from "./pages/student/notification";
import Documents from "./pages/student/documents";
import Support from "./pages/student/support";
import Faq from "./pages/student/faq";
import Settings from "./pages/student/settings";

// Admin Pages
import AdminDashboard from "./pages/admin/dashboard";
import StudentsPage from "./pages/admin/students";
import SessionsPage from "./pages/admin/session";
import DevicesPage from "./pages/admin/devices";
import TimetablePage from "./pages/admin/timetables";
import AnnouncementsPage from "./pages/admin/announcements";
import DocumentsPage from "./pages/admin/documents";
import TicketsPage from "./pages/admin/tickets";
import AdministratorsPage from "./pages/admin/administrator";
import ReportsPage from "./pages/admin/report";
import LogsPage from "./pages/admin/logs";
import SettingsPage from "./pages/admin/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Student Pages */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<Dashboard />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/timetable" element={<Timetable />} />
          <Route path="/student/notifications" element={<Notifications />} />
          <Route path="/student/documents" element={<Documents />} />
          <Route path="/student/support" element={<Support />} />
          <Route path="/student/faq" element={<Faq />} />
          <Route path="/student/settings" element={<Settings />} />
        </Route>

        {/* Admin Pages */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/sessions" element={<SessionsPage />} />
          <Route path="/admin/devices" element={<DevicesPage />} />
          <Route path="/admin/timetable" element={<TimetablePage />} />
          <Route path="/admin/announcements" element={<AnnouncementsPage />} />
          <Route path="/admin/documents" element={<DocumentsPage />} />
          <Route path="/admin/tickets" element={<TicketsPage/>} />
          <Route
            path="/admin/administrators"
            element={<AdministratorsPage />}
          />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/logs" element={<LogsPage />} />
          <Route path="/admin/bandwidth" element={<BandwidthPage />} />
         <Route path="/admin/exams" element={<ExamsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
