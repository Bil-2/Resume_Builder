import { Link } from 'react-router-dom';
import { FileText, Zap, Award, TrendingUp, ArrowRight, CheckCircle, Sparkles, Code, Briefcase, GraduationCap, Target, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Logo from '../components/Logo/Logo';

const Landing = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from multiple modern resume templates designed by professionals',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Code,
      title: 'Real-Time Editor',
      description: 'See your changes instantly with our live preview editor',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Generate compelling summaries automatically with AI assistance',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Tracking',
      description: 'Track your professional growth and achievements over time',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  const benefits = [
    {
      icon: CheckCircle,
      text: 'Multiple professional resume templates',
    },
    {
      icon: CheckCircle,
      text: 'Real-time preview and editing',
    },
    {
      icon: CheckCircle,
      text: 'Export to PDF and DOCX formats',
    },
    {
      icon: CheckCircle,
      text: 'Track projects and achievements',
    },
    {
      icon: CheckCircle,
      text: 'Manage courses and certifications',
    },
    {
      icon: CheckCircle,
      text: 'Organize skills by category',
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users Daily' },
    { icon: FileText, value: '50,000+', label: 'Resumes Created Daily' },
    { icon: Target, value: '99.7%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="transition-transform duration-300 hover:scale-105">
              <Logo size="md" showText={true} />
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">AI-Powered Resume Builder</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Build Your Dream
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Career</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Create stunning professional resumes in minutes. Track your projects, skills, and achievements all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/register" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
                <span>Start Building Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                Sign In
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const animations = ['slide-in-left', 'slide-in-bottom', 'slide-in-right'];
                return (
                  <div 
                    key={index} 
                    className={`stat-card ${animations[index]} bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg cursor-pointer group`}
                    style={{animationDelay: `${index * 150}ms`}}
                  >
                    <div className="flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-xl transition-shadow">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="stat-number text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap" style={{animationDelay: `${index * 150 + 200}ms`}}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 fade-in-scale" style={{animationDelay: '100ms'}}>
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto slide-in-bottom" style={{animationDelay: '300ms'}}>
              Powerful features designed to help you create the perfect resume and track your career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const animations = ['slide-in-left', 'slide-in-bottom', 'slide-in-right', 'slide-in-bottom'];
              return (
                <div
                  key={index}
                  className={`group p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl transition-all duration-500 cursor-pointer ${animations[index]} transform hover:-translate-y-3 hover:scale-105`}
                  style={{animationDelay: `${index * 150 + 500}ms`}}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6 slide-in-left delay-100">
                <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Why Choose Us</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 slide-in-left delay-200">
                Your Complete Career Platform
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 slide-in-left delay-300">
                We've built a comprehensive ecosystem that helps students and professionals create stunning resumes while tracking their career growth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 slide-up" style={{animationDelay: `${index * 100 + 400}ms`}}>
                    <benefit.icon className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2 slide-in-right delay-200">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50"></div>
                
                {/* Resume Mockup */}
                <div className="relative bg-white rounded-2xl shadow-2xl p-10 space-y-5 border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
                  {/* Header */}
                  <div className="space-y-3 pb-5 border-b-2 border-gray-100">
                    <div className="h-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-2/3 shadow-sm"></div>
                    <div className="h-4 bg-gray-400 rounded w-1/2"></div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-28 shadow-sm"></div>
                      <div className="h-6 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full w-36 shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Experience Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                      <div className="h-5 bg-gray-800 rounded-lg w-36 font-semibold"></div>
                    </div>
                    <div className="pl-4 space-y-2.5">
                      <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded shadow-sm"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-300 rounded w-11/12 shadow-sm"></div>
                      <div className="h-4 bg-gradient-to-r from-blue-400 to-blue-300 rounded w-4/5 shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Education Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"></div>
                      <div className="h-5 bg-gray-800 rounded-lg w-32"></div>
                    </div>
                    <div className="pl-4 space-y-2.5">
                      <div className="h-4 bg-gray-400 rounded shadow-sm"></div>
                      <div className="h-4 bg-gray-300 rounded w-10/12 shadow-sm"></div>
                    </div>
                  </div>
                  
                  {/* Skills Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-pink-600 to-pink-400 rounded-full"></div>
                      <div className="h-5 bg-gray-800 rounded-lg w-24"></div>
                    </div>
                    <div className="pl-4 flex flex-wrap gap-2">
                      <div className="h-7 bg-gradient-to-r from-purple-200 to-purple-100 border border-purple-300 rounded-full w-20 shadow-sm"></div>
                      <div className="h-7 bg-gradient-to-r from-purple-200 to-purple-100 border border-purple-300 rounded-full w-24 shadow-sm"></div>
                      <div className="h-7 bg-gradient-to-r from-purple-200 to-purple-100 border border-purple-300 rounded-full w-28 shadow-sm"></div>
                      <div className="h-7 bg-gradient-to-r from-purple-200 to-purple-100 border border-purple-300 rounded-full w-20 shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 scale-in delay-100">
            Ready to Build Your Future?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto slide-up delay-300">
            Join thousands of students and professionals creating amazing resumes and tracking their career growth
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in delay-500">
            <Link to="/register" className="group bg-white text-blue-600 hover:bg-gray-50 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="text-white hover:text-white/80 font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white/50 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/Bil-2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 transition-colors font-medium"
            >
              Bil-2
            </a>
            {' '}&copy; 2025 Resume Builder
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
