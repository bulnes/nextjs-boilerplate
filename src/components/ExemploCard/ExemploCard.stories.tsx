import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ExemploCard } from "./ExemploCard";

const meta = {
  title: "Components/ExemploCard",
  component: ExemploCard,
} satisfies Meta<typeof ExemploCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "conteúdo",
  },
};
