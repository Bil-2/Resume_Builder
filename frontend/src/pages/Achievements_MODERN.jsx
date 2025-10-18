import { useState, useEffect } from 'react';
import { Plus, Award, Trophy, Star, Medal, Filter, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get('/api/achievements');
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
      'award': 'from-yellow-500 to-orange-500',
      'certification': 'from-blue-500 to-cyan-500',
      'competition': 'from-purple-500 to-pink-500',
      'recognition': 'from-green-500 to-emerald-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
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
    featured: achievements.filter(a => a.featured).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading achievements..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 dark:from-yellow-900 dark:via-orange-900 dark:to-red-900">
        <div className="absolute inset-0 dot-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-float">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Achievements
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Celebrate your milestones and successes
            </p>
            <Link
              to="/achievements/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Achievement
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-16 mb-8">
          {[
            { label: 'Total Achievements', value: stats.total, icon: Trophy, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Awards', value: stats.awards, icon: Award, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Certifications', value: stats.certifications, icon: Medal, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Featured', value: stats.featured, icon: Star, gradient: 'from-green-500 to-emerald-500' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass p-6 rounded-xl animate-slide-up glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center mb-4 animate-float`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 input-modern"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'award', label: 'Awards' },
              { value: 'certification', label: 'Certifications' },
              { value: 'competition', label: 'Competitions' },
              { value: 'recognition', label: 'Recognition' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${filter === option.value
                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <div className="card-modern text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term'
                : 'Start documenting your success story by adding your first achievement'
              }
            </p>
            <Link
              to="/achievements/new"
              className="btn-modern inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Achievement
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement, index) => {
              const IconComponent = getCategoryIcon(achievement.category);
              const gradient = getCategoryColor(achievement.category);

              return (
                <Link
                  key={achievement._id}
                  to={`/achievements/${achievement._id}/edit`}
                  className="card-modern card-hover group animate-fade-in relative overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Featured Badge */}
                  {achievement.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-glow">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 animate-float`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-2">
                    {achievement.title}
                  </h3>
                  
                  {achievement.issuer && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {achievement.issuer}
                    </p>
                  )}

                  {achievement.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {achievement.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm">
                    {achievement.date && (
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(achievement.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className={`badge bg-gradient-to-r ${gradient} text-white`}>
                      {achievement.category}
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
