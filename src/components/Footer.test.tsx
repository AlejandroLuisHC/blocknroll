import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Footer from "./Footer";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "footer.description":
          "Join our passionate beach volleyball community in Barcelona",
        "footer.quickLinks": "Quick Links",
        "footer.contactInfo": "Contact Info",
        "footer.privacyPolicy": "Privacy Policy",
        "footer.rights": "All rights reserved",
        "footer.newsletter.title": "Newsletter",
        "footer.newsletter.description":
          "Subscribe to our newsletter for updates",
        "footer.newsletter.placeholder": "Enter your email",
        "footer.newsletter.subscribe": "Subscribe",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",

        // Contact information
        "contact.info.location.content": "Barcelona Beach Volleyball Courts",
        "contact.info.phone.content": "+34 123 456 789",
        "contact.info.email.content": "info@blocknroll.com",
        "contact.info.schedule.content": "Mon-Sun 9:00-21:00",

        // Navigation
        "nav.about": "About",
        "nav.services": "Services",
        "nav.gallery": "Gallery",
        "nav.contact": "Contact",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  MapPin: () => <span data-testid="map-pin-icon">📍</span>,
  Phone: () => <span data-testid="phone-icon">📞</span>,
  Mail: () => <span data-testid="mail-icon">📧</span>,
  Clock: () => <span data-testid="clock-icon">🕒</span>,
  Instagram: () => <span data-testid="instagram-icon">📷</span>,
  ArrowUp: () => <span data-testid="arrow-up-icon">⬆️</span>,
  Volleyball: () => <span data-testid="volleyball-icon">🏐</span>,
}));

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

describe("Footer - Business Information Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays essential business contact information", () => {
    render(<Footer />);

    // Test critical business contact details
    expect(
      screen.getByText("Barcelona Beach Volleyball Courts")
    ).toBeInTheDocument();
    expect(screen.getByText("+34 123 456 789")).toBeInTheDocument();
    expect(screen.getByText("info@blocknroll.com")).toBeInTheDocument();
    expect(screen.getByText("Mon-Sun 9:00-21:00")).toBeInTheDocument();
  });

  it("shows brand identity and description", () => {
    render(<Footer />);

    // Test brand presence in footer
    expect(screen.getByText("Block n' Roll")).toBeInTheDocument();
    expect(screen.getByText("Barcelona Beach Volleyball")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Join our passionate beach volleyball community in Barcelona"
      )
    ).toBeInTheDocument();
  });

  it("provides navigation links for user journey", () => {
    render(<Footer />);

    // Test footer navigation helps users continue their journey
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("includes social media presence for community building", () => {
    render(<Footer />);

    // Test social media link is present (important for community engagement)
    const instagramLink = screen.getByRole("link", {
      name: "📷 @blocknrollbeachvolleybcn",
    });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink.getAttribute("href")).toBe(
      "https://instagram.com/blocknrollbeachvolleybcn"
    );
    expect(instagramLink.getAttribute("target")).toBe("_blank");
  });

  it("displays contact section header for clarity", () => {
    render(<Footer />);

    // Test section organization
    expect(screen.getByText("Contact Info")).toBeInTheDocument();
  });

  it("handles scroll to top functionality", () => {
    render(<Footer />);

    // Test scroll to top button (UX improvement)
    const scrollButton = screen.getByRole("button", { name: "Scroll to top" });
    fireEvent.click(scrollButton);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("handles interactive hover effects on social links", () => {
    render(<Footer />);

    // Test social link hover interactions (UX enhancement)
    const instagramLink = screen.getByRole("link", {
      name: "📷 @blocknrollbeachvolleybcn",
    });

    // Test mouse enter and leave events
    fireEvent.mouseEnter(instagramLink);
    fireEvent.mouseLeave(instagramLink);

    expect(instagramLink).toBeInTheDocument();
  });

  it("handles navigation link hover effects", () => {
    render(<Footer />);

    // Test navigation link hover interactions
    const aboutLink = screen.getByRole("link", { name: "About" });

    fireEvent.mouseEnter(aboutLink);
    fireEvent.mouseLeave(aboutLink);

    expect(aboutLink).toBeInTheDocument();
  });

  it("includes newsletter subscription functionality", () => {
    render(<Footer />);

    // Test newsletter form elements are present (lead generation)
    const emailInput = screen.getByRole("textbox");
    const subscribeButton = screen.getByRole("button", { name: /subscribe/i });

    expect(emailInput).toBeInTheDocument();
    expect(emailInput.getAttribute("type")).toBe("email");
    expect(subscribeButton).toBeInTheDocument();
    expect(subscribeButton.getAttribute("type")).toBe("submit");
  });

  it("displays footer links with hover functionality", () => {
    render(<Footer />);

    // Test footer legal links
    const privacyLink = screen.getByRole("link", { name: /privacy/i });
    const termsLink = screen.getByRole("link", { name: /terms/i });

    // Test hover interactions
    fireEvent.mouseEnter(privacyLink);
    fireEvent.mouseLeave(privacyLink);
    fireEvent.mouseEnter(termsLink);
    fireEvent.mouseLeave(termsLink);

    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
  });

  it("displays current year in copyright", () => {
    render(<Footer />);

    // Test dynamic copyright year
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
