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

const ContactEmail = ({ title, summary, details, message }) =>
  React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, title),
    React.createElement(
      Body,
      { style: { backgroundColor: "#f6f9fc", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif" } },
      React.createElement(
        Container,
        { style: { margin: "0 auto", padding: "24px", maxWidth: "640px" } },
        React.createElement(
          Section,
          { style: { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 24 } },
          React.createElement(Heading, { as: "h2", style: { margin: 0, marginBottom: 16, color: "#111827" } }, title),
        React.createElement(
          Section,
          null,
            ...summary.map(([k, v], idx) =>
            React.createElement(Row, {
              key: k,
                style: { backgroundColor: idx % 2 ? "#f9fafb" : "transparent", padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
              children: [
                React.createElement(
                  Column,
                    { style: { width: 180 } },
                    React.createElement(Text, { style: { margin: 0, fontWeight: 600, color: "#6b7280" } }, k)
                ),
                React.createElement(
                  Column,
                  null,
                    Array.isArray(v)
                      ? React.createElement(
                          "div",
                          null,
                          ...v.map((item, i) =>
                            React.createElement(
                              "span",
                              {
                                key: i,
                                style: {
                                  display: "inline-block",
                                  backgroundColor: "#eef2ff",
                                  color: "#3730a3",
                                  padding: "4px 10px",
                                  borderRadius: 9999,
                                  fontSize: 12,
                                  marginRight: 6,
                                  marginBottom: 6,
                                },
                              },
                              item
                            )
                          )
                        )
                      : React.createElement(Text, { style: { margin: 0, color: "#111827" } }, v || "-")
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
                React.createElement(Heading, { as: "h3", style: { margin: 0, marginBottom: 8, fontSize: 16, color: "#111827" } }, "Detalles"),
                ...(details || []).map(([k, v], idx) =>
                React.createElement(Row, {
                  key: k,
                    style: { backgroundColor: idx % 2 ? "#f9fafb" : "transparent", padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
                  children: [
                    React.createElement(
                      Column,
                        { style: { width: 180 } },
                        React.createElement(Text, { style: { margin: 0, fontWeight: 600, color: "#6b7280" } }, k)
                    ),
                    React.createElement(
                      Column,
                      null,
                        Array.isArray(v)
                          ? React.createElement(
                              "div",
                              null,
                              ...v.map((item, i) =>
                                React.createElement(
                                  "span",
                                  {
                                    key: i,
                                    style: {
                                      display: "inline-block",
                                      backgroundColor: "#eef2ff",
                                      color: "#3730a3",
                                      padding: "4px 10px",
                                      borderRadius: 9999,
                                      fontSize: 12,
                                      marginRight: 6,
                                      marginBottom: 6,
                                    },
                                  },
                                  item
                                )
                              )
                            )
                          : React.createElement(Text, { style: { margin: 0, color: "#111827" } }, v || "-")
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
                  React.createElement(Heading, { as: "h3", style: { margin: 0, marginBottom: 8, fontSize: 16, color: "#111827" } }, "Mensaje"),
                React.createElement(Text, { style: { whiteSpace: "pre-wrap", margin: 0 } }, message)
              )
            )
          : null
        )
      )
    )
  );

export default ContactEmail;


