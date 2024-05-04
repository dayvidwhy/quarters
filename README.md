# Quarters
Home management system.

## Installation
```bash
git clone https://github.com/dayvidwhy/quarters.git
cd quarters
npm install
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
```