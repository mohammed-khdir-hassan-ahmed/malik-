import { Gem, Landmark, PaintRoller } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Section } from "@/lib/images-types";

export const SECTION_ICONS: Record<Section, LucideIcon> = {
  moroccan: Landmark,
  astropol: Gem,
  painting: PaintRoller,
};
