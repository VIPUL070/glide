import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth";

const PUBLIC_ROUTES = ['/']
const PUBLIC_APIS = ['/api/auth']

export const proxy = async (req: NextRequest) => {

    const { pathname } = req.nextUrl;
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/i.test(pathname) ||
        pathname.startsWith('.')
    ) {
        return NextResponse.next();
    }

    if (PUBLIC_ROUTES.includes(pathname)) {
        return NextResponse.next();
    }

    //Changed to .some() so nested paths like /api/auth/callback do not get blocked
    if (PUBLIC_APIS.some(api => pathname.startsWith(api))) {
        return NextResponse.next();
    }

    const session = await auth();

    // if it's an API route BEFORE redirecting, otherwise your frontend fetches will break
    if (!session) {
        if (pathname.startsWith('/api')) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/', req.url))
    }

    const role = session.user?.role

    if (pathname.startsWith('/admin')) {
        if (role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    if (pathname.startsWith('/partner')) {
        if (pathname.startsWith('/partner/onboarding')) {
            return NextResponse.next();
        }
        if (role !== 'partner') {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }

    if (pathname.startsWith('/api')) {
        if (!session.user) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}