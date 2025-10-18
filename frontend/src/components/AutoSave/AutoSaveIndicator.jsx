import { Check, AlertCircle, Loader2, Cloud } from 'lucide-react';
import PropTypes from 'prop-types';

const AutoSaveIndicator = ({ 
  status = 'idle', 
  lastSavedText = null,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Saving...',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          animate: 'animate-spin',
        };
      case 'saved':
        return {
          icon: Check,
          text: lastSavedText ? `Saved ${lastSavedText}` : 'All changes saved',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          animate: '',
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Failed to save',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          animate: '',
        };
      default:
        return {
          icon: Cloud,
          text: 'Auto-save enabled',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          animate: '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor} ${className}`}>
      <Icon className={`w-4 h-4 ${config.color} ${config.animate}`} />
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    </div>
  );
};

AutoSaveIndicator.propTypes = {
  status: PropTypes.oneOf(['idle', 'saving', 'saved', 'error']),
  lastSavedText: PropTypes.string,
  className: PropTypes.string,
};

export default AutoSaveIndicator;
