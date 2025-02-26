import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/webhook", "/(api|trpc)(.*)", "/conversation", "/dashboard", "/image", "/prediction", "/code", "/grammar", "/grammargemini"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};