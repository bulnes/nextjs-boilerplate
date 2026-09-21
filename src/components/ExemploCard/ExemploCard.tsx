import type { ReactNode } from "react";

export interface ExemploCardProps {
  children?: ReactNode;
}

export function ExemploCard({ children }: ExemploCardProps) {
  return <div>{children}</div>;
}
