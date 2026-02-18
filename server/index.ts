import { dashboardRouter } from "./routers/dashboard/dashboard.router";
import { poolRouter } from "./routers/pool/pool.router";
import { pdfRouter } from "./routers/pdf/pdf.router";
import { router } from "./trpc";

export const appRouter = router({
  dashboard: dashboardRouter,
  pool: poolRouter,
  pdf: pdfRouter,
});

export type AppRouter = typeof appRouter;
