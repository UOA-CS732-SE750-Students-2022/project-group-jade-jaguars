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

## Features:

CountMeIn is a application for managing when teams of people should meet. Manage multiple events with a dashboard to organise you life!

- Create users through Google authentication
- Create events that you can invite people to through a unique shareable URL
- Add your availability to an event, view other peoples availability in real time
- Generate a list of potential times that each team member can go to the the event at
- Finalise your event with one of the potential times, the eventis then added to your dashboard
- Alternatively export the event using an ical file and manually add it to a calander of your choice

## Setup

In order to run the application the project must first be set up with a valid environment file in the root of the project in order for the application to be able to launch. This file will be provided on submission as a zip file containing all the files that are needed. If you have any problem with setting up the project please feel free to message our team on discord using any of our [team member handles](##Contributors)

## Running

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

### Project

### Backend

The backend of the application is written with Express with MongoDB and a Mongoose database driver

### Frontend

Frontend requires a single environment file. You can skip manually setting each environment variable in the file by using the provided submission environment files.

```bash
cd packages/frontend/
cp .env.template .env.local
# Fill .env.local with appropriate secrets
```

## Running the frontend and backend together

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
