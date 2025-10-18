import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  User,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '../Theme/ThemeToggle';
import useAuthStore from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Overview & insights'
    },
    {
      name: 'Resumes',
      path: '/resumes',
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Build your resume',
      badge: 'New'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: Briefcase,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Showcase your work'
    },
    {
      name: 'Courses',
      path: '/courses',
      icon: GraduationCap,
      gradient: 'from-orange-500 to-red-500',
      description: 'Learning journey'
    },
    {
      name: 'Achievements',
      path: '/achievements',
      icon: Award,
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Your milestones'
    },
    {
      name: 'Skills',
      path: '/skills',
      icon: Code,
      gradient: 'from-indigo-500 to-purple-500',
      description: 'Technical expertise'
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: User,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Your information'
    },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="h-screen w-64 bg-white dark:bg-dark-900 border-r border-gray-200 dark:border-dark-800 flex flex-col transition-colors duration-300">
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-dark-800">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            ResumeBuilder
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isItemActive = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                transition-all duration-200
                ${isItemActive
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800'
                }
              `}
            >
              {/* Active Indicator */}
              {isItemActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
              )}

              {/* Icon */}
              <div className={`
                relative flex items-center justify-center w-8 h-8 rounded-lg
                transition-all duration-200
                ${isItemActive
                  ? `bg-gradient-to-br ${item.gradient}`
                  : 'bg-gray-100 dark:bg-dark-800 group-hover:bg-gray-200 dark:group-hover:bg-dark-700'
                }
              `}>
                <Icon className={`
                  w-4 h-4 transition-colors duration-200
                  ${isItemActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}
                `} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`
                    font-medium text-sm truncate
                    ${isItemActive ? 'text-blue-600 dark:text-blue-400' : ''}
                  `}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-xs font-semibold rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                {hoveredItem === item.name && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 animate-fade-in">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Arrow */}
              {isItemActive && (
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-fade-in" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-800 space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-800">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </span>
          <ThemeToggle />
        </div>

        {/* User Section */}
        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
