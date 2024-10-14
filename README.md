# Touchcom Backend

Touchcom backend built on [Nest](https://github.com/nestjs/nest) framework with TypeScript.

## Pre-requisites to run the project

You will need `node` with `npm` installed.

Optionally you can install `docker` to easily create and manage local database.

Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install).

NOTE: When starting local development authenticate to GCP with `gcloud auth application-default login`. That will set **Application Default Credentials (ADC)** so it is not necessary to specify GC *project ID* or *key file*.
Make sure to **initialize gcloud CLI** with `gcloud init`.

### Installation

```bash
# Will install all dependencies
$ npm install   # or npm i
```

### Database

Update `.env` file with your **local connection string** or easily create local database using `docker` run:

```bash
# Will create local database inside docker using postgres image
$ npm run local:db:create
```

Operations on database:

```bash
# Pulls schemas from database
$ npm run prisma:introspect

# Create new migration with name
$ npm run prisma:migrate --name migration_name --create-only

# Create & apply new migration with name
$ npm run prisma:migrate --name migration_name

# ONLY FOR DEVELOPMENT ENVIRONMENT!
# Create new migration or apply existing migrations
$ npm run prisma:migrate

# Seed database
$ npm run prisma:seed
```

#### **In production environment**

```bash
# Resolve migration as applied if it shouldn't be run on existing database
$ prisma migrate resolve --applied migration_name
```

### Running the app

To run the project using `npm` execute following commands in the project directory:

```bash
# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

This will start Touchcom backend server and it will be available at <http://localhost:3000>.

Swagger documentation can be accessed at <http://localhost:3000/api>.

## Tests

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Debug tests
$ npm run test:debug

# Test coverage
$ npm run test:cov
```

### **Important**

Test files which include Prisma related code needs to have `// @ts-nocheck` at the beginning of the file because of the Prisma internal issue with circular dependency while using Typescript.

Read more about it **[here](https://www.prisma.io/docs/guides/testing/unit-testing#dependency-injection)**.

## Code formatting and linting

In order to format code by the `prettier` rules run:

```bash
# Will format all files inside "/test" and "/src"
$ npm run format

# Will check if prettier rules are satisfied for all files inside "/test" and "/src"
$ npm run prettier:check
```

In order to check code errors run `eslint` through:

```bash
# Will run linter on "/src", "/apps", "/libs", "/test"
$ npm run lint
```

## Build

```bash
# Create prebuilt binaries
$ npm run prebuild

# Compile BE into output folder
$ npm run build
```
