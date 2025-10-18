import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, GraduationCap, Award, Code, Plus, Sparkles, ArrowRight, Zap, Clock } from 'lucide-react';
import { resumeAPI, projectAPI, courseAPI, achievementAPI, skillAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import DashboardSkeleton from '../../components/Loading/DashboardSkeleton';
import StatCard from '../../components/Dashboard/StatCard';

const Dashboard = () => {
  const { user } = useAuthStore();
  useScrollAnimation();
  const [stats, setStats] = useState({
    resumes: 0,
    projects: 0,
    courses: 0,
    achievements: 0,
    skills: 0,
  });
  const [recentResumes, setRecentResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    // Double check authentication before making any API calls
    const token = localStorage.getItem('token');
    if (!token || !user) {
      console.log('[Dashboard] No auth token or user, skipping data fetch');
      setLoading(false);
      return;
    }

    try {
      // Progressive loading - fetch data as it becomes available
      const dataPromises = {
        resumes: resumeAPI.getAll(),
        projects: projectAPI.getAll(),
        courses: courseAPI.getAll(),
        achievements: achievementAPI.getAll(),
        skills: skillAPI.getAll(),
      };

      // Update stats progressively as each request completes
      Object.entries(dataPromises).forEach(([key, promise]) => {
        promise.then(res => {
          setStats(prev => ({
            ...prev,
            [key]: res.data.count
          }));
          
          // Set recent resumes when available
          if (key === 'resumes') {
            setRecentResumes(res.data.data.slice(0, 3));
          }
        }).catch(error => {
          console.error(`Error fetching ${key}:`, error);
        });
      });

      // Wait for all to complete before removing loading state
      await Promise.all(Object.values(dataPromises));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      icon: FileText, 
      label: 'Resumes', 
      value: stats.resumes, 
      gradient: 'from-blue-500 to-cyan-500', 
      link: '/resumes',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      icon: Briefcase, 
      label: 'Projects', 
      value: stats.projects, 
      gradient: 'from-purple-500 to-pink-500', 
      link: '/projects',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      icon: GraduationCap, 
      label: 'Courses', 
      value: stats.courses, 
      gradient: 'from-green-500 to-emerald-500', 
      link: '/courses',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    { 
      icon: Award, 
      label: 'Achievements', 
      value: stats.achievements, 
      gradient: 'from-orange-500 to-red-500', 
      link: '/achievements',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      icon: Code, 
      label: 'Skills', 
      value: stats.skills, 
      gradient: 'from-indigo-500 to-purple-500', 
      link: '/skills',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
  ];

  const quickActions = [
    {
      icon: FileText,
      label: 'New Resume',
      description: 'Create a professional resume',
      link: '/resumes/new',
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Briefcase,
      label: 'Add Project',
      description: 'Showcase your work',
      link: '/projects/new',
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: GraduationCap,
      label: 'Add Course',
      description: 'Track your learning',
      link: '/courses/new',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Award,
      label: 'Add Achievement',
      description: 'Celebrate success',
      link: '/achievements/new',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30'
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  const totalItems = stats.resumes + stats.projects + stats.courses + stats.achievements + stats.skills;
  const profileComplete = Math.min((totalItems / 20) * 100, 100); // Assume 20 items for complete profile

  return (
    <div className="space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-10 text-white shadow-2xl fade-in-scale delay-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="text-white/90 font-medium">Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}! 👋✨
          </h1>
          <p className="text-white/90 text-lg mb-6 max-w-2xl">
            Track your career progress and build stunning resumes that stand out
          </p>
          
          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-bold">{Math.round(profileComplete)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${profileComplete}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="scroll-animate bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
            <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your career today 🚀
          </p>
          </div>
          <Zap className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="scroll-animate group relative bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-dark-700 dark:to-dark-600 p-6 rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-dark-500"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className={`${action.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <action.icon className={`text-${action.gradient.split(' ')[1].split('-')[1]}-600`} size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{action.label}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{action.description}</p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Resumes */}
      {recentResumes.length > 0 && (
        <div className="scroll-animate bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Resumes</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Continue working on your resumes</p>
            </div>
            <Link to="/resumes" className="group flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentResumes.map((resume, index) => (
              <Link
                key={resume._id}
                to={`/resumes/${resume._id}/preview`}
                className="scroll-animate group relative bg-gradient-to-br from-gray-50 to-white dark:from-dark-700 dark:to-dark-600 p-5 rounded-xl border border-gray-200 dark:border-dark-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{resume.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(resume.lastModified).toLocaleDateString()}</span>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {resume.template}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
