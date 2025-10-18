import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { projectAPI } from '../../services/api';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import useAuthStore from '../../store/authStore';

const Projects = () => {
  useScrollAnimation();
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if authenticated to prevent 401 loop
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between slide-down delay-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💼 Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your project portfolio 🚀</p>
        </div>
        <Link to="/projects/new" className="btn btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="scroll-animate card text-center py-12">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet 🛠️</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first project to showcase your work ✨</p>
          <Link to="/projects/new" className="btn btn-primary inline-flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Your First Project</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={project._id} className="card hover:shadow-lg transition-shadow scroll-animate" style={{transitionDelay: `${index * 100}ms`}}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                  <span key={idx} className="badge badge-primary text-xs">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
