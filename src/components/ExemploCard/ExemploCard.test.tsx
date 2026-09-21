import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ExemploCard } from "./ExemploCard";

describe("ExemploCard", () => {
  it("renderiza os children", () => {
    render(<ExemploCard>conteúdo</ExemploCard>);
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("não tem violações de acessibilidade", async () => {
    const { container } = render(<ExemploCard>conteúdo</ExemploCard>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
