import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  number: string;
  type: '2digit' | '3digit';
  price: number;
  createdAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  number: { type: String, required: true },
  type: { type: String, enum: ['2digit', '3digit'], required: true },
  price: { type: Number, required: true, min: 0, max: 10000 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);

