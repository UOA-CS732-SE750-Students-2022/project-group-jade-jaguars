# CountMeIn

<p align="center">
  <img src="./media/logo/melon.png" width="350" />
</p>

<p align="center">
  <a href="https://github.com/UOA-CS732-SE750-Students-2022/project-group-jade-jaguars/actions/workflows/pr-check.yml/badge.svg">
    <img alt="Build Status" src="https://github.com/UOA-CS732-SE750-Students-2022/project-group-jade-jaguars/actions/workflows/pr-check.yml/badge.svg">
  </a>
  <a href="https://img.shields.io/badge/License-GPLv3-blue.svg">
    <img alt="Licence" src="https://img.shields.io/badge/License-GPLv3-blue.svg">
  </a>
</p>

## Setup

In order to run the application the frontend and the backend must first be set up with valid environment files in order for the application to be able to launch. These files will be provided on submission as a zip file containing all the files that are needed. If you have any problem with setting up the project please feel free to message our team on discord using any of our [team member handles](##Contributors)

### Backend Setup

In order to setup the backend you must place the required environment and firebase files in the directory `packages/backend/`. A template has been provided if you want to fill out these files manually but this setup can be skipped by copying the environment files from the submission zip

```bash
cd packages/backend/
cp .env.template .env.dev
cp .env.template .env.prod
cp .env.template .env.test
# Fill .env.development and .env.production with appropriate secrets
```

Download the firebase credentials from firebase console or request them from a developer and add a reference to it in your environment variables. Ensure that when setting the `GOOGLE_APPLICATION_CREDENTIALS` that it is an absolute path to the location of the file.

eg

`export GOOGLE_APPLICATION_CREDENTIALS="<PATH TO REPO>/packages/backend/src/firebase/firebase.credentials.json"`

<!--

If you are a member of the development discord these firebase files can be found [here](https://discord.com/channels/948449593543245824/951328358954860584/971585518267682866). Additionally prefilled environment variables can be found [here](https://discord.com/channels/948449593543245824/951328358954860584/972786304272183336).

 -->

### Frontend Setup

Frontend requires a single environment file. You can skip manually setting each environment variable in the file by using the provided submission environment files.

```bash
cd packages/frontend/
cp .env.template .env.local
# Fill .env.local with appropriate secrets
```

## Running the frontend and backend together

This project has been set up as a monorepo via [Lerna](https://github.com/lerna/lerna). Commands run in the root will apply to all packages (frontend and backend)

1. [Setup environment files](##Setup)
1. Install packages

```bash
npm install
```

3. Run application

From the root of the project run

```bash
npm run start
```

This will start the frontend and backend together. By default the backend will start with production credentials, use `npm run start:dev` to run with development credentials

## Hosting

When you have the project running the following endpoints will be available in order to use the project. To use the application follow the frontend link

- Frontend: http://localhost:3001
- backend: http://localhost:3000

## Running unit tests

Run `npm test` in the project root to execute the unit tests via [Jest](https://jestjs.io).

## Wiki

The wiki can contains all meeting notes and major design decisions and rationale. The wiki can be found [here.](https://github.com/UOA-CS732-SE750-Students-2022/project-group-jade-jaguars/wiki).

## Contributors

- Andreas Knapp (wqsz7xn#9473)
- Danielle Print (Danielle#2475)
- Raina Song (Raina#1221)
- Etienne Naude (bread man#3227)
- Samuel Chen (Luffy#2613)
