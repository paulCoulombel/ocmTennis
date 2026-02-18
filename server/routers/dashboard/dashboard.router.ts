import { publicProcedure, router } from "../../trpc";
import {
  getInformationHandler,
  getTableTeamsHandler,
  getNextMatchesHandler,
} from "./dashboard.handler";

export const dashboardRouter = router({
  getInformation: publicProcedure.query(getInformationHandler),
  getTableTeams: publicProcedure.query(getTableTeamsHandler),
  getNextMatches: publicProcedure.query(getNextMatchesHandler),
});
