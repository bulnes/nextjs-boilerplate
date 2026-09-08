import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("renderiza o bloco application/ld+json com os dados serializados", () => {
    const { container } = render(<JsonLd data={{ "@type": "Organization", name: "Acme" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).not.toBeNull();
    expect(JSON.parse(script?.textContent ?? "")).toEqual({
      "@type": "Organization",
      name: "Acme",
    });
  });
});
