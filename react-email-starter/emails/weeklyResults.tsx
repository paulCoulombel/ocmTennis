import {
  Button,
  Column,
  Heading,
  Hr,
  Row,
  Text,
} from "@react-email/components";
import DefaultMailTemplate from "../templates/DefaultMailTemplate";
// cspell:disable
const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const WeeklyResults = () => {
  return (
    <DefaultMailTemplate imageBaseUrl={baseUrl}>
      <Row>
        <Column>
          <Heading as="h2" className="text-center">
            Résultats Hebdomadaires
          </Heading>
        </Column>
      </Row>
      <Hr />
      <Row>
        <Column className="text-center">
          <Text>
            Ci-joint les résultats des rencontres par équipes du club. Les
            images peuvent être directement postées en story.
          </Text>
        </Column>
      </Row>
      <Row>
        <Column className="flex w-full justify-center">
          <Button
            href={"site-club.vercel.app"}
            className="rounded bg-primary px-3 py-2 font-medium leading-4 text-primary-foreground"
          >
            Accéder au site du club
          </Button>
        </Column>
      </Row>
    </DefaultMailTemplate>
  );
};

export default WeeklyResults;
