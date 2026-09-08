/**
 * Gerador de componente padrão do boilerplate (FR-010, contracts/component-generator.md).
 * Uso: npm run generate:component -- NomeDoComponente
 */
export default function componentGenerator(plop) {
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
}
