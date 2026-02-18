import z from "zod";

export const getInformationSchema = z.object({
  poolId: z.number(),
});
export type getInformationInput = z.infer<typeof getInformationSchema>;

export const getMatchInformationSchema = z.object({
  poolId: z.number(),
  matchId: z.number(),
});
export type getMatchInformationInput = z.infer<
  typeof getMatchInformationSchema
>;

// cspell: disable
const playerSchema = z.object({
  classementSimple: z.string().nullable(),
  classementDouble: z.string().nullable(),
  nom: z.string(),
  prenom: z.string(),
});

export const tenupResponseSchema = z.object({
  matchs: z.array(
    z.object({
      id: z.number().nullable(),
      simple: z.boolean(),
      superTieBreak: z.boolean(),
      numero: z.number(),
      natureVictoire: z.string().nullable(),
      equipeRecevanteScores: z.array(
        z.object({ score: z.number(), scoreTieBreak: z.number().optional() })
      ),
      equipeInviteeScores: z.array(
        z.object({ score: z.number(), scoreTieBreak: z.number().optional() })
      ),
      equipeRecevanteGagnante: z.boolean().nullable(),
      equipeInviteeGagnante: z.boolean().nullable(),
      joueur1Recevant: playerSchema.nullable(),
      joueur2Recevant: playerSchema.nullable(),
      joueur1Invite: playerSchema.nullable(),
      joueur2Invite: playerSchema.nullable(),
    })
  ),
  dateReelle: z.string(),
  equipeRecevante: z.object({
    id: z.number(),
    nom: z.string(),
    score: z.number(),
    gagnant: z.boolean().nullable(),
    forfait: z.boolean().nullable(),
    disqualification: z.boolean(),
  }),
  equipeInvitee: z.object({
    id: z.number(),
    nom: z.string(),
    score: z.number(),
    gagnant: z.boolean().nullable(),
    forfait: z.boolean().nullable(),
    disqualification: z.boolean(),
  }),
});
