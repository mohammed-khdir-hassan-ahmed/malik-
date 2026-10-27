import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";
import { getImageKit } from "./imagekit";

export * from "./images-types";
import { type ImageRecord, type Section } from "./images-types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "images.json");
const TMP_BACKUP_FILE = path.join(os.tmpdir(), "dekorat_malik_images.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// پاشەکەوتکردنی کاتی لە یادگە (Memory Cache) بۆ چارەسەرکردنی دواکەوتنی ئیندێکسی ImageKit
// کاتێک وێنەیەک زیاد دەکرێت یان دەسڕدرێتەوە، ImageKit تا چەند چرکەیەک لە listFiles نیشانی نادات
type GlobalImagesState = {
  __recentAddedImages?: Map<string, { record: ImageRecord; timestamp: number }>;
  __recentDeletedImageIds?: Map<string, number>;
};

const gState = globalThis as unknown as GlobalImagesState;
if (!gState.__recentAddedImages) {
  gState.__recentAddedImages = new Map();
}
if (!gState.__recentDeletedImageIds) {
  gState.__recentDeletedImageIds = new Map();
}

// پێپەڕەکراوەکان: جۆرە پەسەندکراوەکان بۆ درێژکراوەی فایل
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "avif", "gif"]);

function sanitizeExtension(raw: string): string | null {
  const ext = raw.toLowerCase().replace(/[^\w]/g, "");
  return ALLOWED_EXTENSIONS.has(ext) ? ext : null;
}

async function readBackupRecords(): Promise<ImageRecord[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}

  try {
    const raw = await fs.readFile(TMP_BACKUP_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}

  return [];
}

async function writeBackupRecords(records: ImageRecord[]): Promise<void> {
  const json = JSON.stringify(records, null, 2);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, json, "utf8");
  } catch {
    // بێدەنگ لە سێرڤەرلێسی Vercel
  }
  try {
    await fs.writeFile(TMP_BACKUP_FILE, json, "utf8");
  } catch {
    // بێدەنگ
  }
}

export async function listImages(): Promise<ImageRecord[]> {
  let records: ImageRecord[] = [];

  // 1. هێنانی وێنەکان لە ImageKit
  try {
    const imagekit = getImageKit();
    const files = await imagekit.listFiles({
      path: "/dekorat-malik",
      sort: "DESC_CREATED",
      limit: 1000,
    });

    if (Array.isArray(files) && files.length > 0) {
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
    }
  } catch (err) {
    console.warn("نەتوانرا لە ImageKit وێنەکان بهێنرێن، پەنا دەبەینە بەر فایلی بەکەپ:", err);
  }

  // ئەگەر ImageKit بەردەست نەبوو یان وێنەی نەگەڕاندەوە، فایلی بەکەپ دەخوێنینەوە
  if (records.length === 0) {
    records = await readBackupRecords();
  }

  const now = Date.now();
  const TEN_MINUTES = 10 * 60 * 1000;

  // 2. فلتەرکردنی وێنە سڕاوەکان کە لەم دواییانەدا سڕدراونەتەوە (بۆ ئەوەی یەکسەر ون ببن پێش ئەوەی ImageKit ئیندێکسی بکات)
  const deletedMap = gState.__recentDeletedImageIds ?? new Map();
  if (deletedMap.size > 0) {
    records = records.filter((r) => {
      const delTime = deletedMap.get(r.id) ?? (r.fileId ? deletedMap.get(r.fileId) : undefined);
      if (delTime !== undefined) {
        // ئەگەر لە ماوەی 10 خولەکی پێشوودا سڕدرابێتەوە، لایببە
        if (now - delTime < TEN_MINUTES) {
          return false;
        } else {
          // ئەگەر کۆن بوو لە لیستەکە دەریدەکەین
          deletedMap.delete(r.id);
          if (r.fileId) deletedMap.delete(r.fileId);
        }
      }
      return true;
    });
  }

  // 3. زیادکردنی وێنە تازەکان کە لەم دواییانەدا زیادکراون بەڵام ImageKit هێشتا نەیخستۆتە listFiles
  const addedMap = gState.__recentAddedImages ?? new Map();
  if (addedMap.size > 0) {
    for (const [key, item] of addedMap.entries()) {
      // ئەگەر کۆن بوو
      if (now - item.timestamp > TEN_MINUTES) {
        addedMap.delete(key);
        continue;
      }

      // ئەگەر سڕدراوەتەوە لەم نێوەندەدا
      if (deletedMap.has(item.record.id) || (item.record.fileId && deletedMap.has(item.record.fileId))) {
        addedMap.delete(key);
        continue;
      }

      // ئەگەر لە لیستی هێنراوەکاندا هەیە (کەواتە ImageKit چەسپاندوویەتی)
      const exists = records.some(
        (r) => r.id === item.record.id || (item.record.fileId && r.fileId === item.record.fileId)
      );

      if (exists) {
        addedMap.delete(key);
      } else {
        // ئەگەر هێشتا لە لیستی ImageKit دا دەرنەکەوتووە، دەستبەجێ بیخە سەرەتای لیستەکە
        records.unshift(item.record);
      }
    }
  }

  // نوێکردنەوەی بەکەپ
  await writeBackupRecords(records);

  return records;
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

  const now = Date.now();

  // دەستبەجێ تۆمارکردن لە لیستی یادگە (Memory) بۆ ئەوەی بێ چاوەڕوانی دەربکەوێت
  gState.__recentAddedImages?.set(record.id, { record, timestamp: now });
  if (record.fileId) {
    gState.__recentAddedImages?.set(record.fileId, { record, timestamp: now });
    gState.__recentDeletedImageIds?.delete(record.fileId);
  }
  gState.__recentDeletedImageIds?.delete(record.id);

  // هەروەها نوێکردنەوەی بەکەپی ناوخۆیی
  try {
    const current = await readBackupRecords();
    current.unshift(record);
    await writeBackupRecords(current);
  } catch {
    // بێدەنگ
  }

  return record;
}

export async function deleteImage(id: string): Promise<boolean> {
  const now = Date.now();

  // دەستبەجێ تۆمارکردنی لە لیستی سڕاوەکان لە یادگە بۆ ئەوەی ڕاستەوخۆ لە پەڕەکە لابرێت
  gState.__recentDeletedImageIds?.set(id, now);
  gState.__recentAddedImages?.delete(id);

  let targetFileId = id;
  let targetFilename: string | undefined;

  // دۆزینەوەی لە لیستی بەکەپ یان لە ئەنجامەکان
  try {
    const current = await readBackupRecords();
    const target = current.find((r) => r.id === id || r.fileId === id);
    if (target) {
      if (target.fileId) {
        targetFileId = target.fileId;
        gState.__recentDeletedImageIds?.set(target.fileId, now);
        gState.__recentAddedImages?.delete(target.fileId);
      }
      targetFilename = target.filename;
    }

    // لادان لە بەکەپ
    const remaining = current.filter(
      (r) => r.id !== id && r.fileId !== id && r.id !== targetFileId && r.fileId !== targetFileId
    );
    await writeBackupRecords(remaining);
  } catch {
    // بێدەنگ
  }

  let deleted = false;

  // سڕینەوە لە ImageKit
  try {
    const imagekit = getImageKit();
    if (targetFileId) {
      await imagekit.deleteFile(targetFileId);
      deleted = true;
    }
  } catch (err) {
    console.error("هەڵە لە کاتی سڕینەوە لە ImageKit:", err);
  }

  // سڕینەوە لە فۆڵدەری ناوخۆیی (ئەگەر لەسەر کۆمپیوتەر بوو)
  if (targetFilename) {
    try {
      await fs.unlink(path.join(UPLOADS_DIR, targetFilename)).catch(() => undefined);
    } catch {
      // بێدەنگ
    }
  }

  return deleted;
}
