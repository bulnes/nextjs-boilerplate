/**
 * Geradores padrão do boilerplate (FR-010, contracts/component-generator.md).
 * Uso: npm run generate:component -- NomeDoComponente
 *      npm run generate:route -- nome-da-rota
 */
export default function generators(plop) {
  plop.setGenerator("component", {
    description: "Cria um componente com arquivo, teste e story colocados juntos",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nome do componente (PascalCase):",
        validate: (value) => {
          if (!/^[A-Z][A-Za-z0-9]*$/.test(value)) {
            return "O nome deve estar em PascalCase, ex.: BotaoPrimario";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/component/Component.tsx.hbs",
      },
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.test.tsx",
        templateFile: "templates/component/Component.test.tsx.hbs",
      },
      {
        type: "add",
        path: "components/{{pascalCase name}}/{{pascalCase name}}.stories.tsx",
        templateFile: "templates/component/Component.stories.tsx.hbs",
      },
    ],
  });

  plop.setGenerator("route", {
    description: "Cria um Route Handler de exemplo (POST) com schema Zod e teste colocados juntos",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nome da rota, sem /api/ (kebab-case):",
        validate: (value) => {
          if (!/^[a-z][a-z0-9-]*$/.test(value)) {
            return "O nome deve estar em kebab-case, ex.: pedidos-recentes";
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "lib/validations/{{kebabCase name}}.schema.ts",
        templateFile: "templates/route/schema.ts.hbs",
      },
      {
        type: "add",
        path: "app/api/{{kebabCase name}}/route.ts",
        templateFile: "templates/route/route.ts.hbs",
      },
      {
        type: "add",
        path: "app/api/{{kebabCase name}}/route.test.ts",
        templateFile: "templates/route/route.test.ts.hbs",
      },
    ],
  });
}
