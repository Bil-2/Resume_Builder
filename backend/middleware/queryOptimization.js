/**
 * Query Optimization Middleware
 * Adds pagination, field selection, and sorting to improve response times
 */

export const paginationMiddleware = (req, res, next) => {
  // Default pagination values
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20; // Default 20 items per page
  const skip = (page - 1) * limit;

  // Maximum limit to prevent abuse
  const maxLimit = 100;
  const finalLimit = Math.min(limit, maxLimit);

  // Add pagination to request
  req.pagination = {
    page,
    limit: finalLimit,
    skip,
  };

  next();
};

export const fieldSelectionMiddleware = (req, res, next) => {
  // Allow clients to select specific fields
  // Example: ?fields=title,description,createdAt
  if (req.query.fields) {
    req.selectedFields = req.query.fields.split(',').join(' ');
  }

  next();
};

export const sortingMiddleware = (req, res, next) => {
  // Default sorting
  let sort = '-createdAt'; // Newest first

  // Allow custom sorting
  // Example: ?sort=-createdAt,title (descending createdAt, ascending title)
  if (req.query.sort) {
    sort = req.query.sort.split(',').join(' ');
  }

  req.sorting = sort;

  next();
};

/**
 * Combined query optimization middleware
 */
export const optimizeQuery = [
  paginationMiddleware,
  fieldSelectionMiddleware,
  sortingMiddleware,
];

export default optimizeQuery;
