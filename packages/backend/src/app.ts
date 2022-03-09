import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const url = process.env.DATABASE_URL;
  const client = new MongoClient(url);
  await client.connect();
  res.send('connected successfully to db server');
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
