import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Code, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const SkillForm = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 'intermediate',
    yearsOfExperience: 0,
    description: ''
  });

  useEffect(() => {
    if (id) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      const response = await axios.get(`/api/skills/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Failed to load skill');
      navigate('/skills');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter a skill name');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/skills/${id}`, formData);
        toast.success('Skill updated successfully');
      } else {
        await axios.post('/api/skills', formData);
        toast.success('Skill added successfully');
      }
      navigate('/skills');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await axios.delete(`/api/skills/${id}`);
      toast.success('Skill deleted successfully');
      navigate('/skills');
    } catch (error) {
      toast.error('Failed to delete skill');
    }
  };

  const getProficiencyColor = (level) => {
    const colors = {
      'beginner': 'text-yellow-600 dark:text-yellow-400',
      'intermediate': 'text-blue-600 dark:text-blue-400',
      'advanced': 'text-purple-600 dark:text-purple-400',
      'expert': 'text-green-600 dark:text-green-400',
    };
    return colors[level] || colors['intermediate'];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-animate flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/skills')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Code className="w-8 h-8 text-indigo-500" />
                {id ? 'Edit Skill' : 'Add New Skill'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Build your expertise portfolio
              </p>
            </div>
          </div>
          {id && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="scroll-animate card-modern space-y-6">
          {/* Basic Information */}
          <div className="scroll-animate">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Skill Details
            </h2>
            <div className="space-y-6">
              <div className="scroll-animate" style={{transitionDelay: '100ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skill Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="e.g., React, Python, UI/UX Design"
                  required
                />
              </div>

              <div className="scroll-animate grid grid-cols-1 md:grid-cols-2 gap-6" style={{transitionDelay: '200ms'}}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-modern"
                  >
                    <option value="">Select category</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Design">Design</option>
                    <option value="Tools">Tools</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    step="0.5"
                    className="input-modern"
                  />
                </div>
              </div>

              {/* Proficiency Level */}
              <div className="scroll-animate" style={{transitionDelay: '300ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Proficiency Level
                </label>
                <select
                  name="proficiency"
                  value={formData.proficiency}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
                
                {/* Proficiency Indicator */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Level:
                    </span>
                    <span className={`text-sm font-bold ${getProficiencyColor(formData.proficiency)}`}>
                      {formData.proficiency.charAt(0).toUpperCase() + formData.proficiency.slice(1)}
                    </span>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        formData.proficiency === 'beginner' ? 'bg-yellow-500 w-1/4' :
                        formData.proficiency === 'intermediate' ? 'bg-blue-500 w-1/2' :
                        formData.proficiency === 'advanced' ? 'bg-purple-500 w-3/4' :
                        'bg-green-500 w-full'
                      }`}
                    />
                  </div>
                  
                  {/* Level Descriptions */}
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
                    {formData.proficiency === 'beginner' && '• Learning the basics, limited practical experience'}
                    {formData.proficiency === 'intermediate' && '• Comfortable with fundamentals, some practical experience'}
                    {formData.proficiency === 'advanced' && '• Strong expertise, can solve complex problems independently'}
                    {formData.proficiency === 'expert' && '• Master level, can teach others and solve any problem'}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="scroll-animate" style={{transitionDelay: '400ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description / Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-modern"
                  placeholder="Add any additional details about your experience with this skill..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="scroll-animate flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-700" style={{transitionDelay: '500ms'}}>
            <button
              type="button"
              onClick={() => navigate('/skills')}
              className="px-6 py-2 border border-gray-300 dark:border-dark-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-modern flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : id ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillForm;
