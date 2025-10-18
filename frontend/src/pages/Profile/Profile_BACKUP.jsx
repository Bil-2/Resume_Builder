import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Github, Linkedin, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';
import useAuthStore from '../../store/authStore';

const Profile = () => {
  const { user: authUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data.data);
      setFormData({
        firstName: res.data.data.firstName || '',
        lastName: res.data.data.lastName || '',
        email: res.data.data.email || '',
        phone: res.data.data.phone || '',
        bio: res.data.data.bio || '',
        location: res.data.data.location || '',
        website: res.data.data.socialLinks?.website || '',
        github: res.data.data.socialLinks?.github || '',
        linkedin: res.data.data.socialLinks?.linkedin || '',
      });
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile({
        ...formData,
        socialLinks: {
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
        },
      });
      setUser(res.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 h-64">
        <div className="absolute inset-0 dot-pattern opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-dark-900 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-12">
        {/* Profile Card */}
        <div className="card-modern relative animate-fade-in">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold animate-float shadow-2xl">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-dark-800 rounded-full animate-pulse"></div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              {user?.bio && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {user?.email && (
                  <div className="badge badge-primary flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </div>
                )}
                {user?.location && (
                  <div className="badge badge-success flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {user.location}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${isEditing
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
                }
                flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105
              `}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6 animate-slide-down">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-modern"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-modern min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-modern"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="input-modern"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="input-modern"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="input-modern"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-modern flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6 animate-fade-in">
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {user?.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Phone</div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.phone}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Member Since</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(user?.socialLinks?.website || user?.socialLinks?.github || user?.socialLinks?.linkedin) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {user?.socialLinks?.website && (
                      <a
                        href={user.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                    {user?.socialLinks?.github && (
                      <a
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {user?.socialLinks?.linkedin && (
                      <a
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
