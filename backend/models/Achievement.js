import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['award', 'competition', 'publication', 'certification', 'recognition', 'hackathon', 'scholarship', 'other'],
    default: 'other'
  },
  issuer: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  rank: {
    type: String,
    trim: true
  },
  participants: {
    type: Number,
    min: 1
  },
  prizeAmount: {
    currency: String,
    amount: Number
  },
  certificateUrl: {
    type: String
  },
  proofUrl: {
    type: String
  },
  skills: [{
    type: String,
    trim: true
  }],
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  teamMembers: [{
    name: String,
    role: String
  }],
  impact: {
    type: String,
    maxlength: [500, 'Impact description cannot exceed 500 characters']
  },
  mediaLinks: [{
    type: String,
    url: String
  }],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
achievementSchema.index({ userId: 1, date: -1 }); // User achievements sorted by date
achievementSchema.index({ userId: 1, category: 1 }); // Filter by category
achievementSchema.index({ category: 1 }); // Filter by category
achievementSchema.index({ featured: -1, date: -1 }); // Featured achievements
achievementSchema.index({ verified: 1 }); // Filter verified
achievementSchema.index({ skills: 1 }); // Filter by skills

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
