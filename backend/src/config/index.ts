export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'skillbridge-ai-jwt-secret-dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/skillbridge',
  },
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gpt-4',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
