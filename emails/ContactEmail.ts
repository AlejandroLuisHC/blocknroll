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

const ContactEmail = ({ title, summary, details, message }: ContactEmailProps) =>
  React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, title),
    React.createElement(
      Body,
      { style: { backgroundColor: "#ffffff", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif" } },
      React.createElement(
        Container,
        { style: { margin: "0 auto", padding: "24px", maxWidth: "640px" } },
        React.createElement(Heading, { as: "h2", style: { margin: 0, marginBottom: 12 } }, title),
        React.createElement(
          Section,
          null,
          ...summary.map(([k, v]) =>
            React.createElement(Row, {
              key: k,
              children: [
                React.createElement(
                  Column,
                  { style: { width: 180 } },
                  React.createElement(Text, { style: { margin: 0, fontWeight: 600 } }, k)
                ),
                React.createElement(
                  Column,
                  null,
                  React.createElement(Text, { style: { margin: 0 } }, v || "-")
                ),
              ],
            })
          )
        ),
        details && details.length
          ? React.createElement(
              Section,
              null,
              React.createElement(Hr, null),
              ...(details || []).map(([k, v]) =>
                React.createElement(Row, {
                  key: k,
                  children: [
                    React.createElement(
                      Column,
                      { style: { width: 180 } },
                      React.createElement(Text, { style: { margin: 0, fontWeight: 600 } }, k)
                    ),
                    React.createElement(
                      Column,
                      null,
                      React.createElement(Text, { style: { margin: 0 } }, v || "-")
                    ),
                  ],
                })
              )
            )
          : null,
        message
          ? React.createElement(
              React.Fragment,
              null,
              React.createElement(Hr, null),
              React.createElement(
                Section,
                null,
                React.createElement(Text, { style: { whiteSpace: "pre-wrap", margin: 0 } }, message)
              )
            )
          : null
      )
    )
  );

export default ContactEmail;


