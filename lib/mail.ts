import WeeklyResults from "@/react-email-starter/emails/weeklyResults";
import { Resend } from "resend";

export const sendStoryImage = async (
  email: string,
  attachments: {
    content: Buffer<ArrayBufferLike> | string;
    filename: string;
  }[]
) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not defined in environment variables");
    throw new Error("RESEND_API_KEY is missing");
  }
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: "tennis.ocm@resend.dev",
    to: email,
    subject: "Résultat de la semaine", //cspell:disable-line
    react: WeeklyResults(),
    attachments,
  });

  console.log("Email sent successfully:", result);

  if (result.error) {
    console.error("Resend API returned an error:", result.error);
    throw new Error(`Resend error: ${result.error}`);
  }
  return result;
};
