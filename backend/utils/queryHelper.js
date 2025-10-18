/**
 * Query Helper Utilities
 * Reusable functions for optimized database queries
 */

/**
 * Execute optimized paginated query
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - Query filter
 * @param {Object} req - Express request object
 * @param {Object} options - Additional options
 * @returns {Object} - Paginated results
 */
export const paginatedQuery = async (Model, filter, req, options = {}) => {
  const {
    populate = null,
    defaultSort = '-createdAt',
    defaultLimit = 20,
  } = options;

  // Get pagination params
  const { page = 1, limit = defaultLimit, skip = 0 } = req.pagination || {};
  const sort = req.sorting || defaultSort;
  const select = req.selectedFields || '';

  // Build query
  let query = Model.find(filter)
    .select(select)
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .lean(); // Use lean() for better performance

  // Add population if specified
  if (populate) {
    query = query.populate(populate);
  }

  // Execute query and count in parallel for better performance
  const [data, total] = await Promise.all([
    query.exec(),
    Model.countDocuments(filter),
  ]);

  return {
    success: true,
    count: data.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data,
  };
};

/**
 * Execute optimized single document query
 * @param {Model} Model - Mongoose model
 * @param {String} id - Document ID
 * @param {Object} options - Additional options
 * @returns {Object} - Document or null
 */
export const findByIdOptimized = async (Model, id, options = {}) => {
  const { populate = null, select = '' } = options;

  let query = Model.findById(id).select(select).lean();

  if (populate) {
    query = query.populate(populate);
  }

  return await query.exec();
};

/**
 * Batch fetch related documents
 * More efficient than multiple individual queries
 * @param {Model} Model - Mongoose model
 * @param {Array} ids - Array of document IDs
 * @param {String} select - Fields to select
 * @returns {Array} - Array of documents
 */
export const batchFetch = async (Model, ids, select = '') => {
  if (!ids || ids.length === 0) return [];

  return await Model.find({ _id: { $in: ids } })
    .select(select)
    .lean()
    .exec();
};

/**
 * Aggregate query helper
 * @param {Model} Model - Mongoose model
 * @param {Array} pipeline - Aggregation pipeline
 * @returns {Array} - Aggregation results
 */
export const aggregateQuery = async (Model, pipeline) => {
  return await Model.aggregate(pipeline).exec();
};

export default {
  paginatedQuery,
  findByIdOptimized,
  batchFetch,
  aggregateQuery,
};
