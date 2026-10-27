export type Section = "moroccan" | "astropol";

export const SECTIONS: Section[] = ["moroccan", "astropol"];

export const SECTION_LABELS: Record<Section, string> = {
  moroccan: "بەشی مەغریبی",
  astropol: "بەشی ئەسترۆپۆڵ",
};

export interface ImageRecord {
  id: string;
  section: Section;
  filename: string;
  createdAt: string;
  url?: string;
  fileId?: string;
}

export function isSection(value: string): value is Section {
  return (SECTIONS as string[]).includes(value);
}

export function getImageUrl(record: ImageRecord): string {
  if (record.url) return record.url;
  return `/uploads/${record.filename}`;
}
