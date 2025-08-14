import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ContactEmail from "./ContactEmail";

describe("ContactEmail", () => {
  it("renders title, summary and details", () => {
    render(
      <ContactEmail
        title="New contact message"
        summary={[
          ["Type", "Join"],
          ["Name", "Jane"],
        ]}
        details={[
          ["Players", "2"],
          ["Level", "Intermedio"],
        ]}
        message={"Hello\nWorld"}
      />
    );
    // Heading text appears twice (Preview and H2). Target the H2 heading specifically.
    expect(screen.getByRole("heading", { level: 2, name: "New contact message" })).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Join")).toBeInTheDocument();
    expect(screen.getByText("Players")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText(/World/)).toBeInTheDocument();
  });
});


