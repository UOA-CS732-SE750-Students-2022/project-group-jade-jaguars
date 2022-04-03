import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer, databaseURI;

beforeAll(async () => {
  jest.setTimeout(10000);

  mongoServer = await MongoMemoryServer.create();
  databaseURI = mongoServer.getUri() + 'tests';

  console.log(`started mongodb memory server at ${databaseURI}`);

  await mongoose.connect(databaseURI, {});
});

beforeEach(async () => {
  // The following is to make sure the database is clean before a test starts
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoServer.stop();
  console.log('stopped mongodb memory server');
});
