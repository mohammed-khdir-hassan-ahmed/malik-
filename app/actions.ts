"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { deleteImage, isSection, saveImage } from "@/lib/images";
import {
  checkLogin,
  endSession,
  isAdmin,
  startSession,
} from "@/lib/session";

export type LoginState = { error?: string };

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (checkLogin(email, password)) {
    await startSession();
    redirect("/dashboard");
  }

  return { error: "ئیمەیڵ یان وشەی نهێنی ڕەستە نییە، دووبارە هەوڵبدە." };
}


export type UploadState = { ok: boolean; error?: string };

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export async function uploadImage(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  if (!(await isAdmin())) {
    return {
      ok: false,
      error: "دەسەڵاتت نییە. تکایە سەرەتا بچۆ ژوورەوە.",
    };
  }

  const section = String(formData.get("section") ?? "");
  if (!isSection(section)) {
    return { ok: false, error: "بەشەکە هەڵبژێردراو نییە." };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "تکایە وێنەیەک هەڵبژێرە." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "قەبارەی وێنە لە 8MB زیاترە." };
  }

  const extension = file.name.split(".").pop() ?? "";
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await saveImage(section, buffer, extension);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "بارکردنی وێنەکە سەرکەوتوو نەبوو.";
    return { ok: false, error: message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function removeImage(formData: FormData): Promise<void> {
  if (!(await isAdmin())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteImage(id);
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
  revalidatePath("/dashboard");
}
