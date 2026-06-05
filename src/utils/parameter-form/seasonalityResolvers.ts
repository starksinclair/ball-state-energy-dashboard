import type { BaseRequest } from "../../types/api";
import type {
  NpYearlySeasonalityUi,
  ProphetSeasonalityBoolUi,
} from "../../constants/neuralProphetFields";

export function resolveYearlySeasonality(
  ui: NpYearlySeasonalityUi,
  order: number,
): BaseRequest["yearly_seasonality"] {
  if (ui === "auto") return "auto";
  if (ui === "true") return true;
  if (ui === "false") return false;
  return order;
}

export function resolveProphetBoolSeasonality(
  ui: ProphetSeasonalityBoolUi,
  order: number,
): boolean | number {
  if (ui === "true") return true;
  if (ui === "false") return false;
  return order;
}

export function prophetSeasonalityBoolFromInitial(
  v: boolean | number | string | undefined,
): { ui: ProphetSeasonalityBoolUi; order: number } {
  if (v === true || v === "true") return { ui: "true", order: 10 };
  if (v === false || v === "false") return { ui: "false", order: 10 };
  if (typeof v === "number") return { ui: "custom", order: v };
  return { ui: "true", order: 10 };
}
