/**
 * Storage abstraction. Uses Supabase Storage when configured; otherwise
 * falls back to reading the file as a data URI so uploads still work
 * end-to-end in the browser with zero backend configuration.
 */

export const isStorageConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export class UploadValidationError extends Error {}

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new UploadValidationError("Formato non supportato. Usa PNG, JPG o WebP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError("File troppo grande (max 8MB).");
  }
}

export async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Client-side upload entrypoint used by MapUploader/TokenCreator. Returns a
 * URL usable directly as an <img>/background-image src.
 */
export async function uploadImageClient(file: File, bucket: "maps" | "assets" = "assets"): Promise<string> {
  validateImageFile(file);
  if (!isStorageConfigured) {
    return fileToDataUri(file);
  }
  const body = new FormData();
  body.append("file", file);
  body.append("bucket", bucket);
  const res = await fetch("/api/assets/upload", { method: "POST", body });
  if (!res.ok) throw new Error("Upload fallito");
  const data = await res.json();
  return data.url as string;
}
