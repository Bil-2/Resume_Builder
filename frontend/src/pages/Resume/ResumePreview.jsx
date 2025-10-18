import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Edit, ArrowLeft, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { resumeAPI } from '../../services/api';
import useScrollAnimation from '../../hooks/useScrollAnimation';

const ResumePreview = () => {
  useScrollAnimation();
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await resumeAPI.getById(id);
      setResume(response.data.data);
    } catch (error) {
      console.error('Error fetching resume:', error);
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.title}.pdf`);
      
      toast.success('Resume exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export resume');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Resume not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="scroll-animate fade-in-up delay-50">
        <div className="flex items-center justify-between no-print mb-6">
          <button
            onClick={() => navigate('/resumes')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Resumes</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/resumes/${id}/edit`)}
              className="btn btn-outline flex items-center space-x-2 hover:scale-105 transition-transform"
            >
              <Edit size={20} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn btn-primary flex items-center space-x-2 hover:scale-105 transition-transform disabled:hover:scale-100"
            >
              <Download size={20} />
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="scroll-animate fade-in-up delay-100 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto hover:shadow-2xl transition-shadow duration-300" ref={resumeRef}>
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-primary-600">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {resume.personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo?.phone && <span>•</span>}
            {resume.personalInfo?.phone && <span>{resume.personalInfo.phone}</span>}
            {resume.personalInfo?.location && <span>•</span>}
            {resume.personalInfo?.location && <span>{resume.personalInfo.location}</span>}
          </div>
          {(resume.personalInfo?.linkedin || resume.personalInfo?.github) && (
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-primary-600">
              {resume.personalInfo?.linkedin && <span>{resume.personalInfo.linkedin}</span>}
              {resume.personalInfo?.github && <span>{resume.personalInfo.github}</span>}
            </div>
          )}
        </div>

        {/* Summary */}
        {resume.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
              Work Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(exp.startDate).getFullYear()} - 
                      {exp.current ? ' Present' : ` ${new Date(exp.endDate).getFullYear()}`}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(edu.startDate).getFullYear()} - 
                      {edu.current ? ' Present' : ` ${new Date(edu.endDate).getFullYear()}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-300">
              Skills
            </h2>
            <div className="space-y-3">
              {resume.skills.map((skillCategory, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-1">{skillCategory.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, idx) => (
                      <span key={idx} className="badge badge-primary">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
