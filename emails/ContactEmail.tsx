import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
} from "@react-email/components";

export interface ContactEmailProps {
  title: string;
  summary: Array<[string, string]>;
  details?: Array<[string, string]>;
  message?: string;
}

const ContactEmail: React.FC<ContactEmailProps> = ({ title, summary, details, message }) => (
  <Html>
    <Head />
    <Preview>{title}</Preview>
    <Body style={{ backgroundColor: "#ffffff", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif" }}>
      <Container style={{ margin: "0 auto", padding: "24px", maxWidth: "640px" }}>
        <Heading as="h2" style={{ margin: 0, marginBottom: 12 }}>{title}</Heading>

        <Section>
          {summary.map(([k, v]) => (
            <Row key={k}>
              <Column style={{ width: 180 }}>
                <Text style={{ margin: 0, fontWeight: 600 }}>{k}</Text>
              </Column>
              <Column>
                <Text style={{ margin: 0 }}>{v || "-"}</Text>
              </Column>
            </Row>
          ))}
        </Section>

        {details && details.length > 0 && (
          <Section>
            <Hr />
            {details.map(([k, v]) => (
              <Row key={k}>
                <Column style={{ width: 180 }}>
                  <Text style={{ margin: 0, fontWeight: 600 }}>{k}</Text>
                </Column>
                <Column>
                  <Text style={{ margin: 0 }}>{v || "-"}</Text>
                </Column>
              </Row>
            ))}
          </Section>
        )}

        {message && (
          <>
            <Hr />
            <Section>
              <Text style={{ whiteSpace: "pre-wrap", margin: 0 }}>{message}</Text>
            </Section>
          </>
        )}
      </Container>
    </Body>
  </Html>
);

export default ContactEmail;


