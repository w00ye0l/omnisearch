import { NextRequest, NextResponse } from 'next/server';
import { AppStoreService } from '@/lib/services/appStore.service';
import { PlayStoreService } from '@/lib/services/playStore.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ store: string; id: string }> }
) {
  try {
    const { store, id } = await params;

    console.log('API route received:', { store, id });

    if (!store || !id) {
      return NextResponse.json(
        { error: 'Store and ID are required' },
        { status: 400 }
      );
    }

    if (store === 'appstore') {
      // Get App Store app details
      const app = await AppStoreService.getAppDetails(id, 'us');

      if (!app) {
        return NextResponse.json(
          { error: 'App not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(app);
    } else if (store === 'playstore') {
      // Get Play Store app details
      const app = await PlayStoreService.getAppDetails(id, 'us');

      if (!app) {
        return NextResponse.json(
          { error: 'App not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(app);
    } else {
      return NextResponse.json(
        { error: 'Invalid store type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('App detail fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch app details' },
      { status: 500 }
    );
  }
}
