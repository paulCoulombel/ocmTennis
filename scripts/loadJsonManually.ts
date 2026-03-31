import { PrismaClient } from '@prisma/client'
import { isAfter } from 'date-fns'
import z from 'zod'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn']
  })

const tenupResponseSchema = z.object({
  championnat: z.object({
    id: z.number().int(),
    nom: z.string(),
    formatSimple: z.object({
      code: z.string()
    }),
    formatDouble: z.object({
      code: z.string()
    }),
    pointsVictoire: z.number().int(),
    pointsNul: z.number().int(),
    pointsDefaite: z.number().int(),
    pointsForfait: z.number().int(),
    pointsDisqualification: z.number().int(),
    nombreSimples: z.number().int(),
    nombreDoubles: z.number().int(),
    bonusDouble: z.boolean(),
    pointsSimple: z.number().int(),
    pointsDouble: z.number().int()
  }),
  division: z.object({
    id: z.number().int(),
    nom: z.string()
  }),
  phase: z.object({
    id: z.number().int(),
    calendrier: z.array(
      z.object({
        dateJournee: z.string(),
        typePoule: z.number().int(),
        numeroJournee: z.number().int()
      })
    )
  }),
  poule: z.object({
    id: z.number().int(),
    nom: z.string(),
    equipes: z.array(
      z.object({
        id: z.number().int(),
        nom: z.string(),
        classement: z.number().int(),
        points: z.number().int()
      })
    ),
    rencontres: z.array(
      z.object({
        id: z.number().int(),
        dateReelle: z.string(),
        dateTheorique: z.string(),
        idEquipeDomicileReelle: z.number().int(),
        idEquipe1: z.number().int(),
        idEquipe2: z.number().int(),
        scoreEnCoursEquipe1: z.nullable(z.number().int()),
        scoreEnCoursEquipe2: z.nullable(z.number().int()),
        position: z.number().int(),
        scoreEquipe1: z.nullable(z.number()),
        scoreEquipe2: z.nullable(z.number()),
        idEquipeForfait: z.nullable(z.number()),
        disqualificationEquipe1: z.boolean(),
        disqualificationEquipe2: z.boolean()
      })
    )
  })
})
type TenupResponse = z.infer<typeof tenupResponseSchema>

export async function loadJson(pathes: string[]): Promise<TenupResponse[]> {
  const allData = await Promise.all(
    pathes.map(async (url) => {
      const response = await fetch(url)
      const json = await response.json()
      const result = tenupResponseSchema.safeParse(json)
      if (!result.success) {
        console.log(result.error)
        throw new Error(`Failed to parse JSON for URL: ${url}`)
      }
      return result.data
    })
  )
  return allData
}

export const saveData = async (data: TenupResponse) => {
  const championshipId = data.championnat.id
  const divisionId = data.division.id
  const phaseId = data.phase.id
  const dayNumber = data.phase.calendrier.length
  const poolId = data.poule.id
  const poolName = data.poule.nom
  const category = data.championnat.nom.includes('+35 MESSIEURS')
    ? 'SH35'
    : data.championnat.nom.includes('SENIORS MESSIEURS')
      ? 'SH'
      : data.championnat.nom.includes('SENIORS DAMES')
        ? 'SD'
        : data.championnat.nom.includes('J - ')
          ? 'Jeunes'
          : data.championnat.nom
  const subcategory =
    category === 'Jeunes'
      ? data.championnat.nom.includes('11/13 ans FILLES')
        ? 'F 11/13'
        : data.championnat.nom.includes('14/18 ans FILLES')
          ? 'F 14/18'
          : data.championnat.nom.includes('8/10 ans GARCONS')
            ? 'F/G 8/10'
            : data.championnat.nom.includes('11/12 ans GARCONS')
              ? 'G 11/12'
              : data.championnat.nom.includes('13/14 ans GARCONS')
                ? 'G 13/14'
                : data.championnat.nom.includes('15/16 ans GARCONS')
                  ? 'G 15/16'
                  : data.championnat.nom.includes('17/18 ans GARCONS')
                    ? 'G 17/18'
                    : data.championnat.nom
      : null
  const ballColor = data.championnat.nom.includes('Vert')
    ? 'green'
    : data.championnat.nom.includes('Orange')
      ? 'orange'
      : 'yellow'
  const divisionName = data.division.nom.includes('PRE REGIONALE')
    ? 'PRE REG'
    : data.championnat.nom.includes('REGIONAL')
      ? 'R' + data.division.nom[data.division.nom.length - 1]
      : data.division.nom.includes('Super')
        ? 'Super D' + data.division.nom[data.division.nom.length - 1]
        : data.championnat.nom.includes('Vert')
          ? 'D' + data.division.nom[data.division.nom.length - 6]
          : data.championnat.nom.includes('Orange')
            ? 'D' + data.division.nom[data.division.nom.length - 8]
            : 'D' + data.division.nom[data.division.nom.length - 1]

  const teamNullIds: number[] = [] // Fake Teams here to complete the right number in each pool but we don't want to save them in the database
  const teams = data.poule.equipes
    .map((team) => {
      if (team.nom.includes('COMITE ILLE ET VILAINE')) {
        teamNullIds.push(team.id)
        return
      }
      return {
        id: team.id,
        name: team.nom.replace('MONTAUBAN OC', 'OCM'),
        poolId: poolId,
        fromClub: team.nom.includes('MONTAUBAN OC'),
        rank: team.classement,
        points: team.points
      }
    })
    .filter((team) => team !== undefined)
  const matches = data.poule.rencontres
    .map((match) => {
      if (
        teamNullIds.includes(match.idEquipe1) ||
        teamNullIds.includes(match.idEquipe2)
      ) {
        return
      }
      return {
        id: match.id,
        date: new Date(match.dateReelle),
        isLate: isAfter(
          new Date(match.dateReelle),
          new Date(match.dateTheorique)
        ),
        homeTeamId: match.idEquipeDomicileReelle,
        awayTeamId:
          match.idEquipeDomicileReelle === match.idEquipe1
            ? match.idEquipe2
            : match.idEquipe1,
        homeScore:
          match.idEquipeDomicileReelle === match.idEquipe1
            ? match.scoreEquipe1
            : match.scoreEquipe2,
        awayScore:
          match.idEquipeDomicileReelle === match.idEquipe1
            ? match.scoreEquipe2
            : match.scoreEquipe1,
        day: match.position,
        isPlayed: match.scoreEquipe1 !== null && match.scoreEquipe2 !== null,
        isForfeit: match.idEquipeForfait !== null,
        isDisqualified:
          match.disqualificationEquipe1 || match.disqualificationEquipe2
      }
    })
    .filter((match) => match !== undefined)

  await prisma.pool.upsert({
    where: { id: poolId },
    update: {
      id: poolId,
      name: poolName,
      category,
      subcategory,
      ballColor,
      division: divisionName,
      championshipId,
      divisionId,
      phaseId,
      dayNumber,
      doubleBonus: data.championnat.bonusDouble,
      doubleCount: data.championnat.nombreDoubles,
      doubleFormatCode: parseInt(data.championnat.formatDouble.code),
      simpleCount: data.championnat.nombreSimples,
      simpleFormatCode: parseInt(data.championnat.formatSimple.code),
      pointsForDisqualification: data.championnat.pointsDisqualification,
      pointsForLoss: data.championnat.pointsDefaite,
      pointsForDraw: data.championnat.pointsNul,
      pointsForWin: data.championnat.pointsVictoire,
      pointsForForfeit: data.championnat.pointsForfait,
      pointsForDoubleWin: data.championnat.pointsDouble,
      pointsForSimpleWin: data.championnat.pointsSimple
    },
    create: {
      id: poolId,
      name: poolName,
      category,
      subcategory,
      ballColor,
      division: divisionName,
      championshipId,
      divisionId,
      phaseId,
      dayNumber,
      doubleBonus: data.championnat.bonusDouble,
      doubleCount: data.championnat.nombreDoubles,
      doubleFormatCode: parseInt(data.championnat.formatDouble.code),
      simpleCount: data.championnat.nombreSimples,
      simpleFormatCode: parseInt(data.championnat.formatSimple.code),
      pointsForDisqualification: data.championnat.pointsDisqualification,
      pointsForLoss: data.championnat.pointsDefaite,
      pointsForDraw: data.championnat.pointsNul,
      pointsForWin: data.championnat.pointsVictoire,
      pointsForForfeit: data.championnat.pointsForfait,
      pointsForDoubleWin: data.championnat.pointsDouble,
      pointsForSimpleWin: data.championnat.pointsSimple
    }
  })

  await Promise.all(
    teams.map(async (team) => {
      await prisma.team.upsert({
        where: { id: team.id },
        update: {
          id: team.id,
          name: team.name,
          rank: team.rank,
          points: team.points,
          fromClub: team.fromClub,
          poolId
        },
        create: {
          id: team.id,
          name: team.name,
          rank: team.rank,
          points: team.points,
          fromClub: team.fromClub,
          poolId
        }
      })
    })
  )

  await Promise.all(
    matches.map(async (match) => {
      await prisma.match.upsert({
        where: { id: match.id },
        update: {
          date: match.date,
          isLate: match.isLate,
          homeTeam: { connect: { id: match.homeTeamId } },
          awayTeam: { connect: { id: match.awayTeamId } },
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          day: match.day,
          isPlayed: match.isPlayed,
          isForfeit: match.isForfeit,
          isDisqualified: match.isDisqualified
        },
        create: {
          id: match.id,
          date: match.date,
          isLate: match.isLate,
          homeTeam: { connect: { id: match.homeTeamId } },
          awayTeam: { connect: { id: match.awayTeamId } },
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          day: match.day,
          isPlayed: match.isPlayed,
          isForfeit: match.isForfeit,
          isDisqualified: match.isDisqualified
        }
      })
    })
  )
}

const jsonPaths = await prisma.url.findMany({
  where: {
    isOver: false
  },
  select: {
    json: true
  }
})
const paths = jsonPaths.map((entry) => entry.json)
console.log(paths)
const data = await loadJson(paths)
for (const dataItem of data) {
  await saveData(dataItem)
  console.log(`Saved data item for: ${dataItem.division.nom || 'Unknown'}`)
}

// const paths2 = [
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136355/phases/219749/poules/486540?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540504/divisions/140859/phases/226931/poules/499550?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540504/divisions/140857/phases/226929/poules/499557?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540504/divisions/140857/phases/226929/poules/499558?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540511/divisions/140877/phases/226949/poules/499593?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540513/divisions/140879/phases/226951/poules/499596?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540510/divisions/140881/phases/226954/poules/499610?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540514/divisions/140893/phases/226967/poules/499632?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540506/divisions/140849/phases/226918/poules/499541?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136822/phases/220360/poules/493730?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136353/phases/219747/poules/486555?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136357/phases/219751/poules/486566?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136816/phases/220354/poules/487691?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136352/phases/219746/poules/486561?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136815/phases/220353/poules/491961?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136824/phases/220362/poules/493499?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136821/phases/220359/poules/493738?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136814/phases/220352/poules/491874?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540916/divisions/135793/phases/218902/poules/491767?recupererStructure=true',
//   'https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136814/phases/220352/poules/491861?recupererStructure=true'
// ]
// paths2.map(async (path) => {
//   await prisma.url.upsert({
//     where: { json: path },
//     update: {},
//     create: { json: path, isOver: false }
//   })
// })

await prisma.$disconnect()
