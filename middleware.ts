import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];

const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  const refreshToken = request.cookies.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/auth/session`,
        {
          method: 'GET',
          headers: {
            Cookie: request.headers.get('cookie') || '',
          },
        }
      );

      if (response.ok) {
        const nextResponse = NextResponse.next();

        const setCookie = response.headers.get('set-cookie');

        if (setCookie) {
          nextResponse.headers.set(
            'set-cookie',
            setCookie
          );
        }

        return nextResponse;
      }
    } catch {
      // ignore
    }
  }

  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(
      new URL('/sign-in', request.url)
    );
  }

  if (
    isAuthRoute &&
    (accessToken || refreshToken)
  ) {
    return NextResponse.redirect(
      new URL('/', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};