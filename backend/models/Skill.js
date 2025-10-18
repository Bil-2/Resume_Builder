import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [100, 'Skill name cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: [
      'programming-languages',
      'frameworks-libraries',
      'databases',
      'tools-platforms',
      'soft-skills',
      'languages',
      'design',
      'other'
    ],
    required: true
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  endorsements: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  relatedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String
  }],
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  verified: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
skillSchema.index({ userId: 1, name: 1 }, { unique: true }); // Prevent duplicates
skillSchema.index({ userId: 1, category: 1 }); // Group by category
skillSchema.index({ userId: 1, proficiency: -1 }); // Sort by proficiency
skillSchema.index({ category: 1 }); // Filter by category
skillSchema.index({ proficiency: 1 }); // Filter by proficiency
skillSchema.index({ name: 'text' }); // Text search
skillSchema.index({ yearsOfExperience: -1 }); // Sort by experience
skillSchema.index({ verified: 1 }); // Filter verified

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
