import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import Impact from "./pages/Impact";
import Help from "./pages/Help";

// Citizen Components
import Dashboard from "./components/citizen/Dashboard";
import Report from "./components/citizen/Report";
import Map from "./components/citizen/Map";
import Leaderboard from "./components/citizen/Leaderboard";
import Rewards from "./components/citizen/Rewards";
import Community from "./components/citizen/Community";
import CitizenSettings from "./components/citizen/Settings";

// Ragpicker Components
import RagpickerTasks from "./components/ragpicker/Tasks";
import RagpickerMap from "./components/ragpicker/Map";
import RagpickerEarnings from "./components/ragpicker/Earnings";
import RagpickerProfile from "./components/ragpicker/Profile";

// Admin Components
import AdminDashboard from "./components/admin/Dashboard";
import AdminModeration from "./components/admin/Moderation";
import AdminAssignment from "./components/admin/Assignment";
import AdminHeatmap from "./components/admin/Heatmap";
import AdminUsers from "./components/admin/Users";
import AdminPartners from "./components/admin/Partners";
import AdminSettings from "./components/admin/Settings";

// Institution Components
import InstitutionDashboard from "./components/instituitions/Dashboard";
import InstitutionReports from "./components/instituitions/Reports";
import InstitutionMembers from "./components/instituitions/Members";
import InstitutionAnalytics from "./components/instituitions/Analytics";
import InstitutionSettings from "./components/instituitions/Settings";

// Auth Components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// NotFound
import NotFound from "./components/NotFound";

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
              {/* Public Routes - Only accessible when NOT logged in */}
              <Route path="/" element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } />
              <Route path="/impact" element={
                <PublicRoute>
                  <Impact />
                </PublicRoute>
              } />
              <Route path="/help" element={
                <PublicRoute>
                  <Help />
                </PublicRoute>
              } />
              
              {/* Auth Routes - Only accessible when NOT logged in */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Citizen Routes - Protected */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/report" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Report />
                </ProtectedRoute>
              } />
              <Route path="/report/new" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Report />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Map />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/rewards" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Rewards />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenSettings />
                </ProtectedRoute>
              } />
              
              {/* Ragpicker Routes - Protected */}
              <Route path="/r/tasks" element={
                <ProtectedRoute allowedRoles={['ragpicker']}>
                  <RagpickerTasks />
                </ProtectedRoute>
              } />
              <Route path="/r/map" element={
                <ProtectedRoute allowedRoles={['ragpicker']}>
                  <RagpickerMap />
                </ProtectedRoute>
              } />
              <Route path="/r/earnings" element={
                <ProtectedRoute allowedRoles={['ragpicker']}>
                  <RagpickerEarnings />
                </ProtectedRoute>
              } />
              <Route path="/r/profile" element={
                <ProtectedRoute allowedRoles={['ragpicker']}>
                  <RagpickerProfile />
                </ProtectedRoute>
              } />
              
              {/* Institution Routes - Protected */}
              <Route path="/org/dashboard" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionDashboard />
                </ProtectedRoute>
              } />
              <Route path="/org/reports" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionReports />
                </ProtectedRoute>
              } />
              <Route path="/org/members" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionMembers />
                </ProtectedRoute>
              } />
              <Route path="/org/analytics" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionAnalytics />
                </ProtectedRoute>
              } />
              <Route path="/org/settings" element={
                <ProtectedRoute allowedRoles={['institution']}>
                  <InstitutionSettings />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin/overview" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/moderation" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminModeration />
                </ProtectedRoute>
              } />
              <Route path="/admin/assign" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAssignment />
                </ProtectedRoute>
              } />
              <Route path="/admin/heatmap" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHeatmap />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/partners" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPartners />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
);

export default App;
