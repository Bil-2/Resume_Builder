import { useState, useEffect } from 'react';
import { Plus, Code, Database, Palette, Wrench, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Loading/LoadingSpinner';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('/api/skills');
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
      'technical': Code,
      'soft-skills': TrendingUp,
    };
    return icons[category?.toLowerCase()] || Code;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'frontend': 'from-blue-500 to-cyan-500',
      'backend': 'from-green-500 to-emerald-500',
      'design': 'from-pink-500 to-purple-500',
      'tools': 'from-orange-500 to-red-500',
      'technical': 'from-indigo-500 to-blue-500',
      'soft-skills': 'from-teal-500 to-green-500',
    };
    return colors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'beginner': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'intermediate': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'advanced': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'expert': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
    return colors[level] || colors['beginner'];
  };

  const getProficiencyWidth = (level) => {
    const widths = {
      'beginner': '25%',
      'intermediate': '50%',
      'advanced': '75%',
      'expert': '100%',
    };
    return widths[level] || '25%';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading skills..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-float">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Skills Arsenal
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Showcase your expertise and technical abilities
            </p>
            <Link
              to="/skills/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Skill
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-16 mb-8">
          {[
            { label: 'Total Skills', value: stats.total, icon: Code, gradient: 'from-blue-500 to-cyan-500' },
            { label: 'Expert Level', value: stats.expert, icon: TrendingUp, gradient: 'from-green-500 to-emerald-500' },
            { label: 'Advanced', value: stats.advanced, icon: Database, gradient: 'from-purple-500 to-pink-500' },
            { label: 'Categories', value: stats.categories, icon: Palette, gradient: 'from-orange-500 to-red-500' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="glass p-6 rounded-xl animate-slide-up"
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

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 input-modern"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'All' },
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend', label: 'Backend' },
              { value: 'design', label: 'Design' },
              { value: 'tools', label: 'Tools' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${filter === option.value
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-dark-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
        {filteredSkills.length === 0 ? (
          <div className="card-modern text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term'
                : 'Start building your skills portfolio by adding your first skill'
              }
            </p>
            <Link
              to="/skills/new"
              className="btn-modern inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Your First Skill
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => {
              const IconComponent = getCategoryIcon(category);
              const gradient = getCategoryColor(category);

              return (
                <div
                  key={category}
                  className="animate-fade-in"
                  style={{ animationDelay: `${catIndex * 100}ms` }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category}
                    </h2>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-dark-700"></div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill, index) => (
                      <Link
                        key={skill._id}
                        to={`/skills/${skill._id}/edit`}
                        className="card-modern card-hover group animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {skill.name}
                          </h3>
                          <span className={`badge ${getProficiencyColor(skill.proficiency)}`}>
                            {skill.proficiency}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                              style={{ width: getProficiencyWidth(skill.proficiency) }}
                            />
                          </div>
                        </div>

                        {/* Experience */}
                        {skill.yearsOfExperience && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} experience
                          </div>
                        )}
                      </Link>
                    ))}
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
