import { env } from "node:process";

export const envVars = {
  R2_ACCOUNT_ID: env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: env.R2_BUCKET_NAME,

  D1_NAME: env.D1_NAME,
  D1_ID: env.D1_ID,
  D1_TOKEN: env.D1_TOKEN,
};
