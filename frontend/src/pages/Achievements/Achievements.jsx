import { useState, useEffect } from 'react';
import { Plus, Award, Trophy, Star, Medal, Search, Calendar, Sparkles, Crown, Target, Gem, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { achievementAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useCountUp from '../../hooks/useCountUp';
import useAuthStore from '../../store/authStore';

const Achievements = () => {
  useScrollAnimation();
  const { user } = useAuthStore();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const res = await achievementAPI.getAll();
      setAchievements(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'award': Trophy,
      'certification': Award,
      'competition': Medal,
      'recognition': Star,
    };
    return icons[category] || Award;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'award': 'from-yellow-500 via-amber-500 to-orange-500',
      'certification': 'from-blue-500 via-indigo-500 to-purple-500',
      'competition': 'from-purple-500 via-pink-500 to-rose-500',
      'recognition': 'from-green-500 via-emerald-500 to-teal-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getBadgeStyle = (category) => {
    const styles = {
      'award': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
      'certification': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      'competition': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      'recognition': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    };
    return styles[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = filter === 'all' || achievement.category === filter;
    const matchesSearch = achievement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: achievements.length,
    awards: achievements.filter(a => a.category === 'award').length,
    certifications: achievements.filter(a => a.category === 'certification').length,
    competitions: achievements.filter(a => a.category === 'competition').length,
  };

  // Animated counters
  const totalCount = useCountUp(stats.total, 1000);
  const awardsCount = useCountUp(stats.awards, 1200);
  const certificationsCount = useCountUp(stats.certifications, 1400);
  const competitionsCount = useCountUp(stats.competitions, 1600);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading achievements..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      {/* Epic Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 dark:from-yellow-900/90 dark:via-orange-900/90 dark:to-red-900/90">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Trophy Icon with Glow */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl fade-in-scale delay-100 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-3xl animate-pulse"></div>
              <Trophy className="w-12 h-12 text-white relative z-10" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 slide-down delay-200">
              🏆 Achievements & Awards
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto slide-up delay-300">
              Celebrating milestones, accomplishments, and recognition ✨🎉
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 fade-in delay-500">
              <Link
                to="/achievements/new"
                className="group px-8 py-4 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add Achievement
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border-2 border-white/20 hover:border-white/40">
                View Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="currentColor"
              className="text-amber-50 dark:text-gray-900"
              d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,69.3C672,64,768,64,864,69.3C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Total Achievements', 
              value: totalCount, 
              icon: Crown, 
              gradient: 'from-yellow-500 via-amber-600 to-orange-500',
              bgGradient: 'from-yellow-500/10 to-orange-500/10',
              iconBg: 'bg-yellow-500',
              glowColor: 'shadow-yellow-500/50'
            },
            { 
              label: 'Awards Won', 
              value: awardsCount, 
              icon: Trophy, 
              gradient: 'from-purple-500 via-pink-600 to-rose-500',
              bgGradient: 'from-purple-500/10 to-rose-500/10',
              iconBg: 'bg-purple-500',
              glowColor: 'shadow-purple-500/50'
            },
            { 
              label: 'Certifications', 
              value: certificationsCount, 
              icon: Award, 
              gradient: 'from-blue-500 via-indigo-600 to-purple-500',
              bgGradient: 'from-blue-500/10 to-purple-500/10',
              iconBg: 'bg-blue-500',
              glowColor: 'shadow-blue-500/50'
            },
            { 
              label: 'Competitions', 
              value: competitionsCount, 
              icon: Medal, 
              gradient: 'from-green-500 via-emerald-600 to-teal-500',
              bgGradient: 'from-green-500/10 to-teal-500/10',
              iconBg: 'bg-green-500',
              glowColor: 'shadow-green-500/50'
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="scroll-animate group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-105 overflow-hidden"
              style={{transitionDelay: `${index * 100}ms`}}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`${stat.iconBg} ${stat.glowColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                
                <div className={`text-4xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
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
                placeholder="Search achievements by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', icon: Sparkles },
                { value: 'award', label: 'Awards', icon: Trophy },
                { value: 'certification', label: 'Certifications', icon: Award },
                { value: 'competition', label: 'Competitions', icon: Medal },
                { value: 'recognition', label: 'Recognition', icon: Star },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`
                    group px-5 py-3 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2 border-2
                    ${filter === option.value
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-transparent shadow-lg scale-105'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md'
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

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="scroll-animate bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full mb-6">
              <Trophy className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchTerm || filter !== 'all' ? 'No achievements found' : 'Start Your Success Story'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term to find what you\'re looking for'
                : 'Begin documenting your accomplishments and celebrate every milestone'
              }
            </p>
            
            <Link
              to="/achievements/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Your First Achievement
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => {
              const CategoryIcon = getCategoryIcon(achievement.category);
              const categoryGradient = getCategoryColor(achievement.category);
              const badgeStyle = getBadgeStyle(achievement.category);

              return (
                <Link
                  key={achievement._id}
                  to={`/achievements/${achievement._id}/edit`}
                  className="scroll-animate group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
                  style={{transitionDelay: `${index * 50}ms`}}
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Featured badge */}
                  {achievement.featured && (
                    <div className="absolute top-4 right-4 p-2 bg-yellow-400 rounded-full shadow-lg z-10">
                      <Star className="w-4 h-4 text-white fill-current" />
                    </div>
                  )}

                  <div className="relative">
                    {/* Icon with gradient background */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${categoryGradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </div>

                    {/* Category Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${badgeStyle} mb-3`}>
                      {achievement.category}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                      {achievement.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {achievement.description}
                    </p>

                    {/* Issuer */}
                    {achievement.issuer && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <Award className="w-4 h-4" />
                        <span className="font-medium">{achievement.issuer}</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {achievement.date
                            ? new Date(achievement.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : 'Date not set'
                          }
                        </span>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
