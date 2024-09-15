import { R2 } from "node-cloudflare-r2";
import { envVars } from "./env-vars";

const r2 = new R2({
  accountId: envVars.R2_ACCOUNT_ID!,
  accessKeyId: envVars.R2_ACCESS_KEY_ID!,
  secretAccessKey: envVars.R2_SECRET_ACCESS_KEY!,
});

export const bucket = r2.bucket(envVars.R2_BUCKET_NAME!);
