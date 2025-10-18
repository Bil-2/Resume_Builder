import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Briefcase, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ProjectForm = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    technologies: [],
    url: '',
    github: '',
    highlights: [],
    status: 'in-progress'
  });
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/projects/${id}`, formData);
        toast.success('Project updated successfully');
      } else {
        await axios.post('/api/projects', formData);
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(`/api/projects/${id}`);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-animate flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-purple-500" />
                {id ? 'Edit Project' : 'Add New Project'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Showcase your work
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
              Project Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="e.g., E-commerce Platform"
                  required
                />
              </div>

              <div className="scroll-animate" style={{transitionDelay: '200ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-modern"
                  placeholder="Describe what the project does, its purpose, and your contributions..."
                  required
                />
              </div>

              <div className="scroll-animate grid grid-cols-1 md:grid-cols-2 gap-6" style={{transitionDelay: '300ms'}}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-modern"
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-modern"
                    placeholder="e.g., Tech Corp or Personal"
                  />
                </div>
              </div>

              <div className="scroll-animate" style={{transitionDelay: '400ms'}}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-modern"
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="maintained">Maintained</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="scroll-animate" style={{transitionDelay: '500ms'}}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                    onChange={handleChange}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                    onChange={handleChange}
                    disabled={formData.current}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="current" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  This is an ongoing project
                </label>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Technologies Used
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="input-modern flex-1"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Key Highlights
            </h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                  className="input-modern flex-1"
                  placeholder="Add a key achievement or feature"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {formData.highlights.length > 0 && (
                <ul className="space-y-2">
                  {formData.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-dark-800 rounded-lg"
                    >
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                        • {highlight}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className="input-modern"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={() => navigate('/projects')}
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
              {loading ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
