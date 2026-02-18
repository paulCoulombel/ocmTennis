import { get } from "http";
import { publicProcedure, router } from "../../trpc";
import {
  getInformationHandler,
  getMatchInformationHandler,
} from "./pool.handler";
import { getInformationSchema, getMatchInformationSchema } from "./pool.schema";

export const poolRouter = router({
  getInformation: publicProcedure
    .input(getInformationSchema)
    .query(getInformationHandler),
  getMatchInformation: publicProcedure
    .input(getMatchInformationSchema)
    .query(getMatchInformationHandler),
});
