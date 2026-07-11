import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    country: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    travellers: {
      type: Number,
      required: [true, 'Number of travellers is required'],
      min: [1, 'Must have at least 1 traveller'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    tripType: {
      type: String,
      required: [true, 'Trip type is required'],
    },
    interests: {
      type: [String],
      default: [],
    },
    foodPreference: {
      type: String,
      default: '',
    },
    accommodation: {
      type: String,
      default: '',
    },
    transportPreference: {
      type: String,
      default: '',
    },
    specialRequirements: {
      type: String,
      default: '',
    },
    generatedPlan: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'saved'],
      default: 'saved',
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
