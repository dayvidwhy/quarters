# Quarters
Home management system.

## Installation
```bash
git clone https://github.com/dayvidwhy/quarters.git
cd quarters
npm install
```

## Getting Started
Development is provided via containers to orchestrate the environment.

```bash
docker-compose up --build
```

## Notes
Project leverages [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) for monorepo management.

Example of installing package into a service in quarters.
```bash
npm install axios -w ./services/[service-name]
```

Example of installing a package in this repo into another.
```bash
npm install @quarters/[package] -w ./services/[service-name]
# e.g.
npm install ./packages/reload -w ./services/register
```

## Database
Project is using SQLite via `better-sqlite3` interacted with via Drizzle as the adapter.

Some useful commands:
```bash
# Generate the database
npx drizzle-kit generate:pg

# Push changes to the database
npx drizzle-kit push:pg

# Inspect the database with Drizzle kit studio
npx drizzle-kit studio

# If you're starting fresh, run generate and push to get going
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```
