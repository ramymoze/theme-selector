import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user is accessing the dashboard
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    // Check for the admin authentication cookie
    const adminAuth = request.cookies.get('admin_auth');

    // If the cookie is missing or invalid, redirect to the login page
    if (!adminAuth || adminAuth.value !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/dashboard/:path*',
};
