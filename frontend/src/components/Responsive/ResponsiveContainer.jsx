import PropTypes from 'prop-types';

/**
 * Responsive Container Component
 * Provides consistent padding and max-width across devices
 */
const ResponsiveContainer = ({ 
  children, 
  maxWidth = 'xl', // sm, md, lg, xl, 2xl, full
  padding = true,
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding 
    ? 'px-4 sm:px-6 lg:px-8' 
    : '';

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  padding: PropTypes.bool,
  className: PropTypes.string,
};

export default ResponsiveContainer;
