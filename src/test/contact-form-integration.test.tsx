import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Contact from "../components/Contact";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "contact.badge": "Contact Us",
        "contact.title": "Get in Touch",
        "contact.subtitle": "Ready to start your beach volleyball journey?",
        "contact.form.title": "Send us a message",
        "contact.form.name": "Full Name",
        "contact.form.email": "Email Address",
        "contact.form.phone": "Phone Number",
        "contact.form.program": "Program Interest",
        "contact.form.programs.basic": "Basic Training",
        "contact.form.programs.competitive": "Competitive",
        "contact.form.programs.elite": "Elite Program",
        "contact.form.programs.other": "Other",
        "contact.form.message": "Message",
        "contact.form.send": "Send Message",
        "contact.info.title": "Contact Information",
        "contact.info.description": "Get in touch with us today",
        "contact.info.location.content": "123 Beach Volleyball Court",
        "contact.info.phone.content": "+1 (555) 123-4567",
        "contact.info.email.content": "info@blocknroll.com",
        "contact.info.schedule.content": "Mon-Sun: 8AM-8PM",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  MapPin: () => <span data-testid="map-icon">📍</span>,
  Phone: () => <span data-testid="phone-icon">📞</span>,
  Mail: () => <span data-testid="mail-icon">✉️</span>,
  Clock: () => <span data-testid="clock-icon">🕒</span>,
  Send: () => <span data-testid="send-icon">📧</span>,
  Star: () => <span data-testid="star-icon">⭐</span>,
}));

describe("Contact Form - Business Workflows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays contact page with essential elements", () => {
    render(<Contact />);

    // Test core business elements are present
    expect(screen.getByText("Send us a message")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("shows all contact information", () => {
    render(<Contact />);

    // Test business-critical contact information is displayed
    expect(screen.getByText("123 Beach Volleyball Court")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("info@blocknroll.com")).toBeInTheDocument();
    expect(screen.getByText("Mon-Sun: 8AM-8PM")).toBeInTheDocument();
  });

  it("includes all program options for users", () => {
    render(<Contact />);

    // Test business logic: all programs are available for selection
    expect(screen.getByText("Basic Training")).toBeInTheDocument();
    expect(screen.getByText("Competitive")).toBeInTheDocument();
    expect(screen.getByText("Elite Program")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });
});
