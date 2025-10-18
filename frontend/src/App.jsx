import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { initScrollAnimations } from './hooks/useScrollAnimation';
import './utils/verifyDarkMode'; // Dark mode verification utility
import './utils/verifyResponsive'; // Responsive design verification utility

// Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/Auth/PrivateRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ResumeList from './pages/Resume/ResumeList';
import ResumeBuilder from './pages/Resume/ResumeBuilder';
import ResumePreview from './pages/Resume/ResumePreview';
import Projects from './pages/Projects/Projects';
import ProjectForm from './pages/Projects/ProjectForm';
import Courses from './pages/Courses/Courses';
import CourseForm from './pages/Courses/CourseForm';
import Achievements from './pages/Achievements/Achievements';
import AchievementForm from './pages/Achievements/AchievementForm';
import Skills from './pages/Skills/Skills';
import SkillForm from './pages/Skills/SkillForm';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import License from './pages/License';
import NotFound from './pages/NotFound';

function App() {
  const { initAuth, isAuthenticated } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    initAuth();
    initializeTheme(); // Initialize theme on app load
  }, [initAuth, initializeTheme]);

  // Initialize scroll animations globally for all pages
  useEffect(() => {
    const cleanup = initScrollAnimations();
    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/license" element={<License />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Resume routes */}
          <Route path="/resumes" element={<ResumeList />} />
          <Route path="/resumes/new" element={<ResumeBuilder />} />
          <Route path="/resumes/:id/edit" element={<ResumeBuilder />} />
          <Route path="/resumes/:id/preview" element={<ResumePreview />} />
          
          {/* Project routes */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />
          
          {/* Course routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/new" element={<CourseForm />} />
          <Route path="/courses/:id/edit" element={<CourseForm />} />
          
          {/* Achievement routes */}
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/achievements/new" element={<AchievementForm />} />
          <Route path="/achievements/:id/edit" element={<AchievementForm />} />
          
          {/* Skill routes */}
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/new" element={<SkillForm />} />
          <Route path="/skills/:id/edit" element={<SkillForm />} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Settings routes */}
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
