import { NextRequest, NextResponse } from 'next/server';
import { PlayStoreService } from '@/lib/services/playStore.service';

export const dynamic = 'force-dynamic';

/**
 * Play Store Search API
 * Searches only the Play Store
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const country = searchParams.get('country') || 'kr';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validation
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required', message: 'Please provide a search term' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Query too long', message: 'Search query must be less than 100 characters' },
        { status: 400 }
      );
    }

    const validLimit = Math.min(Math.max(limit, 1), 50);

    // Search Play Store
    const apps = await PlayStoreService.search(query, country, validLimit);

    return NextResponse.json({
      count: apps.length,
      apps,
    });
  } catch (error) {
    console.error('Play Store API error:', error);
    return NextResponse.json(
      {
        error: 'Play Store search failed',
        message: 'Unable to search Play Store. Please try again.',
      },
      { status: 500 }
    );
  }
}
