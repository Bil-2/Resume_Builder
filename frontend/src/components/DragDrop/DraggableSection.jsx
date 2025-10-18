import { GripVertical } from 'lucide-react';
import PropTypes from 'prop-types';

const DraggableSection = ({ 
  id,
  index,
  title,
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false,
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
    e.dataTransfer.setData('sectionId', id);
    e.dataTransfer.setData('sectionIndex', index);
    
    if (onDragStart) {
      onDragStart(id, index);
    }
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (onDragOver) {
      onDragOver(index);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('sectionId');
    const sourceIndex = parseInt(e.dataTransfer.getData('sectionIndex'));
    
    if (onDrop && sourceIndex !== index) {
      onDrop(sourceIndex, index);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative group
        bg-white rounded-lg border-2 transition-all duration-200
        ${isDragging ? 'border-blue-400 opacity-50 scale-95' : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      {/* Drag Handle */}
      <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      {/* Content */}
      <div className="pl-8 pr-4 py-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {title}
          </h3>
        )}
        {children}
      </div>

      {/* Drop Indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 font-medium">Drop here</span>
        </div>
      )}
    </div>
  );
};

DraggableSection.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  isDragging: PropTypes.bool,
};

export default DraggableSection;
