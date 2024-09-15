import { R2 } from "node-cloudflare-r2";
import "dotenv/config";

function getEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

const r2 = new R2({
  accountId: getEnv("R2_ACCOUNT_ID"),
  accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
  secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
});

export const bucket = r2.bucket(getEnv("R2_BUCKET_NAME"));
