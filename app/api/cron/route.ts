import "dotenv/config";
import { NextRequest } from "next/server";
import { loadJson, prisma, saveData } from "../../../scripts/loadJson";

export async function GET(request: NextRequest) {
  // Optionnel : Sécuriser l'appel avec une clé secrète
  console.log("Starting cron job to load JSON data...");
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const paths = await prisma.url.findMany({
      where: {
        isOver: false,
      },
      select: {
        json: true,
      },
    });
    const data = await loadJson(paths.map((p) => p.json));
    for (const dataItem of data) {
      await saveData(dataItem);
      console.log(`Saved data item for: ${dataItem.division.nom || "Unknown"}`);
    }
    await prisma.$disconnect();
    return Response.json({ success: true });
  } catch (error) {
    console.log("Error in cron job:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// GET(
//   new NextRequest("http://localhost/api/cron", {
//     headers: {
//       authorization: `Bearer ${process.env.CRON_SECRET}`,
//     },
//   })
// );
