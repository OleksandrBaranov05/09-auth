import { NextResponse, NextRequest } from 'next/server';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_PREFIXES = ['/sign-in', '/sign-up'];

const TOKEN_COOKIE = 'accessToken';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthed = req.cookies.has(TOKEN_COOKIE);

  if (isPrivate && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthPage && isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = '/profile';
    return NextResponse.redirect(url);
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
