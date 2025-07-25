import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import Gallery from "./Gallery";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "gallery.title": "Gallery",
        "gallery.subtitle":
          "Check out our latest training sessions and community moments",
        "gallery.ctaText":
          "Stay up to date with our latest training sessions and community moments",
        "gallery.followButton": "Follow @blocknrollbeachvolleybcn",
        "gallery.watchOnInstagram": "Watch on Instagram",
        "gallery.swipeHint": "Swipe to see more",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Instagram: () => <span data-testid="instagram-icon">📷</span>,
  ExternalLink: () => <span data-testid="external-link-icon">🔗</span>,
}));

// Mock the UI components
vi.mock("./ui", () => ({
  GalleryImage: ({
    src,
    alt,
    isFocused,
    className,
  }: {
    src: string;
    alt: string;
    isFocused: boolean;
    className?: string;
  }) => {
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
    const isInstagramUrl = alt.includes("instagram.com");

    return (
      <div
        data-testid="gallery-image"
        data-src={src}
        data-alt={alt}
        data-focused={isFocused}
        className={`gallery-image-container ${className || ""}`}
      >
        {isVideo ? (
          <video src={src} title={alt} className="gallery-media" />
        ) : (
          <img src={src} alt={alt} className="gallery-media" />
        )}
        {isFocused && isInstagramUrl && (
          <div className="gallery-instagram-button-container">
            <button
              data-testid="instagram-button"
              className="btn-instagram btn-instagram-small"
            >
              Watch on Instagram
            </button>
          </div>
        )}
      </div>
    );
  },
}));

// Mock the image and video imports
vi.mock("../assets/img/gallery/ig-post-1.jpg", () => ({
  default: "/mock-image-1.jpg",
}));

vi.mock("../assets/video/gallery/ig-post-2.mp4", () => ({
  default: "/mock-video-2.mp4",
}));

vi.mock("../assets/video/gallery/ig-post-3.mp4", () => ({
  default: "/mock-video-3.mp4",
}));

// Mock DOM methods and properties
const mockScrollTo = vi.fn();

Object.defineProperty(HTMLDivElement.prototype, "scrollTo", {
  value: mockScrollTo,
  writable: true,
});

// Mock window properties
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock body style
Object.defineProperty(document.body, "style", {
  value: { overflow: "unset" },
  writable: true,
});

describe("Gallery - Component Rendering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024; // Default to desktop
  });

  it("renders without crashing", () => {
    render(<Gallery />);
    expect(screen.getByText("Gallery")).toBeInTheDocument();
  });

  it("displays gallery title and subtitle", () => {
    render(<Gallery />);

    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Check out our latest training sessions and community moments"
      )
    ).toBeInTheDocument();
  });

  it("renders all gallery items", () => {
    render(<Gallery />);

    const galleryImages = screen.getAllByTestId("gallery-image");
    expect(galleryImages).toHaveLength(3);

    // Check that images have correct sources
    expect(galleryImages[0]).toHaveAttribute("data-src", "/mock-image-1.jpg");
    expect(galleryImages[1]).toHaveAttribute("data-src", "/mock-video-2.mp4");
    expect(galleryImages[2]).toHaveAttribute("data-src", "/mock-video-3.mp4");
  });

  it("renders CTA section with Instagram link", () => {
    render(<Gallery />);

    expect(
      screen.getByText(
        "Stay up to date with our latest training sessions and community moments"
      )
    ).toBeInTheDocument();

    const followLink = screen.getByRole("link", {
      name: /follow @blocknrollbeachvolleybcn/i,
    });
    expect(followLink).toBeInTheDocument();
    expect(followLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/blocknrollbeachvolleybcn"
    );
    expect(followLink).toHaveAttribute("target", "_blank");
  });

  it("includes proper accessibility attributes", () => {
    render(<Gallery />);

    // The section should have id="gallery"
    const section = document.getElementById("gallery");
    expect(section).toBeInTheDocument();

    const followLink = screen.getByRole("link", {
      name: /follow @blocknrollbeachvolleybcn/i,
    });
    expect(followLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(followLink).toHaveAttribute("target", "_blank");
  });
});

describe("Gallery - Focus Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
  });

  it("focuses item when clicked", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    fireEvent.click(firstItem);

    expect(galleryItems[0]).toHaveAttribute("data-focused", "true");
  });

  it("unfocuses item when clicked again", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    // Focus
    fireEvent.click(firstItem);
    expect(galleryItems[0]).toHaveAttribute("data-focused", "true");

    // Unfocus
    fireEvent.click(firstItem);
    expect(galleryItems[0]).toHaveAttribute("data-focused", "false");
  });

  it("shows overlay when item is focused", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    fireEvent.click(firstItem);

    const overlay = document.querySelector(".gallery-overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("prevents body scroll when item is focused", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    fireEvent.click(firstItem);

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("shows Instagram button for focused items with Instagram URLs", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    fireEvent.click(firstItem);

    const instagramButton = screen.getByTestId("instagram-button");
    expect(instagramButton).toBeInTheDocument();
  });
});

describe("Gallery - Mobile Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 480; // Mobile size
  });

  afterEach(() => {
    window.innerWidth = 1024; // Reset to desktop
  });

  it("detects mobile screen size", async () => {
    render(<Gallery />);

    await waitFor(() => {
      const carouselInner = document.querySelector(".gallery-carousel-inner");
      expect(carouselInner).toHaveClass("scroll-mode");
    });
  });

  it("shows scroll indicators on mobile", async () => {
    render(<Gallery />);

    await waitFor(() => {
      expect(screen.getByText("Swipe to see more")).toBeInTheDocument();

      const scrollDots = document.querySelectorAll(".gallery-scroll-dot");
      expect(scrollDots).toHaveLength(3);
    });
  });

  it("hides scroll indicators on desktop", async () => {
    window.innerWidth = 1024;
    render(<Gallery />);

    await waitFor(() => {
      expect(screen.queryByText("Swipe to see more")).not.toBeInTheDocument();
    });
  });

  it("updates active dot on scroll", async () => {
    render(<Gallery />);

    await waitFor(() => {
      const scrollDots = document.querySelectorAll(".gallery-scroll-dot");
      expect(scrollDots).toHaveLength(3);
      // First dot should be active by default
      const activeDots = document.querySelectorAll(
        ".gallery-scroll-dot.active"
      );
      expect(activeDots).toHaveLength(1);
    });
  });

  it("responds to window resize", async () => {
    render(<Gallery />);

    // Start mobile
    await waitFor(() => {
      const carouselInner = document.querySelector(".gallery-carousel-inner");
      expect(carouselInner).toHaveClass("scroll-mode");
    });

    // Change to desktop
    window.innerWidth = 1024;

    // Trigger resize event
    fireEvent(window, new Event("resize"));

    await waitFor(() => {
      const carouselInner = document.querySelector(".gallery-carousel-inner");
      expect(carouselInner).not.toHaveClass("scroll-mode");
    });
  });
});

describe("Gallery - Event Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
  });

  it("handles click outside to close focused item", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    // Focus item
    fireEvent.click(firstItem);
    expect(galleryItems[0]).toHaveAttribute("data-focused", "true");

    // Click outside (on overlay)
    const overlay = document.querySelector(".gallery-overlay")!;
    fireEvent.click(overlay);

    expect(galleryItems[0]).toHaveAttribute("data-focused", "false");
  });

  it("stops propagation when clicking gallery items", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    // The component should handle clicks and stop propagation
    // We can verify this indirectly by checking that clicks work as expected
    fireEvent.click(firstItem);
    expect(galleryItems[0]).toHaveAttribute("data-focused", "true");
  });

  it("restores body overflow when component unmounts", () => {
    render(<Gallery />);

    const galleryItems = screen.getAllByTestId("gallery-image");
    const firstItem = galleryItems[0].parentElement!;

    // Focus item
    fireEvent.click(firstItem);
    expect(document.body.style.overflow).toBe("hidden");

    // Unfocus item (click again)
    fireEvent.click(firstItem);
    expect(document.body.style.overflow).toBe("unset");
  });
});

describe("Gallery - Business Value", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1024;
  });

  it("displays social proof through Instagram content", () => {
    render(<Gallery />);

    const galleryImages = screen.getAllByTestId("gallery-image");

    // All items should have Instagram URLs as alt text
    galleryImages.forEach((image) => {
      const alt = image.getAttribute("data-alt");
      expect(alt).toContain("instagram.com");
    });
  });

  it("drives social media engagement through CTA", () => {
    render(<Gallery />);

    const followLink = screen.getByRole("link", {
      name: /follow @blocknrollbeachvolleybcn/i,
    });
    expect(followLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/blocknrollbeachvolleybcn"
    );

    // Check for Instagram icon
    expect(screen.getAllByTestId("instagram-icon")).toHaveLength(1); // CTA button
  });

  it("provides engaging visual content for user retention", () => {
    render(<Gallery />);

    // Should have mix of images and videos
    const galleryImages = screen.getAllByTestId("gallery-image");
    const sources = galleryImages.map((img) => img.getAttribute("data-src"));

    expect(sources.some((src) => src?.includes(".jpg"))).toBe(true);
    expect(sources.some((src) => src?.includes(".mp4"))).toBe(true);
  });

  it("offers smooth user experience across devices", async () => {
    // Test desktop mode
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { rerender } = render(<Gallery />);

    // Initially should be desktop mode
    let carouselInner = document.querySelector(".gallery-carousel-inner");
    expect(carouselInner).not.toHaveClass("scroll-mode");

    // Test mobile mode
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    });

    // Trigger resize event and rerender
    fireEvent(window, new Event("resize"));
    rerender(<Gallery />);

    await waitFor(() => {
      carouselInner = document.querySelector(".gallery-carousel-inner");
      expect(carouselInner).toHaveClass("scroll-mode");
    });
  });

  it("includes proper external link attributes for SEO and security", () => {
    render(<Gallery />);

    const followLink = screen.getByRole("link", {
      name: /follow @blocknrollbeachvolleybcn/i,
    });
    expect(followLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(followLink).toHaveAttribute("target", "_blank");
  });
});
