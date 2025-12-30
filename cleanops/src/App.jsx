import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* =======================
   COMPONENTS
======================= */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

/* =======================
   PUBLIC PAGES
======================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* =======================
   CITIZEN PAGES
======================= */
import RaiseRequest from "./pages/citizen/RaiseRequest";
import MyRequests from "./pages/citizen/MyRequests";
import RequestDetails from "./pages/citizen/RequestDetails";

/* =======================
   OPERATOR PAGES
======================= */
import OperatorAssigned from "./pages/Operator/OperatorAssigned";

/* =======================
   ADMIN PAGES
======================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminOperators from "./pages/admin/AdminOperators";

/* =======================
   COMMUNITY PAGES
======================= */
import CommunityList from "./pages/community/CommunityList";
import CommunityCreate from "./pages/community/CommunityCreate";
import CommunityDetails from "./pages/community/CommunityDetails";

export default function App() {
  return (
    <Router>
      {/* ========= NAVBAR ========= */}
      <Navbar />

      {/* ========= ROUTES ========= */}
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= CITIZEN ================= */}
        <Route
          path="/raise-request"
          element={
            <ProtectedRoute>
              <RaiseRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/request/:id"
          element={
            <ProtectedRoute>
              <RequestDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= COMMUNITY ================= */}
        <Route path="/community" element={<CommunityList />} />

        <Route
          path="/community/create"
          element={
            <ProtectedRoute>
              <CommunityCreate />
            </ProtectedRoute>
          }
        />

        <Route path="/community/:id" element={<CommunityDetails />} />

        {/* ================= OPERATOR ================= */}
        <Route
          path="/assigned"
          element={
            <RoleProtectedRoute allowedRoles={["operator"]}>
              <OperatorAssigned />
            </RoleProtectedRoute>
          }
        />

        {/* ================= ADMIN (WARD + SUPER) ================= */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["wardAdmin", "superAdmin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-analytics"
          element={
            <RoleProtectedRoute allowedRoles={["wardAdmin", "superAdmin"]}>
              <AdminAnalytics />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-operators"
          element={
            <RoleProtectedRoute allowedRoles={["wardAdmin", "superAdmin"]}>
              <AdminOperators />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
