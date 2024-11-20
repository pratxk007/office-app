import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './configs/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:W4Ytj6nHpSAO@ep-bitter-butterfly-a5nu1ctk.us-east-2.aws.neon.tech/ai-shorts?sslmode=require",
  },
});
