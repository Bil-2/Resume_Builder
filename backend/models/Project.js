import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'data-science', 'ai-ml', 'blockchain', 'iot', 'other'],
    default: 'web'
  },
  technologies: [{
    type: String,
    trim: true
  }],
  role: {
    type: String,
    trim: true
  },
  teamSize: {
    type: Number,
    min: 1
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'in-progress'
  },
  links: {
    github: String,
    live: String,
    demo: String,
    documentation: String
  },
  images: [{
    url: String,
    caption: String
  }],
  highlights: [{
    type: String,
    maxlength: [500, 'Highlight cannot exceed 500 characters']
  }],
  challenges: [{
    challenge: String,
    solution: String
  }],
  impact: {
    users: Number,
    metrics: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
projectSchema.index({ userId: 1, createdAt: -1 }); // User projects sorted by date
projectSchema.index({ userId: 1, status: 1 }); // Filter by status
projectSchema.index({ technologies: 1 }); // Filter by technology
projectSchema.index({ tags: 1 }); // Filter by tags
projectSchema.index({ visibility: 1, featured: -1 }); // Public featured projects
projectSchema.index({ category: 1 }); // Filter by category
projectSchema.index({ startDate: -1 }); // Sort by start date

const Project = mongoose.model('Project', projectSchema);

export default Project;
