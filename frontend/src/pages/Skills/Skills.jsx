import { useState, useEffect } from 'react';
import { Plus, Code, Database, Palette, Wrench, Search, TrendingUp, Zap, Target, Brain, Layers, Star, ChevronRight, Activity, BarChart3, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { skillAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useCountUp from '../../hooks/useCountUp';
import useAuthStore from '../../store/authStore';

const Skills = () => {
  useScrollAnimation();
  const { user } = useAuthStore();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    try {
      const res = await skillAPI.getAll();
      setSkills(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'frontend': Code,
      'backend': Database,
      'design': Palette,
      'tools': Wrench,
      'technical': Layers,
      'soft-skills': Brain,
    };
    return icons[category?.toLowerCase()] || Code;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'frontend': 'from-blue-500 via-cyan-600 to-sky-500',
      'backend': 'from-green-500 via-emerald-600 to-teal-500',
      'design': 'from-pink-500 via-rose-600 to-purple-500',
      'tools': 'from-orange-500 via-amber-600 to-yellow-500',
      'technical': 'from-indigo-500 via-blue-600 to-purple-500',
      'soft-skills': 'from-teal-500 via-cyan-600 to-blue-500',
    };
    return colors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'beginner': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
      'intermediate': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      'advanced': 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      'expert': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    };
    return colors[level] || colors['beginner'];
  };

  const getProficiencyPercentage = (level) => {
    const percentages = {
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 100,
    };
    return percentages[level] || 25;
  };

  const getProficiencyGradient = (level) => {
    const gradients = {
      'beginner': 'from-yellow-400 to-yellow-600',
      'intermediate': 'from-blue-400 to-blue-600',
      'advanced': 'from-purple-400 to-purple-600',
      'expert': 'from-green-400 to-green-600',
    };
    return gradients[level] || gradients['beginner'];
  };

  const filteredSkills = skills.filter(skill => {
    const matchesFilter = filter === 'all' || skill.category?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = skill.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group skills by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const stats = {
    total: skills.length,
    expert: skills.filter(s => s.proficiency === 'expert').length,
    advanced: skills.filter(s => s.proficiency === 'advanced').length,
    categories: new Set(skills.map(s => s.category)).size,
  };

  // Animated counters
  const totalCount = useCountUp(stats.total, 1000);
  const expertCount = useCountUp(stats.expert, 1200);
  const advancedCount = useCountUp(stats.advanced, 1400);
  const categoriesCount = useCountUp(stats.categories, 1600);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading skills..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      {/* Epic Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-purple-900/90">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Icon with Glow */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl fade-in-scale delay-100 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl animate-pulse"></div>
              <Brain className="w-12 h-12 text-white relative z-10" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 slide-down delay-200">
              <span className="inline-block">💪 My Skills Arsenal</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto slide-up delay-300">
              Showcasing expertise, tracking growth, and leveling up 🚀✨
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 fade-in delay-500">
              <Link
                to="/skills/new"
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Add New Skill
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border-2 border-white/20 hover:border-white/40">
                View Progress
              </button>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="currentColor"
              className="text-blue-50 dark:text-gray-900"
              d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16 relative z-10">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { 
              label: 'Total Skills', 
              value: totalCount, 
              icon: Layers, 
              gradient: 'from-blue-500 via-indigo-600 to-purple-500',
              bgGradient: 'from-blue-500/10 to-purple-500/10',
              iconBg: 'bg-blue-500',
              glowColor: 'shadow-blue-500/50'
            },
            { 
              label: 'Expert Level', 
              value: expertCount, 
              icon: Star, 
              gradient: 'from-green-500 via-emerald-600 to-teal-500',
              bgGradient: 'from-green-500/10 to-teal-500/10',
              iconBg: 'bg-green-500',
              glowColor: 'shadow-green-500/50'
            },
            { 
              label: 'Advanced', 
              value: advancedCount, 
              icon: Target, 
              gradient: 'from-purple-500 via-pink-600 to-rose-500',
              bgGradient: 'from-purple-500/10 to-rose-500/10',
              iconBg: 'bg-purple-500',
              glowColor: 'shadow-purple-500/50'
            },
            { 
              label: 'Categories', 
              value: categoriesCount, 
              icon: BarChart3, 
              gradient: 'from-orange-500 via-amber-600 to-yellow-500',
              bgGradient: 'from-orange-500/10 to-yellow-500/10',
              iconBg: 'bg-orange-500',
              glowColor: 'shadow-orange-500/50'
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
                placeholder="Search skills by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All', icon: Sparkles },
                { value: 'frontend', label: 'Frontend', icon: Code },
                { value: 'backend', label: 'Backend', icon: Database },
                { value: 'design', label: 'Design', icon: Palette },
                { value: 'tools', label: 'Tools', icon: Wrench },
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

        {/* Skills by Category */}
        {filteredSkills.length === 0 ? (
          <div className="scroll-animate bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {searchTerm || filter !== 'all' ? 'No skills found' : 'Build Your Skill Portfolio'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term to find what you\'re looking for'
                : 'Start documenting your technical abilities and track your progress'
              }
            </p>
            
            <Link
              to="/skills/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Your First Skill
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => {
              const CategoryIcon = getCategoryIcon(category);
              const categoryGradient = getCategoryColor(category);

              return (
                <div key={category} className="scroll-animate">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${categoryGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill, index) => {
                      const proficiencyPercentage = getProficiencyPercentage(skill.proficiency);
                      const proficiencyGradient = getProficiencyGradient(skill.proficiency);
                      const proficiencyBadge = getProficiencyColor(skill.proficiency);

                      return (
                        <Link
                          key={skill._id}
                          to={`/skills/${skill._id}/edit`}
                          className="group relative bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] overflow-hidden"
                          style={{transitionDelay: `${index * 30}ms`}}
                        >
                          {/* Gradient glow on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                          
                          <div className="relative">
                            {/* Skill Name and Badge */}
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
                                {skill.name}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${proficiencyBadge} ml-2`}>
                                {skill.proficiency}
                              </span>
                            </div>

                            {/* Description */}
                            {skill.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {skill.description}
                              </p>
                            )}

                            {/* Proficiency Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-xs mb-1.5">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Proficiency</span>
                                <span className={`font-bold bg-gradient-to-r ${proficiencyGradient} bg-clip-text text-transparent`}>
                                  {proficiencyPercentage}%
                                </span>
                              </div>
                              
                              <div className="relative h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${proficiencyGradient} rounded-full transition-all duration-500 shadow-md`}
                                  style={{ width: `${proficiencyPercentage}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                              </div>
                            </div>

                            {/* Years of Experience */}
                            {skill.yearsOfExperience && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Activity className="w-4 h-4" />
                                <span>{skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Skills;
