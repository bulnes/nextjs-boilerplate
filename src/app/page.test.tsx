import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Home from "./page";

describe("Home", () => {
  it("tem exatamente um H1 com o nome do produto", () => {
    render(<Home />);
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0]).toHaveAccessibleName("nextjs-boilerplate");
  });

  it("expõe os 4 grupos da ficha técnica como H3 sob o H2 correspondente", () => {
    render(<Home />);
    const h2 = screen.getByRole("heading", { level: 2, name: "FICHA TÉCNICA" });
    const h3 = screen.getAllByRole("heading", { level: 3 });
    const fichaTecnicaLabels = ["Runtime", "Dados e sessão", "Segurança", "Qualidade e CI"];

    expect(h2).toBeInTheDocument();
    for (const label of fichaTecnicaLabels) {
      expect(h3.some((heading) => heading.textContent === label)).toBe(true);
    }
  });

  it("expõe os 3 subtópicos de 'o que já vem pronto' como H3 sob o H2 correspondente", () => {
    render(<Home />);
    const h2 = screen.getByRole("heading", { level: 2, name: "O QUE JÁ VEM PRONTO" });
    const h3 = screen.getAllByRole("heading", { level: 3 });
    const subtopicos = [
      "Autenticação e banco de dados",
      "Segurança desde o primeiro commit",
      "Qualidade e CI",
    ];

    expect(h2).toBeInTheDocument();
    for (const label of subtopicos) {
      expect(h3.some((heading) => heading.textContent === label)).toBe(true);
    }
  });

  it("usa exatamente 7 H3 no total e nenhum heading de nível 4-6", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(7);
    expect(screen.queryAllByRole("heading", { level: 4 })).toHaveLength(0);
    expect(screen.queryAllByRole("heading", { level: 5 })).toHaveLength(0);
    expect(screen.queryAllByRole("heading", { level: 6 })).toHaveLength(0);
  });

  it("não pula nível de heading: a sequência no DOM é H1, H2, H3×4, H2, H3×3", () => {
    render(<Home />);
    const headings = screen.getAllByRole("heading");
    const levels = headings.map((heading) => Number(heading.tagName[1]));

    expect(levels).toEqual([1, 2, 3, 3, 3, 3, 2, 3, 3, 3]);
  });
});
