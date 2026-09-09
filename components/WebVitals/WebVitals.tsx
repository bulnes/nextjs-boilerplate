"use client";

import { useReportWebVitals } from "next/web-vitals";

import { logger } from "@/lib/logger";

/**
 * Encaixe de exemplo para Core Web Vitals reais (RUM), não só o score
 * sintético do Lighthouse CI. Aqui só loga via lib/logger.ts (aparece no
 * console do navegador) para demonstrar o padrão — em produção, troque por
 * um envio real (ex.: navigator.sendBeacon para um endpoint/serviço de RUM),
 * já que este projeto não usa nenhum serviço externo por padrão (FR-032).
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    logger.info("web_vitals", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  });

  return null;
}
