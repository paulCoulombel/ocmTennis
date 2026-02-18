import { loadJson, saveData } from "@/scripts/loadJson";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const paths = [
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136355/phases/219749/poules/486540?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136353/phases/219747/poules/486555?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136352/phases/219746/poules/486561?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540489/divisions/136357/phases/219751/poules/486566?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540916/divisions/135793/phases/218902/poules/491767?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136816/phases/220354/poules/487691?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136815/phases/220353/poules/491961?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136814/phases/220352/poules/491874?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540483/divisions/136814/phases/220352/poules/491861?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136824/phases/220362/poules/493499?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136822/phases/220360/poules/493730?recupererStructure=true",
    "https://tenup.fft.fr/back/public/v1/championnats-equipes/82540484/divisions/136821/phases/220359/poules/493738?recupererStructure=true",
  ];
  const data = await loadJson(paths);
  data.forEach(async (dataItem) => {
    await saveData(dataItem);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
