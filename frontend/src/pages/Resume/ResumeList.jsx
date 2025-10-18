import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Eye, Edit, Trash2, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../services/api';
import useResumeStore from '../../store/resumeStore';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useAuthStore from '../../store/authStore';

const ResumeList = () => {
  useScrollAnimation();
  const { user } = useAuthStore();
  const { resumes, setResumes, deleteResume: removeResume } = useResumeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchResumes();
    }
  }, [user]);

  const fetchResumes = async () => {
    try {
      const response = await resumeAPI.getAll();
      setResumes(response.data.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.delete(id);
      removeResume(id);
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const response = await resumeAPI.duplicate(id);
      setResumes([response.data.data, ...resumes]);
      toast.success('Resume duplicated successfully');
    } catch (error) {
      console.error('Error duplicating resume:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between scroll-animate">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and create your professional resumes</p>
        </div>
        <Link to="/resumes/new" className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Resume</span>
        </Link>
      </div>

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="scroll-animate card text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resumes yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first resume to get started</p>
          <Link to="/resumes/new" className="btn btn-primary inline-flex items-center space-x-2">
            <Plus size={20} />
            <span>Create Your First Resume</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume, index) => (
            <div key={resume._id} className="card hover:shadow-lg transition-shadow scroll-animate" style={{transitionDelay: `${index * 100}ms`}}>
              {/* Resume Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 mb-4 h-48 flex items-center justify-center">
                <FileText className="text-gray-400" size={64} />
              </div>

              {/* Resume Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{resume.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="badge badge-primary">{resume.template}</span>
                  <span>•</span>
                  <span>Updated {new Date(resume.lastModified).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Link
                  to={`/resumes/${resume._id}/preview`}
                  className="flex-1 btn btn-outline text-sm flex items-center justify-center space-x-1"
                >
                  <Eye size={16} />
                  <span>View</span>
                </Link>
                <Link
                  to={`/resumes/${resume._id}/edit`}
                  className="flex-1 btn btn-primary text-sm flex items-center justify-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={() => handleDuplicate(resume._id)}
                  className="btn btn-secondary text-sm p-2"
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  className="btn btn-danger text-sm p-2"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeList;
