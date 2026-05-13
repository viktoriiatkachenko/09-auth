import { NextRequest, NextResponse } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const accessToken = request.cookies.get('accessToken');

  if (isPrivateRoute && !accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};