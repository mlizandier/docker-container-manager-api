## Getting Started

### Prerequisites

- Docker and Docker Compose
- Make

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_SECRET_KEY=your-supabase-secret-key
```

### Running the Application

First time setup (build and start):

```sh
make build
make start
```

Or rebuild and start:

```sh
make rebuild
```

Start the development server (if already built):

```sh
make start
```

View logs:

```sh
make logs
```

Stop the containers:

```sh
make down
```

### Available Make Commands

Run `make help` to see all available commands:

- `make start` - Start stopped containers
- `make build` - Build the Docker image
- `make rebuild` - Rebuild and restart containers
- `make up` - Start the containers
- `make down` - Stop and remove containers
- `make logs` - View container logs
- `make restart` - Restart the containers
- `make shell` - Open a shell in the running container
- `make clean` - Stop containers and remove volumes

### Accessing the API

Once running, the API will be available at:

- http://localhost:3000

All API routes require authentication via `X-API-Key` header or `api_key` query parameter.
