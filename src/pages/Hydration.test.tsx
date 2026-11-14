import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { act, waitFor, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import App from "../App";
import i18n from "../i18n";
import { renderPage } from "../entry-server";
import { languagePath, type SiteLanguage } from "../seo/site";

it.each<SiteLanguage>(["es", "ca", "en"])("hydrates the %s HTML without replacing the prerendered content", async (language) => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  window.history.replaceState(null, "", languagePath(language));
  await i18n.changeLanguage(language);
  const { body } = await renderPage(language);
  const container = document.createElement("div");
  container.innerHTML = body;
  document.body.append(container);
  const originalHeading = container.querySelector("h1");
  const onRecoverableError = vi.fn();
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, <StrictMode><App /></StrictMode>, { onRecoverableError });
  });
  try {
    await waitFor(() => expect(within(container).getByText("26/27")).toBeInTheDocument());
    expect(container.querySelector("h1")).toBe(originalHeading);
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(document.documentElement.lang).toBe(language);
    expect(container.querySelector("video")).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    window.history.replaceState(null, "", "/");
  }
});
