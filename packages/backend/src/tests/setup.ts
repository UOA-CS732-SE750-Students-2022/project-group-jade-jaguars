import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config({ path: `.env.${process.env.ENV_PATH}` });
let mongoServer, databaseURI;

before(async () => {
  console.log('hit before');
  mongoServer = await MongoMemoryServer.create();
  databaseURI = mongoServer.getUri() + 'tests';
  console.log(databaseURI);

  await mongoose.connect(databaseURI, {});
});

beforeEach(async () => {
  // The following is to make sure the database is clean before a test starts
  await mongoose.connection.db.dropDatabase();
});

afterEach(async () => {
  // The following is to make sure the database is clean before a test starts
  await mongoose.connection.db.dropDatabase();
});

after(async () => {
  await mongoServer.stop();
});
