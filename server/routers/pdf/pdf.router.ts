import { publicProcedure, router } from "../../trpc";
import { getScoreResultsHandler, sendMailResultsHandler } from "./pdf.handler";
import { getScoreResultsSchema } from "./pdf.schema";

export const pdfRouter = router({
  getScoreResults: publicProcedure
    .input(getScoreResultsSchema)
    .query(getScoreResultsHandler),
  sendMailResults: publicProcedure.mutation(sendMailResultsHandler),
});
