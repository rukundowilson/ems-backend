import mongoose, { Schema, Document } from 'mongoose';

export interface ITreatmentService extends Document {
  name: string;
  description: string;
  date: string;
  time: string;
  createdAt: Date;
  updatedAt: Date;
}

const TreatmentServiceSchema = new Schema<ITreatmentService>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITreatmentService>('TreatmentService', TreatmentServiceSchema);
