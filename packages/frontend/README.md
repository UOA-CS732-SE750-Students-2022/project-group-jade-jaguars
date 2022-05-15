# Frontend

NextJS frontend for CountMeIn. Depending on how you have setup your .env file for the project you can simply run the frontend to run the entire project and use the remotely hosted backend so that you don't have to worry about installing and setting up MongoDB.

## Fill out frontend environment files

```bash
cd packages/frontend
cp .env.template .env.local
# Then fill out .env.local with appropriate values
```

For more information on this please see the README in the [root of the repository](../../README.md)

## Running

1. Install the dependencies on the frontend

```bash
npm run install
```

2. Compile the frontend (optimized production build)

```bash
npm run install
```

## Development

1. Ensure that your environment file is setup to be using localhost connection to MongoDB for the backend application. For more information see the [backend README](../backend/RE)

If you are simply developing the application you are able to run the frontend using the NextJS CLI.

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Bootstrap

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
