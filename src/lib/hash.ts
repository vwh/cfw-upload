import { createHash } from "node:crypto";

export function shortBase64Hash(input: string): string {
  const hash = createHash("md5").update(input).digest("base64");
  return hash.replace(/[+/=]/g, "").substring(0, 12);
}
