import { useState } from 'react';
import { Check, Eye } from 'lucide-react';
import PropTypes from 'prop-types';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with bold headers',
    preview: '/templates/modern-preview.png',
    color: 'blue',
    features: ['ATS-friendly', 'Clean layout', 'Professional'],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional format',
    preview: '/templates/classic-preview.png',
    color: 'gray',
    features: ['Traditional', 'Conservative', 'Timeless'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Eye-catching design for creative professionals',
    preview: '/templates/creative-preview.png',
    color: 'purple',
    features: ['Unique', 'Colorful', 'Stand out'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    preview: '/templates/minimal-preview.png',
    color: 'green',
    features: ['Simple', 'Elegant', 'Content-focused'],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate-ready with structured sections',
    preview: '/templates/professional-preview.png',
    color: 'indigo',
    features: ['Corporate', 'Structured', 'Formal'],
  },
];

const TemplateGallery = ({ 
  selectedTemplate = 'modern',
  onSelectTemplate,
  showPreview = true,
}) => {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const handleSelectTemplate = (templateId) => {
    if (onSelectTemplate) {
      onSelectTemplate(templateId);
    }
  };

  const handlePreview = (templateId) => {
    setPreviewTemplate(templateId);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Template
        </h2>
        <p className="text-gray-600">
          Select a template that best represents your professional style
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`
                relative group cursor-pointer
                bg-white rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? `border-${template.color}-500 shadow-lg` 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }
              `}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className={`absolute -top-2 -right-2 bg-${template.color}-500 text-white rounded-full p-1.5 shadow-lg z-10`}>
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                {/* Placeholder for template preview image */}
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-${template.color}-50 to-${template.color}-100`}>
                  <div className="text-center p-6">
                    <div className={`text-6xl font-bold text-${template.color}-500 mb-2`}>
                      {template.name[0]}
                    </div>
                    <div className="text-sm text-gray-600">
                      {template.name} Template
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                {showPreview && (isHovered || isSelected) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(template.id);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {template.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 text-xs font-medium rounded-full bg-${template.color}-50 text-${template.color}-700`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {templates.find(t => t.id === previewTemplate)?.name} Template Preview
                </h3>
                <button
                  onClick={closePreview}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Preview Content */}
              <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Template preview will be rendered here</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    closePreview();
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Use This Template
                </button>
                <button
                  onClick={closePreview}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TemplateGallery.propTypes = {
  selectedTemplate: PropTypes.string,
  onSelectTemplate: PropTypes.func,
  showPreview: PropTypes.bool,
};

export default TemplateGallery;
