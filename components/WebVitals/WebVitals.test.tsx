import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

import { logger } from "@/lib/logger";

import { WebVitals } from "./WebVitals";

let capturedCallback: ((metric: unknown) => void) | undefined;

vi.mock("next/web-vitals", () => ({
  useReportWebVitals: (callback: (metric: unknown) => void) => {
    capturedCallback = callback;
  },
}));

describe("WebVitals", () => {
  it("não renderiza nada", () => {
    const { container } = render(<WebVitals />);
    expect(container).toBeEmptyDOMElement();
  });

  it("loga a métrica recebida via lib/logger", () => {
    render(<WebVitals />);
    const infoSpy = vi.spyOn(logger, "info").mockImplementation(() => {});

    capturedCallback?.({ name: "LCP", value: 1200, rating: "good", id: "abc" });

    expect(infoSpy).toHaveBeenCalledWith(
      "web_vitals",
      expect.objectContaining({ name: "LCP", value: 1200, rating: "good", id: "abc" }),
    );

    infoSpy.mockRestore();
  });
});
