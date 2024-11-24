import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {    

    await updateSession(request);

    const url = request.nextUrl;
    
    // Check if the path is /details and not already /photos
    // if (url.pathname.includes('/details') && !url.pathname.includes('/photos')) {
    //     const propertyId = url.pathname.split('/')[3];
    //     return NextResponse.redirect(new URL(`/hosting/properties/${propertyId}/details/photos`, url.origin));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
