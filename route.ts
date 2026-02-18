/**
 * This array contains every public Routes of the application.
 * These routes do not require authentication.
 *@type {string[]}
 */
export const publicRoutes: string[] = ["/"];

/**
 * Every route that start with one of these prefixes is considered pubic.
 * These routes do not require authentication.
 *@type {string[]}
 */
export const publicRoutesPrefixes: string[] = ["/"];

/**
 * This is the prefix for the trpc routes. They should always be authorized
 * as they handle their own authorization / authentication verifications.
 */
export const TrpcPrefix = "/api/trpc";
