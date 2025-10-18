import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Award, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const AchievementForm = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    issuer: '',
    date: '',
    category: '',
    certificateUrl: '',
    skills: [],
    featured: false
  });

  useEffect(() => {
    if (id) {
      fetchAchievement();
    }
  }, [id]);

  const fetchAchievement = async () => {
    try {
      const response = await axios.get(`/api/achievements/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Failed to load achievement');
      navigate('/achievements');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.issuer) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/achievements/${id}`, formData);
        toast.success('Achievement updated successfully');
      } else {
        await axios.post('/api/achievements', formData);
        toast.success('Achievement created successfully');
      }
      navigate('/achievements');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    
    try {
      await axios.delete(`/api/achievements/${id}`);
      toast.success('Achievement deleted successfully');
      navigate('/achievements');
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-animate flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/achievements')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-500" />
                {id ? 'Edit Achievement' : 'Add New Achievement'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Celebrate your milestones
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
          <div className="scroll-animate" style={{transitionDelay: '100ms'}}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Achievement Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Achievement Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="e.g., AWS Certified Solutions Architect"
                  required
                />
              </div>

              <div className="scroll-animate" style={{transitionDelay: '200ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-modern"
                  placeholder="Describe your achievement and its significance..."
                />
              </div>

              <div className="scroll-animate grid grid-cols-1 md:grid-cols-2 gap-6" style={{transitionDelay: '300ms'}}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Issuer / Organization *
                  </label>
                  <input
                    type="text"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleChange}
                    className="input-modern"
                    placeholder="e.g., Amazon Web Services"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Achieved
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date ? formData.date.split('T')[0] : ''}
                    onChange={handleChange}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="scroll-animate" style={{transitionDelay: '400ms'}}>
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
                  <option value="certification">Certification</option>
                  <option value="award">Award</option>
                  <option value="competition">Competition</option>
                  <option value="recognition">Recognition</option>
                  <option value="publication">Publication</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="scroll-animate" style={{transitionDelay: '500ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate URL
                </label>
                <input
                  type="url"
                  name="certificateUrl"
                  value={formData.certificateUrl}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ⭐ Feature this achievement (show it prominently)
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="scroll-animate flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-700" style={{transitionDelay: '600ms'}}>
            <button
              type="button"
              onClick={() => navigate('/achievements')}
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
              {loading ? 'Saving...' : id ? 'Update Achievement' : 'Create Achievement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementForm;
