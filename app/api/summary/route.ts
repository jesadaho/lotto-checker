import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/lib/models/Purchase';
import PurchaseLimit from '@/lib/models/PurchaseLimit';

export async function GET() {
  try {
    await connectDB();

    // Get all purchases grouped by number and type
    const purchases = await Purchase.find({});
    
    // Calculate totals
    const summary: Record<string, { total: number; limit?: number; exceeds: boolean }> = {};

    purchases.forEach((purchase) => {
      const key = `${purchase.type}-${purchase.number}`;
      if (!summary[key]) {
        summary[key] = { total: 0, exceeds: false };
      }
      summary[key].total += purchase.price;
    });

    // Get all limits
    const limits = await PurchaseLimit.find({});
    
    limits.forEach((limit) => {
      const key = `${limit.type}-${limit.number}`;
      if (summary[key]) {
        summary[key].limit = limit.limit;
        summary[key].exceeds = summary[key].total > limit.limit;
      }
    });

    // Format response with individual purchases
    const formattedSummary = Object.entries(summary).map(([key, data]) => {
      const [type, number] = key.split('-');
      const numberPurchases = purchases.filter(
        p => p.type === type && p.number === number
      );
      return {
        number,
        type,
        total: data.total,
        limit: data.limit,
        exceeds: data.exceeds,
        purchases: numberPurchases.map(p => ({
          _id: p._id.toString(),
          price: p.price,
          createdAt: p.createdAt
        }))
      };
    });

    // Sort by type, then by number
    formattedSummary.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return a.number.localeCompare(b.number);
    });

    return NextResponse.json({ summary: formattedSummary });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}

