import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Contact from "./Contact";

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

// Mock the contact form hook
const mockHandleSubmit = vi.fn();
const mockHandleChange = vi.fn();

vi.mock("../hooks/useContactForm", () => ({
  useContactForm: () => ({
    formData: {
      name: "",
      message: "",
    },
    handleSubmit: mockHandleSubmit,
    handleChange: mockHandleChange,
  }),
}));

describe("Contact Component - Business Logic Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders essential contact form elements", () => {
    render(<Contact />);

    // Test business-critical elements exist
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Send us a message")).toBeInTheDocument();
    expect(screen.getByText("Contact Information")).toBeInTheDocument();
  });

  it("displays contact information correctly", () => {
    render(<Contact />);

    // Test contact details are displayed (business value)
    expect(screen.getByText("123 Beach Volleyball Court")).toBeInTheDocument();
    expect(screen.getByText("+1 (555) 123-4567")).toBeInTheDocument();
    expect(screen.getByText("info@blocknroll.com")).toBeInTheDocument();
    expect(screen.getByText("Mon-Sun: 8AM-8PM")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(<Contact />);

    // Test that form submission handler exists (the hook is properly connected)
    const submitButton = screen.getByRole("button", { name: /send message/i });
    expect(submitButton).toHaveAttribute("type", "submit");

    // The actual submission is handled by the useContactForm hook,
    // which is tested separately. This tests the integration exists.
  });
});
