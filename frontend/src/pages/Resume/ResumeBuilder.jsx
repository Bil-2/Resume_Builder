import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Sparkles, Eye, Trash2, Plus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ResumeBuilder = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    template: 'modern',
    personalInfo: {
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`,
      email: user?.email || '',
      phone: user?.phone || '',
      location: '',
      linkedin: '',
      github: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getById(id);
      setFormData(response.data.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenerateSummary = async () => {
    if (!id) {
      toast.error('Please save the resume first');
      return;
    }

    try {
      const response = await resumeAPI.generateSummary(id);
      setFormData({ ...formData, summary: response.data.data.summary });
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || formData.title.trim() === '') {
      toast.error('Please enter a resume title');
      return;
    }
    
    setLoading(true);

    try {
      if (id) {
        await resumeAPI.update(id, formData);
        toast.success('Resume updated successfully');
      } else {
        const response = await resumeAPI.create(formData);
        toast.success('Resume created successfully');
        navigate(`/resumes/${response.data.data._id}/edit`);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map(err => err.message)
          .join(', ');
        toast.error(errorMessages);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save resume. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
          achievements: [],
        },
      ],
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          current: false,
          gpa: '',
        },
      ],
    });
  };

  const removeExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index),
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index][field] = value;
    setFormData({ ...formData, experience: updatedExperience });
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({ ...formData, education: updatedEducation });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Back Button */}
      <div className="scroll-animate fade-in-up delay-50">
        <button
          onClick={() => navigate('/resumes')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Resumes</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between scroll-animate fade-in-up delay-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id ? 'Edit Resume' : 'Create New Resume'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Build your professional resume</p>
        </div>
        <div className="flex items-center space-x-3">
          {id && (
            <button
              onClick={() => navigate(`/resumes/${id}/preview`)}
              className="btn btn-outline flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Eye size={20} />
              <span>Preview</span>
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn btn-primary flex items-center space-x-2 hover:scale-105 transition-transform disabled:hover:scale-100"
          >
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Resume'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card scroll-animate fade-in-up delay-150 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Software Engineer Resume"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <select
                name="template"
                value={formData.template}
                onChange={handleChange}
                className="input"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="creative">Creative</option>
                <option value="minimal">Minimal</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="card scroll-animate fade-in-up delay-200 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="personalInfo.fullName"
                value={formData.personalInfo.fullName}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="personalInfo.email"
                value={formData.personalInfo.email}
                onChange={handleChange}
                className="input"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="personalInfo.phone"
                value={formData.personalInfo.phone}
                onChange={handleChange}
                className="input"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="personalInfo.location"
                value={formData.personalInfo.location}
                onChange={handleChange}
                className="input"
                placeholder="New York, USA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="personalInfo.linkedin"
                value={formData.personalInfo.linkedin}
                onChange={handleChange}
                className="input"
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                name="personalInfo.github"
                value={formData.personalInfo.github}
                onChange={handleChange}
                className="input"
                placeholder="github.com/johndoe"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="card scroll-animate fade-in-up delay-250 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Professional Summary</h2>
            {id && (
              <button
                type="button"
                onClick={handleGenerateSummary}
                className="btn btn-outline text-sm flex items-center space-x-2"
              >
                <Sparkles size={16} />
                <span>AI Generate</span>
              </button>
            )}
          </div>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={4}
            className="input"
            placeholder="Write a brief professional summary..."
          />
        </div>

        {/* Experience Section */}
        <div className="card scroll-animate fade-in-up delay-300 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="btn btn-outline text-sm"
            >
              Add Experience
            </button>
          </div>
          {formData.experience.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No experience added yet. Click "Add Experience" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        className="input"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Position *
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        className="input"
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        className="input"
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                          className="input"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">I currently work here</span>
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        rows={3}
                        className="input"
                        placeholder="Describe your role and responsibilities..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="card scroll-animate fade-in-up delay-350 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Education</h2>
            <button
              type="button"
              onClick={addEducation}
              className="btn btn-outline text-sm"
            >
              Add Education
            </button>
          </div>
          {formData.education.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              No education added yet. Click "Add Education" to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {formData.education.map((edu, index) => (
                <div key={index} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Education {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Institution *
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="input"
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Degree *
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="input"
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        className="input"
                        placeholder="Computer Science, Business, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                          className="input"
                          disabled={edu.current}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        GPA (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                        className="input"
                        placeholder="3.8 / 4.0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => handleEducationChange(index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Currently studying here</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResumeBuilder;
