# Service App (Name Pending)

This repository contains the main project files used for the implementation of a digital platform for connecting service seekers with local service providers.

## Development

This project's dependencies are managed by [`pnpm`](https://pnpm.io/), a package manager for [Node.js](https://nodejs.org/).

```bash
# Install dependencies (for all workspaces)
pnpm install
```

### Running the Development Servers

This project is a monorepo containing several apps. The development servers of all applications may be run in parallel with the following command:

```bash
# Start local development servers for all apps
# - http://<host>:3000 - Server
# - http://<host>:3100 - Provider App
# - http://<host>:3200 - Seeker App
pnpm dev

# Starts a android development build for all apps
pnpm dev:android

# Starts a ios development build for all apps
pnpm dev:ios
```

### Linting & Formatting

Before pushing or submitting a pull request to the repository, ensure that it has passed all the code quality checks by linting and formatting it. This is done to ensure that the codebase remains clean and consistent.

```bash
# Check formatting
pnpm fmt

# Fix formatting
pnpm fmt:fix

# Checks linting
pnpm lint

# Fix linting (where possible)
pnpm lint:fix
```

### Database Management

This project uses [Drizzle ORM](https://orm.drizzle.team/) for managing its database. The files pertaining to managing the project's database are stored in the `database` package. Note that using this package requires the following environment variables (stored in a `.env` file at the package root).

| **Variable**   | **Description**                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | The connection string to the PostgreSQL instance (`postgres://<user>:<password>@<hostname>:<port>/<database>`). |

```bash
# Generate SQL migration files from schema
pnpm db:generate

# Apply generated SQL migration files to the Database
pnpm db:migrate

# Connect to the database with a GUI
pnpm db:studio
```
