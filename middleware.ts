import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const PUBLIC_AUTH = ['/sign-in', '/sign-up'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isPrivate = PRIVATE_PREFIXES.some((p) => url.pathname.startsWith(p));
  const isAuthPage = PUBLIC_AUTH.includes(url.pathname);

  // Куки від API routes будуть ставити session, перевіримо наявність
  const hasSession = req.cookies.has('session'); // ім’я куки див. у вашій app/api реалізації

  if (isPrivate && !hasSession) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isAuthPage && hasSession) {
    url.pathname = '/profile';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
