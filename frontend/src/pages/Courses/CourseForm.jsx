import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, GraduationCap, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const CourseForm = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseName: '',
    institution: '',
    category: '',
    platform: '',
    startDate: '',
    endDate: '',
    status: 'in-progress',
    progress: 0,
    description: '',
    certificateUrl: '',
    skills: []
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setFormData(response.data.data);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/courses');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.courseName || !formData.institution) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await axios.put(`/api/courses/${id}`, formData);
        toast.success('Course updated successfully');
      } else {
        await axios.post('/api/courses', formData);
        toast.success('Course created successfully');
      }
      navigate('/courses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`/api/courses/${id}`);
      toast.success('Course deleted successfully');
      navigate('/courses');
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="scroll-animate flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-orange-500" />
                {id ? 'Edit Course' : 'Add New Course'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your learning journey
              </p>
            </div>
          </div>
          {id && (
            <button
              onClick={handleDelete}
              className="btn btn-danger btn-sm gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="scroll-animate card space-y-8">
          {/* Basic Information */}
          <div className="scroll-animate" style={{transitionDelay: '100ms'}}>
            <h2 className="section-header">
              Course Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label label-required">
                  Course Name
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Full Stack Web Development"
                  required
                />
              </div>

              <div>
                <label className="label label-required">
                  Institution / Provider
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., Udemy, Coursera"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Platform
                </label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Select platform</option>
                  <option value="Udemy">Udemy</option>
                  <option value="Coursera">Coursera</option>
                  <option value="edX">edX</option>
                  <option value="LinkedIn Learning">LinkedIn Learning</option>
                  <option value="Pluralsight">Pluralsight</option>
                  <option value="YouTube">YouTube</option>
                  <option value="University">University</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="">Select category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps">DevOps</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select"
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="scroll-animate" style={{transitionDelay: '300ms'}}>
            <h2 className="section-header">
              Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="scroll-animate" style={{transitionDelay: '400ms'}}>
            <label className="label">
              Progress: <span className="text-blue-600 dark:text-blue-400 font-bold">{formData.progress}%</span>
            </label>
            <input
              type="range"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${formData.progress}%, #e5e7eb ${formData.progress}%, #e5e7eb 100%)`
              }}
            />
          </div>

          {/* Description */}
          <div className="scroll-animate" style={{transitionDelay: '500ms'}}>
            <label className="label">
              Description / Notes
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="textarea"
              placeholder="What did you learn? Key takeaways..."
            />
          </div>

          {/* Certificate URL */}
          <div>
            <label className="label">
              Certificate URL
            </label>
            <input
              type="url"
              name="certificateUrl"
              value={formData.certificateUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : id ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
