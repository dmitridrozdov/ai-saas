import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhook(.*)',
  '/conversation',
  '/dashboard',
  '/image',
  '/prediction',
  '/code',
  '/grammar',
  '/api/grammargemini', // <--- IMPORTANT: Change the path to include /api/
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

export const config = {
  matcher: [
    // This is a complex regex. You want to explicitly exclude your route.
    '/((?!_next|api/grammargemini|[^?]*\\.(?:html?|...)).*)', // Add your route here
    // OR simplify the matcher for testing:
    // matcher: ['/((?!api/grammargemini|_next|.*\\..*).*)', '/(api|trpc)(.*)'],
    
    // A simpler way: just comment out the entire file for deployment.
  ],
};