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

## Storage
Uses PostgresSQL with DrizzleORM.

Inspect the database with Drizzle kit studio
```bash
npx drizzle-kit studio
```
