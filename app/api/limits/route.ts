import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PurchaseLimit from '@/lib/models/PurchaseLimit';

export async function GET() {
  try {
    await connectDB();
    const limits = await PurchaseLimit.find({}).sort({ type: 1, number: 1 });
    return NextResponse.json({ limits });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch limits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { number, type, limit } = body;

    // Validation
    if (!number || !type || limit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === '2digit' && (!/^\d{2}$/.test(number) || parseInt(number) < 0 || parseInt(number) > 99)) {
      return NextResponse.json(
        { error: 'Invalid 2-digit number. Must be between 00-99' },
        { status: 400 }
      );
    }

    if (type === '3digit' && (!/^\d{3}$/.test(number) || parseInt(number) < 0 || parseInt(number) > 999)) {
      return NextResponse.json(
        { error: 'Invalid 3-digit number. Must be between 000-999' },
        { status: 400 }
      );
    }

    if (limit < 0) {
      return NextResponse.json(
        { error: 'Limit must be >= 0' },
        { status: 400 }
      );
    }

    const normalizedNumber = number.padStart(type === '2digit' ? 2 : 3, '0');

    // Update or create limit
    const purchaseLimit = await PurchaseLimit.findOneAndUpdate(
      { number: normalizedNumber, type },
      { number: normalizedNumber, type, limit, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, limit: purchaseLimit }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save limit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const number = searchParams.get('number');
    const type = searchParams.get('type');

    if (!number || !type) {
      return NextResponse.json(
        { error: 'Missing number or type parameter' },
        { status: 400 }
      );
    }

    const normalizedNumber = number.padStart(type === '2digit' ? 2 : 3, '0');
    
    await PurchaseLimit.findOneAndDelete({ number: normalizedNumber, type });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete limit' },
      { status: 500 }
    );
  }
}

