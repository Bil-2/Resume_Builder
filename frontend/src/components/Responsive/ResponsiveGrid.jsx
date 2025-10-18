import PropTypes from 'prop-types';

/**
 * Responsive Grid Component
 * Automatically adjusts columns based on screen size
 */
const ResponsiveGrid = ({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 4,
  className = ''
}) => {
  const gapClass = `gap-${gap}`;
  
  const gridClasses = `
    grid
    grid-cols-${cols.mobile}
    md:grid-cols-${cols.tablet}
    lg:grid-cols-${cols.desktop}
    xl:grid-cols-${cols.large}
    ${gapClass}
    ${className}
  `;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
    large: PropTypes.number,
  }),
  gap: PropTypes.number,
  className: PropTypes.string,
};

export default ResponsiveGrid;
