import { z } from "zod";

const schema = z.object({
  VITE_API_URL: z.string().url(),
});

try {
  schema.parse(import.meta.env);
  console.log("✅ Frontend env validated successfully");
} catch (err) {
  console.error("❌ Frontend env validation failed:", err);
  process.exit(1);
}
