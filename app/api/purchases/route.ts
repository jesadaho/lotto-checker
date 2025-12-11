import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Purchase from '@/lib/models/Purchase';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { number, type, price } = body;

    // Validation
    if (!number || !type || price === undefined) {
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

    if (price < 0 || price > 10000) {
      return NextResponse.json(
        { error: 'Price must be between 0-10000' },
        { status: 400 }
      );
    }

    const purchase = new Purchase({
      number: number.padStart(type === '2digit' ? 2 : 3, '0'),
      type,
      price
    });

    await purchase.save();

    return NextResponse.json({ success: true, purchase }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create purchase' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    // Delete all purchases if 'all' parameter is present
    if (all === 'true') {
      const result = await Purchase.deleteMany({});
      return NextResponse.json({ 
        success: true, 
        deletedCount: result.deletedCount 
      });
    }

    // Delete single purchase by ID
    if (!id) {
      return NextResponse.json(
        { error: 'Missing purchase ID or all parameter' },
        { status: 400 }
      );
    }

    const purchase = await Purchase.findByIdAndDelete(id);

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete purchase' },
      { status: 500 }
    );
  }
}

