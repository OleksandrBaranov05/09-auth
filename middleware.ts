import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

function isPrivate(url: string) {
  return PRIVATE_PREFIXES.some((p) => url.startsWith(p));
}
function isAuth(url: string) {
  return AUTH_PREFIXES.some((p) => url.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get('accessToken')?.value;

  // неавторизований → прийшов на приватну
  if (!access && isPrivate(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // авторизований → намагається відкрити /sign-in або /sign-up
  if (access && isAuth(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // усі, крім статичних
    '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
  ],
};
