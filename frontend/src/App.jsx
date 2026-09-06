import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';

// Admin Pages
import ProtectedAdminRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardHome from './pages/admin/DashboardHome';
import ProjectsManager from './pages/admin/ProjectsManager';
import ProjectEditor from './pages/admin/ProjectEditor';
import ExperienceManager from './pages/admin/ExperienceManager';
import EducationManager from './pages/admin/EducationManager';
import SkillsManager from './pages/admin/SkillsManager';
import CertificationsManager from './pages/admin/CertificationsManager';
import MediaManager from './pages/admin/MediaManager';
import SettingsManager from './pages/admin/SettingsManager';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="projects/new" element={<ProjectEditor />} />
                <Route path="projects/:id" element={<ProjectEditor />} />
                <Route path="experience" element={<ExperienceManager />} />
                <Route path="education" element={<EducationManager />} />
                <Route path="skills" element={<SkillsManager />} />
                <Route path="certifications" element={<CertificationsManager />} />
                <Route path="media" element={<MediaManager />} />
                <Route path="settings" element={<SettingsManager />} />
              </Route>
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
