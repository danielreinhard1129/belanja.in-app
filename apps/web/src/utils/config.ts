import { config } from "dotenv";
import { resolve } from "path";

export const NODE_ENV = process.env.NODE_ENV || "development";

const envFile = NODE_ENV === "development" ? ".env.development" : ".env";

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file
export const clientId = process.env.GOOGLE_CLIENT_ID as string;
export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
export const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
export const MIDTRANS_PUBLIC_CLIENT = process.env.MIDTRANS_PUBLIC_CLIENT;
export const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export const appConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
  baseUrlNext: "http://localhost:3000",
};
