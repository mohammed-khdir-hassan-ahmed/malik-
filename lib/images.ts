import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getImageKit } from "./imagekit";

export * from "./images-types";
import { type ImageRecord, type Section, SECTIONS } from "./images-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "images.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// پێپەڕەکراوەکان: جۆرە پەسەندکراوەکان بۆ درێژکراوەی فایل
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

function sanitizeExtension(raw: string): string | null {
  const ext = raw.toLowerCase().replace(/[^\w]/g, "");
  return ALLOWED_EXTENSIONS.has(ext) ? ext : null;
}

export async function listImages(): Promise<ImageRecord[]> {
  // 1. هەوڵدەدەین ڕاستەوخۆ لە ImageKit وێنەکان بهێنینەوە (بۆ ئەوەی لەسەر ڤێرسڵیش بەردەوام نوێ بێت و کاربکات)
  try {
    const imagekit = getImageKit();
    const files = await imagekit.listFiles({
      path: "/dekorat-malik",
      sort: "DESC_CREATED",
      limit: 1000,
    });

    if (Array.isArray(files) && files.length > 0) {
      const records: ImageRecord[] = [];

      for (const file of files) {
        if ("fileId" in file && "url" in file) {
          let section: Section = "moroccan";
          const tags = Array.isArray(file.tags) ? file.tags : [];
          if (tags.includes("astropol")) {
            section = "astropol";
          } else if (tags.includes("moroccan")) {
            section = "moroccan";
          }

          records.push({
            id: file.fileId,
            section,
            filename: file.name,
            url: file.url,
            fileId: file.fileId,
            createdAt: file.createdAt,
          });
        }
      }

      if (records.length > 0) {
        return records;
      }
    }
  } catch (err) {
    console.warn("نەتوانرا لە ImageKit وێنەکان بهێنرێن، پەنا دەبەینە بەر data/images.json:", err);
  }

  // 2. ئەگەر ImageKit بەردەست نەبوو یان کێشەی هەبوو، فایلی data/images.json دەخوێنینەوە
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ImageRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeImages(records: ImageRecord[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(records, null, 2), "utf8");
  } catch (err) {
    console.warn("ئاگاداری: نووسین لەسەر فایل ئەنجام نەدرا (ئاساییە لە ژینگەی سێرڤەرلێسی ڤێرسڵ):", err);
  }
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
    tags: [section],
    useUniqueFileName: true,
  });

  const record: ImageRecord = {
    id: uploadResult.fileId || randomUUID(),
    section,
    filename: uploadResult.name || fileName,
    url: uploadResult.url,
    fileId: uploadResult.fileId,
    createdAt: new Date().toISOString(),
  };

  // هەوڵدان بۆ نوێکردنەوەی data/images.json بۆ کاتی لۆکاڵ و بەکەپ
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ImageRecord[];
    if (Array.isArray(parsed)) {
      parsed.unshift(record);
      await writeImages(parsed);
    }
  } catch {
    // پەسەندکردنی بێدەنگ لە سێرڤەری ڤێرسڵ
  }

  return record;
}

export async function deleteImage(id: string): Promise<boolean> {
  let deleted = false;

  // 1. سڕینەوە لە ImageKit
  try {
    const imagekit = getImageKit();
    let targetFileId = id;

    // دۆزینەوەی فایلەکە
    const records = await listImages();
    const target = records.find((r) => r.id === id || r.fileId === id);
    if (target?.fileId) {
      targetFileId = target.fileId;
    }

    if (targetFileId) {
      await imagekit.deleteFile(targetFileId);
      deleted = true;
    }
  } catch (err) {
    console.error("هەڵە لە کاتی سڕینەوە لە ImageKit:", err);
  }

  // 2. سڕینەوە لە فۆڵدەری ناوخۆیی (ئەگەر لەسەر کۆمپیوتەر بوو)
  try {
    const records = await listImages();
    const target = records.find((r) => r.id === id || r.fileId === id);
    if (target?.filename) {
      await fs
        .unlink(path.join(UPLOADS_DIR, target.filename))
        .catch(() => undefined);
    }
  } catch {
    // بێدەنگ
  }

  // 3. نوێکردنەوە لە data/images.json ئەگەر نووسین بەردەست بێت
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ImageRecord[];
    const remaining = parsed.filter((r) => r.id !== id && r.fileId !== id);
    await writeImages(remaining);
  } catch {
    // بێدەنگ
  }

  return deleted;
}
