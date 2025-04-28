import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const session = req.cookies.get('weatherAppUser')?.value;
  const sessionData = session ? JSON.parse(session) : null;

  if (!isPublicRoute && !sessionData) {
    return NextResponse.redirect(new URL('/auth', req.nextUrl));
  }

  if (isPublicRoute && sessionData && req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};