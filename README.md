# Quarters

Home management system using Node.js microservices in a single monorepo. Authentication is provided via JWT tokens and communication between services occurs via Kafka topics.

![GitHub last commit](https://img.shields.io/github/last-commit/dayvidwhy/quarters)
![GitHub issues](https://img.shields.io/github/issues/dayvidwhy/quarters)
![GitHub pull requests](https://img.shields.io/github/issues-pr/dayvidwhy/quarters)
![GitHub](https://img.shields.io/github/license/dayvidwhy/quarters)

## Installation
Get started by cloning the repository and starting the containers.
```bash
git clone https://github.com/dayvidwhy/quarters.git
cd quarters
docker-compose up --build
```

Let docker-compose bring up the containers ahead of running `npm install` as this ensures it will grab linux compatible `bcrypt` files.

After the containers come up, install local dependencies.

```bash
npm install
```

You then need to run the migrations within the container.

```bash
docker exec -it user-service bash
cd services/user
npx drizzle-kit push:pg
# Accept the prompt
```

You can now start making calls to the `user` service and register an account.

## Development
Development is provided via containers to orchestrate the environment.

```bash
docker-compose up --build
```

## Microservice monorepo
Project leverages [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) for monorepo management. Each package under `./services` is a separate Node.js application. The `Dockerfile` in the root of the project is customised per service.

The monorepo is copied and installed into each running service, and then the single service corresponding to that container is started.

You can install additional packages directly into each service using the following commands from the root of the project.

Example of installing package into a service in quarters.

```bash
npm install axios -w ./services/[service-name]
# e.g
npm install axios -w ./services/user
```

Example of installing a package in this repo, into another local package, e.g. a service.

```bash
npm install ./packages/[package] -w ./services/[service-name]
# e.g.
npm install ./packages/reload -w ./services/register
```

## Database
Project is using PostgresSQL via `pg` interacted with via Drizzle as the adapter.

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

Migrations are currently kept in each services project folder. When starting up the project for the first time you'll need to run the migration.

```bash
# Execute the user migration
docker-compose up --build # ensure project is running

docker exec -it user-service bash

# Navigate to user service
cd services/user
npx drizzle-kit push:pg

# Accept the prompt to push the migration
```
