import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseLimit extends Document {
  number: string;
  type: '2digit' | '3digit';
  limit: number;
  updatedAt: Date;
}

const PurchaseLimitSchema = new Schema<IPurchaseLimit>({
  number: { type: String, required: true },
  type: { type: String, enum: ['2digit', '3digit'], required: true },
  limit: { type: Number, required: true, min: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Create compound index for unique number+type combination
PurchaseLimitSchema.index({ number: 1, type: 1 }, { unique: true });

export default mongoose.models.PurchaseLimit || mongoose.model<IPurchaseLimit>('PurchaseLimit', PurchaseLimitSchema);

