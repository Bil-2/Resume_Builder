import { useState, useEffect } from 'react';
import { 
  FileText, Briefcase, GraduationCap, Award, Code, 
  TrendingUp, Plus, ArrowRight, Sparkles, Target,
  Calendar, Clock, CheckCircle, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

const Dashboard = () => {
  const [data, setData] = useState({
    resumes: [],
    projects: [],
    courses: [],
    achievements: [],
    skills: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resumes, projects, courses, achievements, skills] = await Promise.all([
        axios.get('/api/resumes?limit=3'),
        axios.get('/api/projects?limit=3'),
        axios.get('/api/courses?limit=3'),
        axios.get('/api/achievements?limit=3'),
        axios.get('/api/skills?limit=6'),
      ]);

      setData({
        resumes: resumes.data.data,
        projects: projects.data.data,
        courses: courses.data.data,
        achievements: achievements.data.data,
        skills: skills.data.data,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Resumes',
      value: data.resumes.length,
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      link: '/resumes',
      change: '+12%'
    },
    {
      label: 'Projects',
      value: data.projects.length,
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      link: '/projects',
      change: '+8%'
    },
    {
      label: 'Courses',
      value: data.courses.length,
      icon: GraduationCap,
      gradient: 'from-orange-500 to-red-500',
      link: '/courses',
      change: '+23%'
    },
    {
      label: 'Skills',
      value: data.skills.length,
      icon: Code,
      gradient: 'from-green-500 to-emerald-500',
      link: '/skills',
      change: '+15%'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-900">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div className="flex-1 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                <span className="text-white/80 font-medium">Welcome back!</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Build Your Future
              </h1>
              <p className="text-xl text-white/90 max-w-2xl">
                Track your progress, showcase your skills, and land your dream job
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 animate-float">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Target className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                to={stat.link}
                className="card-modern card-hover glass animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                  <span>{stat.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Resumes */}
            <div className="card-modern animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Recent Resumes
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your latest resume drafts
                    </p>
                  </div>
                </div>
                <Link
                  to="/resumes"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.resumes.length > 0 ? (
                <div className="space-y-3">
                  {data.resumes.map((resume) => (
                    <Link
                      key={resume._id}
                      to={`/resumes/${resume._id}/edit`}
                      className="block p-4 rounded-lg bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {resume.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {resume.template} template
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(resume.lastModified).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No resumes yet</p>
                  <Link to="/resumes/new" className="btn-modern inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Resume
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Projects */}
            <div className="card-modern animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Active Projects
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Projects you're working on
                    </p>
                  </div>
                </div>
                <Link
                  to="/projects"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {data.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project._id}/edit`}
                      className="p-4 rounded-lg border border-gray-200 dark:border-dark-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors duration-200 group"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full ${
                          project.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet</p>
                  <Link to="/projects/new" className="btn-modern inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Skills */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card-modern animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { label: 'Create Resume', icon: FileText, link: '/resumes/new', gradient: 'from-blue-500 to-cyan-500' },
                  { label: 'Add Project', icon: Briefcase, link: '/projects/new', gradient: 'from-purple-500 to-pink-500' },
                  { label: 'Log Course', icon: GraduationCap, link: '/courses/new', gradient: 'from-orange-500 to-red-500' },
                  { label: 'Add Skill', icon: Code, link: '/skills/new', gradient: 'from-green-500 to-emerald-500' },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.link}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-200 group"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="flex-1 font-medium text-gray-900 dark:text-white">
                        {action.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Top Skills */}
            <div className="card-modern animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Top Skills
              </h2>
              {data.skills.length > 0 ? (
                <div className="space-y-3">
                  {data.skills.slice(0, 5).map((skill) => (
                    <div key={skill._id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        skill.proficiency === 'expert' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : skill.proficiency === 'advanced'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {skill.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Code className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No skills added yet</p>
                </div>
              )}
              <Link
                to="/skills"
                className="mt-4 block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                View all skills →
              </Link>
            </div>

            {/* Recent Achievements */}
            <div className="card-modern animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Achievements
                </h2>
              </div>
              {data.achievements.length > 0 ? (
                <div className="space-y-3">
                  {data.achievements.map((achievement) => (
                    <div
                      key={achievement._id}
                      className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {achievement.title}
                      </h3>
                      {achievement.date && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Award className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No achievements yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
