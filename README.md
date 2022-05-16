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
  <a href="https://lerna.js.org/">
    <img alt="Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg">
  </a>
</p>

## Features:

CountMeIn is a application for managing when teams of people should meet. Manage multiple events with a dashboard to organise you life:

- Create users through Google authentication
- Create events that you can invite people to through a unique shareable code
- Add your availability to an event, view other peoples availability in real time
- Generate a list of potential times during which team members can go to the event
- Finalise your event with one of the potential times, the event is then added to your dashboard
- Alternatively export the event using a .ical file and manually add it to a calendar of your choice

## Live Version
If you would like to visit a live version of the application please visit
- Frontend: **https://countmein750.netlify.app/**
- Backend: **https://countmein.etinaude.dev/**

## Setup

In order to run the application the project must first be set up with valid environment files in each the frontend and the backend in order for the application to be able to launch. These files will be provided on submission as a zip file containing all the files that are needed. If you have any problem with setting up the project please feel free to message our team on discord using any of our [team member handles](#contributors)

## Running Project

This project has been set up as a monorepo via [Lerna](https://github.com/lerna/lerna). Commands run in the root will apply to all packages (frontend and backend)

1. Setup environment files for both the frontend and the backend using the information in this README. You can find information on setting up the environment files in each of the Environment Files sections below for [Backend](#backend) and [Frontend](#frontend) respectively

2. Install packages

```bash
npm install
```

3. Build the application

```bash
npm run build
```

This will create a `dist` output in the backend and a will compile to various parts of the `.next` folder within the frontend. For more information about NextJS compiling please see [this](https://nextjs.org/docs/deployment)

4. Run application

```bash
npm run start
```

### Backend

The backend of the application is written with Express with MongoDB and a Mongoose database driver

#### Environment files

Environment files have been included as a zip in the submission. Take all files that are in the provided backend folder of the environment file submission zip and extract them to the root of `packages/backend/`

Alternatively you can manually fill out the environment files with your own details by copying the template environment file

```bash
cd packages/backend/
cp .env.template .env
# Fill out with your own details
```

**Please ensure that `GOOGLE_APPLICATION_CREDENTIALS` is set the the absolute path of the file `prod.firebase.creds.json` on your local machine, this is the only field in the backend environment file that you have to manually set**

#### Running

In order to run the backend independently run these commands after navigating to the backend project (`packages/backend`). Please see the top of the file to run the entire project.

1. Ensure that the environment files for backend are setup using the instructions above

2. Install the dependencies

```bash
npm install
```

3. Create a production build

```bash
npm run build
```

4. Start the backend

```bash
npm run start
```

If you have configured the backend environment correctly the backend should launch at `http://localhost:3000/api/v1`

### Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

#### Environment files

Frontend requires a single environment file. You can skip manually setting each environment variable in the file by using the provided submission environment files. Otherwise to setup the environment file manually:

```bash
cd packages/frontend/
cp .env.template .env.local
# Fill .env.local with appropriate secrets
```

#### Running

In order to run the frontend independently run these commands after navigating to the frontend project at (`packages/frontend`). Please see the top of the file to run the entire project!

1. Ensure that the environment files for frontend are setup using the instructions above
2. Install the dependencies

```bash
npm install
```

3. Create a production build

```bash
npm run build
```

4. Start the frontend

```bash
npm run start
```

If you have configured the frontend environment correctly the backend should launch at `http://localhost:3001`, you should be able to visit this link in your web-browser of choice

## Tests

Run `npm test` in the project root to execute the unit tests via [Jest](https://jestjs.io).

## Wiki

The wiki can contains all meeting notes and major design decisions, rationale and project management information. The wiki can be found [here](https://github.com/UOA-CS732-SE750-Students-2022/project-group-jade-jaguars/wiki).

## Contributors

- Andreas Knapp (wqsz7xn#9473)
- Danielle Print (Danielle#2475)
- Raina Song (Raina#1221)
- Etienne Naude (bread man#3227)
- Samuel Chen (Luffy#2613)
