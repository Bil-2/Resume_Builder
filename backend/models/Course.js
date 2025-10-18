import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseName: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [200, 'Course name cannot exceed 200 characters']
  },
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true
  },
  platform: {
    type: String,
    enum: ['coursera', 'udemy', 'edx', 'linkedin-learning', 'pluralsight', 'udacity', 'university', 'other'],
    default: 'other'
  },
  instructor: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['programming', 'data-science', 'design', 'business', 'marketing', 'personal-development', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
    default: 'in-progress'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  certificateUrl: {
    type: String
  },
  certificateId: {
    type: String
  },
  grade: {
    type: String
  },
  duration: {
    hours: Number,
    weeks: Number
  },
  courseUrl: {
    type: String
  },
  learningOutcomes: [{
    type: String,
    maxlength: [300, 'Learning outcome cannot exceed 300 characters']
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
courseSchema.index({ userId: 1, createdAt: -1 }); // User courses sorted by date
courseSchema.index({ userId: 1, status: 1 }); // Filter by status
courseSchema.index({ userId: 1, completionDate: -1 }); // User courses by completion
courseSchema.index({ category: 1 }); // Filter by category
courseSchema.index({ platform: 1 }); // Filter by platform
courseSchema.index({ completionDate: -1 }); // Sort by completion
courseSchema.index({ progress: -1 }); // Sort by progress
courseSchema.index({ skills: 1 }); // Filter by skills

const Course = mongoose.model('Course', courseSchema);

export default Course;
