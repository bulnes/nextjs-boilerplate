import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { JsonLd } from "./JsonLd";

const meta = {
  title: "Components/JsonLd",
  component: JsonLd,
} satisfies Meta<typeof JsonLd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Organization: Story = {
  args: {
    data: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "nextjs-boilerplate",
      url: "https://example.com",
    },
  },
};
