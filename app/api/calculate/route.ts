import { NextRequest, NextResponse } from 'next/server';
import { calculateComparison } from '@/lib/calculations';
import { getDataRange } from '@/lib/dataLoader';
import { CountryCode } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const amount = parseFloat(searchParams.get('amount') || '1');
  const startYear = parseInt(searchParams.get('startYear') || '1970');
  const endYear = parseInt(searchParams.get('endYear') || new Date().getFullYear().toString());
  const country = (searchParams.get('country') || 'US') as CountryCode;

  // Validate country
  if (country !== 'US' && country !== 'CH') {
    return NextResponse.json(
      { error: 'Invalid country. Must be US or CH.' },
      { status: 400 }
    );
  }

  // Validate inputs
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json(
      { error: 'Invalid amount. Must be a positive number.' },
      { status: 400 }
    );
  }

  if (isNaN(startYear) || isNaN(endYear)) {
    return NextResponse.json(
      { error: 'Invalid year. Must be a valid number.' },
      { status: 400 }
    );
  }

  if (startYear >= endYear) {
    return NextResponse.json(
      { error: 'Start year must be before end year.' },
      { status: 400 }
    );
  }

  const dataRange = getDataRange(country);

  if (startYear < dataRange.minYear || endYear > dataRange.maxYear) {
    return NextResponse.json(
      {
        error: `Years must be between ${dataRange.minYear} and ${dataRange.maxYear}.`,
        dataRange,
      },
      { status: 400 }
    );
  }

  // Calculate results
  const result = calculateComparison(amount, startYear, endYear, country);

  if (!result) {
    return NextResponse.json(
      { error: 'Unable to calculate. Missing data for specified years.' },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, startYear, endYear, country = 'US' } = body;

    // Validate country
    if (country !== 'US' && country !== 'CH') {
      return NextResponse.json(
        { error: 'Invalid country. Must be US or CH.' },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (!startYear || !endYear) {
      return NextResponse.json(
        { error: 'Start year and end year are required.' },
        { status: 400 }
      );
    }

    if (startYear >= endYear) {
      return NextResponse.json(
        { error: 'Start year must be before end year.' },
        { status: 400 }
      );
    }

    const dataRange = getDataRange(country);

    if (startYear < dataRange.minYear || endYear > dataRange.maxYear) {
      return NextResponse.json(
        {
          error: `Years must be between ${dataRange.minYear} and ${dataRange.maxYear}.`,
          dataRange,
        },
        { status: 400 }
      );
    }

    // Calculate results
    const result = calculateComparison(amount, startYear, endYear, country);

    if (!result) {
      return NextResponse.json(
        { error: 'Unable to calculate. Missing data for specified years.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }
}
