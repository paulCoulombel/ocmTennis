import {
  Column,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Row,
  Section,
  Tailwind,
  pixelBasedPreset,
} from "@react-email/components";

//cspell:disable

export default function DefaultMailTemplate({
  imageBaseUrl,
  children,
}: {
  imageBaseUrl: string;
  children?: React.ReactNode;
}) {
  // Use the base url to load images both in production and in preview modes.
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              primary: "#109359",
              "primary-foreground": "#0f1c14",
              background: "#FFFFFF",
              foreground: "#140F0D",
            },
          },
        },
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily="Inter"
            fallbackFontFamily="Verdana"
            webFont={{
              url: "https://fonts.gstatic.com/s/inter/v13/UcCo3FwrK3iLTcviYwY.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Section className="p-8">
          <Row>
            <Column align="center">
              <table style={{ margin: "0 auto" }}>
                <tr>
                  <td style={{ verticalAlign: "middle", paddingRight: "8px" }}>
                    <Img
                      className="h-20 w-20"
                      src={`${imageBaseUrl}/static/logo_bg_white.png`}
                    />
                  </td>
                  <td style={{ verticalAlign: "middle" }}>
                    <Heading as="h1" className="text-4xl font-extrabold">
                      Montauban Tennis Club
                    </Heading>
                  </td>
                </tr>
              </table>
            </Column>
          </Row>
          <Hr className="!border-4 !border-primary" />
          {children}
        </Section>
      </Html>
    </Tailwind>
  );
}
