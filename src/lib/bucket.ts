import { R2 } from "node-cloudflare-r2";

const r2 = new R2({
  accountId: process.env.R2_ACCOUNT_ID!,
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
});

export const bucket = r2.bucket(process.env.R2_BUCKET_NAME!);
