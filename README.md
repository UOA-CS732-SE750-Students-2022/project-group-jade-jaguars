# CountMeIn

## Running

1. Install packages

```bash
npm install
```

2. Setup backend environment

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

If you are a member of the development discord these firebase files can be found [here](https://discord.com/channels/948449593543245824/951328358954860584/971585518267682866). Additionally prefilled environment variables can be found [here](https://discord.com/channels/948449593543245824/951328358954860584/972786304272183336).

3. Run application

From the root of the project run

```bash
npm run start
```

This will start the frontend and backend together. By default the backend will start with production credentials, use `npm run start:dev` to run with development credentials
