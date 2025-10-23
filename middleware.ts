import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_PREFIXES = ['/notes', '/profile'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const cookieHeader = req.headers.get('cookie') || '';
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  // Якщо користувач уже авторизований — забороняємо доступ до /sign-in /sign-up
  if (isAuthRoute && accessToken) {
    const url = new URL('/', origin);
    return NextResponse.redirect(url);
  }

  if (!isPrivate) {
    return NextResponse.next();
  }

  // Приватний маршрут
  if (accessToken) {
    return NextResponse.next();
  }

  // Немає accessToken, але є refreshToken — спроба поновити сесію
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${origin}/api/auth/session`, {
        method: 'GET',
        headers: { cookie: cookieHeader },
      });

      // Якщо бек повернув оновлені токени (Set-Cookie), прокинемо їх у відповідь
      if (res.ok) {
        const next = NextResponse.next();

        const setCookieHeader = res.headers.get('set-cookie');
        if (setCookieHeader) {
          // У відповідях може бути кілька Set-Cookie — розіб’ємо.
          const cookies = setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_\-]+=)/g);
          cookies.forEach((c) => next.headers.append('set-cookie', c));
        }
        return next;
      }
    } catch {
      // ігноруємо і впадемо на редірект нижче
    }
  }

  // Неавторизований — на логін
  const url = new URL('/sign-in', origin);
  url.searchParams.set('from', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // усе, окрім статичних файлів і _next
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|public).*)',
  ],
};
