/* =============================================
   FONT LOADER UTILITY - Block n' Roll
   ============================================= */

/**
 * Font loading detection and fallback utility
 * Ensures proper font display across all devices
 */

// Simple font loading detection
class SimpleFontFaceObserver {
  private fontFamily: string;
  private timeout: number;

  constructor(fontFamily: string, timeout: number = 3000) {
    this.fontFamily = fontFamily;
    this.timeout = timeout;
  }

  async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      const testString = "abcdefghijklmnopqrstuvwxyz0123456789";
      const testSize = "72px";
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // Set initial font
      context.font = `${testSize} Arial`;
      const initialWidth = context.measureText(testString).width;

      // Set target font
      context.font = `${testSize} "${this.fontFamily}", Arial`;
      const targetWidth = context.measureText(testString).width;

      // If widths are different, font is loaded
      if (Math.abs(targetWidth - initialWidth) > 1) {
        resolve();
        return;
      }

      // Wait for font to load
      const timeoutId = setTimeout(() => {
        reject(
          new Error(
            `Font ${this.fontFamily} failed to load within ${this.timeout}ms`
          )
        );
      }, this.timeout);

      // Check periodically
      const checkFont = () => {
        context.font = `${testSize} "${this.fontFamily}", Arial`;
        const currentWidth = context.measureText(testString).width;

        if (Math.abs(currentWidth - initialWidth) > 1) {
          clearTimeout(timeoutId);
          resolve();
        } else {
          requestAnimationFrame(checkFont);
        }
      };

      requestAnimationFrame(checkFont);
    });
  }
}

/**
 * Initialize font loading detection
 */
export const initFontLoading = async (): Promise<void> => {
  try {
    // Add loading class to body
    document.body.classList.add("font-loading");

    // Wait for custom fonts to load
    const fontObserver = new SimpleFontFaceObserver("Feast of Flesh BB", 5000);
    await fontObserver.load();

    // Fonts loaded successfully
    document.body.classList.remove("font-loading");
    document.body.classList.add("fonts-loaded");
    document.body.classList.add("font-loading-animation");

    console.log("✅ Custom fonts loaded successfully");

    // Remove animation class after animation completes
    setTimeout(() => {
      document.body.classList.remove("font-loading-animation");
    }, 300);
  } catch (error) {
    // Fonts failed to load, use fallbacks
    document.body.classList.remove("font-loading");
    document.body.classList.add("fonts-failed");

    console.warn("⚠️ Custom fonts failed to load, using fallbacks:", error);
  }
};

/**
 * Check if custom fonts are available
 */
export const areCustomFontsAvailable = (): boolean => {
  return document.body.classList.contains("fonts-loaded");
};

/**
 * Force reload fonts (useful for testing)
 */
export const reloadFonts = (): void => {
  document.body.classList.remove("fonts-loaded", "fonts-failed");
  initFontLoading();
};

// Auto-initialize on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFontLoading);
  } else {
    initFontLoading();
  }
}
