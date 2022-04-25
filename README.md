# CountMeIn

## Running

1. Install packages

```bash
npm install
```

2. Setup environment

```bash
cd packages/backend/
cp ./packages/backend/.env.development.template ./packages/backend/.env.development
cp ./packages/backend/.env.production.template ./packages/backend/.env.production
# Fill .env.development and .env.production with appropriate secrets
```

Download the firebase credentials from firebase console or request them from a developer and add a reference to it in your environment variables.

eg

`export GOOGLE_APPLICATION_CREDENTIALS="<PATH TO REPO>/packages/backend/src/firebase/firebase.credentials.json"`

1. Run application

```bash
npm run start
```
