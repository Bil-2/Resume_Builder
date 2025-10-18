import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Resume title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  template: {
    type: String,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional'],
    default: 'modern'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    website: String,
    linkedin: String,
    github: String
  },
  summary: {
    type: String,
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  experience: [{
    company: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    location: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: String,
    achievements: [String],
    order: {
      type: Number,
      default: 0
    }
  }],
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    gpa: String,
    achievements: [String],
    order: {
      type: Number,
      default: 0
    }
  }],
  skills: [{
    category: {
      type: String,
      required: true
    },
    items: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      }
    }],
    order: {
      type: Number,
      default: 0
    }
  }],
  projects: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String,
    startDate: Date,
    endDate: Date,
    highlights: [String],
    order: {
      type: Number,
      default: 0
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    order: {
      type: Number,
      default: 0
    }
  }],
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    title: String,
    description: String,
    date: Date,
    order: {
      type: Number,
      default: 0
    }
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native']
    }
  }],
  customSections: [{
    title: String,
    content: String,
    order: {
      type: Number,
      default: 0
    }
  }],
  styling: {
    primaryColor: {
      type: String,
      default: '#2563eb'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    },
    fontSize: {
      type: String,
      default: 'medium'
    },
    spacing: {
      type: String,
      default: 'normal'
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Index for faster queries
resumeSchema.index({ userId: 1, isActive: 1 });
resumeSchema.index({ userId: 1, createdAt: -1 });

// Update lastModified on save
resumeSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

// Indexes for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 }); // Get user resumes sorted by date
resumeSchema.index({ userId: 1, isPublic: 1 }); // Filter public resumes
resumeSchema.index({ title: 'text', 'personalInfo.fullName': 'text' }); // Text search
resumeSchema.index({ lastModified: -1 }); // Sort by last modified
resumeSchema.index({ template: 1 }); // Filter by template

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
