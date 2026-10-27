import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getImageKit } from "./imagekit";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "images.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// پێپەڕەکراوەکان: جۆرە پەسەندکراوەکان بۆ درێژکراوەی فایل
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

export function isSection(value: string): value is Section {
  return (SECTIONS as string[]).includes(value);
}

function sanitizeExtension(raw: string): string | null {
  const ext = raw.toLowerCase().replace(/[^\w]/g, "");
  return ALLOWED_EXTENSIONS.has(ext) ? ext : null;
}

export function getImageUrl(record: ImageRecord): string {
  if (record.url) return record.url;
  return `/uploads/${record.filename}`;
}

export async function listImages(): Promise<ImageRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ImageRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeImages(records: ImageRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function saveImage(
  section: Section,
  buffer: Buffer,
  rawExtension: string
): Promise<ImageRecord> {
  const ext = sanitizeExtension(rawExtension);
  if (!ext) {
    throw new Error("فایل پەسەند نییە: تەنها JPG، PNG، WEBP، AVIF و GIF قەبوڵ دەکرێن.");
  }

  const fileName = `${randomUUID()}.${ext}`;
  const imagekit = getImageKit();

  const uploadResult = await imagekit.upload({
    file: buffer,
    fileName,
    folder: "/dekorat-malik",
    useUniqueFileName: true,
  });

  const records = await listImages();
  const record: ImageRecord = {
    id: randomUUID(),
    section,
    filename: uploadResult.name || fileName,
    url: uploadResult.url,
    fileId: uploadResult.fileId,
    createdAt: new Date().toISOString(),
  };

  records.push(record);
  await writeImages(records);
  return record;
}

export async function deleteImage(id: string): Promise<boolean> {
  const records = await listImages();
  const target = records.find((r) => r.id === id);
  if (!target) return false;

  const remaining = records.filter((r) => r.id !== id);

  // 1. سڕینەوە لە ImageKit
  try {
    const imagekit = getImageKit();

    if (target.fileId) {
      // ئەگەر وێنەکە بە سیستەمی نوێ دانرابوو و fileId هەبوو
      await imagekit.deleteFile(target.fileId);
    } else {
      // ئەگەر وێنە کۆنەکان بوو کە fileIdیان لەگەڵدا پاشەکەوت نەکرابوو
      const searchName = target.filename;
      const baseName = searchName.substring(0, searchName.lastIndexOf(".")) || searchName;
      
      const foundFiles = await imagekit.listFiles({
        searchQuery: `name = "${searchName}" OR name LIKE "${baseName}%"`,
      });

      if (Array.isArray(foundFiles) && foundFiles.length > 0) {
        for (const file of foundFiles) {
          if ("fileId" in file && file.fileId) {
            await imagekit.deleteFile(file.fileId);
          }
        }
      }
    }
  } catch (err) {
    console.error("هەڵە لە کاتی سڕینەوە لە ImageKit:", err);
  }

  // 2. سڕینەوە لە فۆڵدەری ناوخۆیی (public/uploads) ئەگەر فایلەکە لەوێ بوو
  if (target.filename) {
    await fs
      .unlink(path.join(UPLOADS_DIR, target.filename))
      .catch(() => undefined);
  }

  await writeImages(remaining);
  return true;
}
