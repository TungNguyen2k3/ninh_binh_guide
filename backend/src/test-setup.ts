// Set required env vars for tests before any module imports
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.JWT_SECRET = 'test-secret-key-minimum-32-characters-ok'
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-minimum-32-chars'
process.env.CORS_ORIGIN = 'http://localhost:3000'
process.env.NODE_ENV = 'test'
