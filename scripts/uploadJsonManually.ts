import { PrismaClient } from "@prisma/client";
import z from "zod";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error", "warn"],
  });

const tenupResponseSchema = z.object({
  rencontres: z.array(
    z.object({
      id: z.number().int(),
      enCours: z.boolean(),
      terminee: z.boolean(),
      dateReelle: z.string(),
      idInstallation: z.nullable(z.number().int()),
      idEquipe1: z.number().int(),
      idEquipe2: z.number().int(),
      nomEquipe1: z.string(),
      nomEquipe2: z.string(),
      idEquipeClub: z.number().int(),
      idEquipeDomicileReelle: z.number().int(),
      idEquipeGagnante: z.nullable(z.number().int()),
      idEquipeForfait: z.nullable(z.number().int()),
      scoreEquipe1: z.nullable(z.number().int()),
      scoreEquipe2: z.nullable(z.number().int()),
      disqualificationEquipe1: z.boolean(),
      disqualificationEquipe2: z.boolean(),
      type: z.object({
        code: z.string(),
        libelle: z.string(),
      }),
      sexe: z.object({
        code: z.string(),
        libelle: z.string(),
      }),
      categorieAge: z.object({
        id: z.number().int(),
        libelle: z.string(),
      }),
      championnat: z.object({
        id: z.number().int(),
        libelle: z.string(),
      }),
      division: z.object({
        id: z.number().int(),
        libelle: z.string(),
      }),
      phase: z.object({
        id: z.number().int(),
        libelle: z.string(),
      }),
      poule: z.object({
        id: z.number().int(),
        libelle: z.string(),
      }),
    }),
  ),
});
type TenupResponse = z.infer<typeof tenupResponseSchema>;

export async function loadJson(path: string): Promise<TenupResponse> {
  const response = await fetch(path);
  const json = await response.json();
  const result = tenupResponseSchema.safeParse(json);
  if (!result.success) {
    console.log(result.error);
    throw new Error(`Failed to parse JSON for URL: ${path}`);
  }
  return result.data;
}

export const saveData = async (data: TenupResponse) => {
  const poolIdsKnown = await prisma.pool.findMany({
    select: { id: true },
  });
  const newIds: {
    divisionId: number;
    phaseId: number;
    poolId: number;
    championshipId: number;
  }[] = [];
  data.rencontres.forEach(({ division, phase, poule, championnat }) => {
    if (
      !poolIdsKnown.some(({ id }) => id === poule.id) &&
      !newIds.some(({ poolId }) => poolId === poule.id)
    ) {
      newIds.push({
        divisionId: division.id,
        phaseId: phase.id,
        poolId: poule.id,
        championshipId: championnat.id,
      });
    }
  });

  for (const { divisionId, phaseId, poolId, championshipId } of newIds) {
    await prisma.url.upsert({
      where: {
        json: `https://tenup.fft.fr/back/public/v1/championnats-equipes/${championshipId}/divisions/${divisionId}/phases/${phaseId}/poules/${poolId}?recupererStructure=true`,
      },
      update: {},
      create: {
        json: `https://tenup.fft.fr/back/public/v1/championnats-equipes/${championshipId}/divisions/${divisionId}/phases/${phaseId}/poules/${poolId}?recupererStructure=true`,
        isOver: false,
      },
    });
    console.log(`Inserted URL for pool ${poolId} into database.`);
  }
};

const webPath = "https://tenup.fft.fr/club/52350227/competitions";
const pathSplited = webPath.split("/");
const clubId = pathSplited[4];
const jsonPath = `https://tenup.fft.fr/back/public/v1/clubs/${clubId}/rencontres?passe=false`;
const data = await loadJson(jsonPath);
await saveData(data);
await prisma.$disconnect();
