import { envSchema } from "./env-schema";

export const env = envSchema.parse(import.meta.env);
