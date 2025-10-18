import PropTypes from 'prop-types';
import useResponsive from '../../hooks/useResponsive';

/**
 * Responsive Table Component
 * Displays as table on desktop, cards on mobile
 */
const ResponsiveTable = ({ 
  columns = [], 
  data = [], 
  onRowClick = null,
  emptyMessage = 'No data available'
}) => {
  const { isMobile } = useResponsive();

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            className={`
              bg-white rounded-lg border border-gray-200 p-4 space-y-3
              ${onRowClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
            `}
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-500">
                  {column.header}:
                </span>
                <span className="text-sm text-gray-900 text-right ml-2">
                  {column.render 
                    ? column.render(row[column.accessor], row) 
                    : row[column.accessor]
                  }
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Desktop Table View
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render 
                    ? column.render(row[column.accessor], row) 
                    : row[column.accessor]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ResponsiveTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onRowClick: PropTypes.func,
  emptyMessage: PropTypes.string,
};

export default ResponsiveTable;
