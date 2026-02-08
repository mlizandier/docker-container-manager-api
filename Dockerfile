FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package.json bun.lock .env ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port (Hono default is 3000)
EXPOSE 3000

# Run dev server with hot reloading
CMD ["bun", "run", "--hot", "src/index.ts"]
