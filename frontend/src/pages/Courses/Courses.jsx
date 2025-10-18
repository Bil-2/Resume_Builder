import { useState, useEffect } from 'react';
import { Plus, BookOpen, TrendingUp, Clock, CheckCircle, Search, Award, Calendar, Target, Zap, Star, ChevronRight, Filter, Trophy, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { courseAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useCountUp from '../../hooks/useCountUp';
import useAuthStore from '../../store/authStore';

const Courses = () => {
  useScrollAnimation();
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'planned': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    };
    return colors[status] || colors['planned'];
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'text-green-600 dark:text-green-400',
      'intermediate': 'text-yellow-600 dark:text-yellow-400',
      'advanced': 'text-red-600 dark:text-red-400',
    };
    return colors[difficulty] || colors['beginner'];
  };

  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch = course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institution?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: courses.length,
    completed: courses.filter(c => c.status === 'completed').length,
    inProgress: courses.filter(c => c.status === 'in-progress').length,
    avgProgress: courses.length > 0 
      ? Math.round(courses.reduce((acc, c) => acc + (c.progress || 0), 0) / courses.length)
      : 0,
  };

  // Animated counters
  const totalCount = useCountUp(stats.total, 1000);
  const completedCount = useCountUp(stats.completed, 1200);
  const inProgressCount = useCountUp(stats.inProgress, 1400);
  const avgProgressCount = useCountUp(stats.avgProgress, 1600);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900/90 dark:via-purple-900/90 dark:to-pink-900/90">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Icon with glow */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl mb-6 shadow-2xl fade-in-scale delay-100">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 slide-in-bottom delay-200">
              📚 Learning Journey
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto slide-in-bottom delay-300">
              Track your courses, certifications, and continuous learning path 🎓✨
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 fade-in delay-500">
              <Link
                to="/courses/new"
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add New Course
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border-2 border-white/20 hover:border-white/40">
                View Completed
              </button>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="currentColor"
              className="text-gray-50 dark:text-gray-900"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Total Courses', 
              value: totalCount, 
              icon: BookOpen, 
              gradient: 'from-blue-500 via-blue-600 to-cyan-500',
              bgGradient: 'from-blue-500/10 to-cyan-500/10',
              iconBg: 'bg-blue-500'
            },
            { 
              label: 'Completed', 
              value: completedCount, 
              icon: Trophy, 
              gradient: 'from-green-500 via-emerald-600 to-teal-500',
              bgGradient: 'from-green-500/10 to-teal-500/10',
              iconBg: 'bg-green-500'
            },
            { 
              label: 'In Progress', 
              value: inProgressCount, 
              icon: Zap, 
              gradient: 'from-purple-500 via-pink-600 to-rose-500',
              bgGradient: 'from-purple-500/10 to-rose-500/10',
              iconBg: 'bg-purple-500'
            },
            { 
              label: 'Avg Progress', 
              value: `${avgProgressCount}%`, 
              icon: TrendingUp, 
              gradient: 'from-orange-500 via-red-600 to-pink-500',
              bgGradient: 'from-orange-500/10 to-pink-500/10',
              iconBg: 'bg-orange-500'
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="scroll-animate group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-105 overflow-hidden"
              style={{transitionDelay: `${index * 100}ms`}}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`${stat.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Search and Filter */}
        <div className="scroll-animate bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by name or institution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Courses', icon: BookOpen },
                { value: 'in-progress', label: 'In Progress', icon: Zap },
                { value: 'completed', label: 'Completed', icon: CheckCircle },
                { value: 'planned', label: 'Planned', icon: Target },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`
                    group px-5 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2 border-2
                    ${filter === option.value
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                    }
                  `}
                >
                  <option.icon className={`w-4 h-4 ${filter === option.value ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Courses Grid/List */}
        {filteredCourses.length === 0 ? (
          <div className="scroll-animate bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchTerm || filter !== 'all' ? 'No courses found' : 'Start Your Learning Journey'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term to find what you\'re looking for'
                : 'Begin tracking your educational progress by adding your first course'
              }
            </p>
            
            <Link
              to="/courses/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Your First Course
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <Link
                key={course._id}
                to={`/courses/${course._id}/edit`}
                className="scroll-animate group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
                style={{transitionDelay: `${index * 50}ms`}}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(course.status)}`}>
                      {course.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                      {course.status === 'in-progress' && <Zap className="w-3.5 h-3.5" />}
                      {course.status === 'planned' && <Target className="w-3.5 h-3.5" />}
                      {course.status}
                    </span>
                    
                    {course.difficulty && (
                      <span className={`text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {course.courseName}
                  </h3>

                  {/* Institution */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {course.institution}
                  </p>

                  {/* Category */}
                  {course.category && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 mb-4">
                      📚 {course.category}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                      <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        {course.progress || 0}%
                      </span>
                    </div>
                    
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${course.progress || 0}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {course.startDate
                          ? new Date(course.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Not started'
                        }
                      </span>
                    </div>
                    
                    {course.status === 'completed' && (
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                        <Award className="w-4 h-4" />
                        Done
                      </div>
                    )}

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
