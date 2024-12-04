import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
            },
        },
    });

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    
    const authPaths = ['/register', '/login', '/forgot-password', '/reset-password'];
    const protectedPaths = [/^\/hosting(\/.*)?$/,]; //regex for /hosting/**/*
    const protectedAdminPaths = [/^\/administrator(\/.*)?$/,]; //regex for /admin/**/*

    const {data: { user }} = await supabase.auth.getUser();

    const url = new URL(request.url);
    const redirectedFrom = url.searchParams.get("redirectedFrom");

    if (user) {
        const { data: role, error } = await supabase
            .from("account")
            .select("role")
            .eq("id", user.id)
            .single();

        
        // Redirect proprietors away from `/administrator`
        if (role.role === "Proprietor") {
            if (protectedAdminPaths.some((regex) => regex.test(url.pathname))) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        // Redirect clients away from `/hosting` and `/administrator`
        if (role.role === "Client") {
            if (
                protectedPaths.some((regex) => regex.test(url.pathname)) ||
                protectedAdminPaths.some((regex) => regex.test(url.pathname))
            ) {
                return NextResponse.redirect(new URL("/", request.url));
            }
        }

        // Redirect admins away from all other paths except `/administrator`
        if (role.role === "Admin") {
            if (!protectedAdminPaths.some((regex) => regex.test(url.pathname))) {
                return NextResponse.redirect(new URL("/administrator/dashboard", request.url));
            }
        }

        if (authPaths.includes(url.pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return supabaseResponse;
    } else {
        const isProtected =
            protectedPaths.some((regex) => regex.test(url.pathname)) ||
            protectedAdminPaths.some((regex) => regex.test(url.pathname));
        if (isProtected) {
            return NextResponse.redirect(new URL(`/login?redirectedFrom=${redirectedFrom || url.pathname}`, request.url));
        }
        return supabaseResponse;
    }
    

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!
}
