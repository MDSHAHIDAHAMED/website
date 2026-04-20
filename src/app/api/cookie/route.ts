import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/cookie
 * Checks whether the session_jwt cookie exists
 *
 * @returns JSON response with cookie existence status
 */
export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_jwt');

    return NextResponse.json({
      exists: !!sessionCookie,
      hasValue: !!sessionCookie?.value,
    });
  } catch {
    return NextResponse.json(
      { exists: false, hasValue: false, error: 'Failed to check cookie' },
      { status: 500 }
    );
  }
}

