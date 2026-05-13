import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const pathname = request.nextUrl.pathname;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    const response = await checkSession();

    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      cookiesArray.forEach((cookie) => {
        const [cookiePart] = cookie.split(';');
        const [name, value] = cookiePart.split('=');

        cookieStore.set(name, value);
      });

      accessToken = cookieStore.get('accessToken')?.value;
    }
  }

  if (isPrivateRoute && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};