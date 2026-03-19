import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];

export function proxy(request: NextRequest) {
  const session = request.cookies.get('auth_session')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
