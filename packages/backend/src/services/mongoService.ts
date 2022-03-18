import { Db, MongoClient } from 'mongodb';
import { DATABASE } from '../config';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

let client: MongoClient | undefined = undefined;
let database: Db | undefined = undefined;

class MongoService {
  constructor() {
    this.connect();
  }

  /**
   * connect to mongoDB database
   * @returns {Promise<Db>}
   */
  async connect(): Promise<Db> {
    const url = process.env.DATABASE_URL;

    if (!client) {
      client = new MongoClient(url);
      await client.connect();
      database = client.db(DATABASE);
    }

    return database;
  }

  /**
   * closes connection to mongoDB database
   * @returns {void}
   */
  close(): void {
    client.close();
  }

  /**
   * insert one document into collection
   * @param {string} collectionName collection to insert the document
   * @param {object} document document to insert
   * @returns {Promise<void>}
   */
  async insertOne(collectionName: string, document: any): Promise<void> {
    const collection = await database.collection(collectionName);

    await collection.insertOne(document);

    //   TODO return specific errors
  }

  /**
   * updates a single document in collection
   * @param {string} collectionName collection to update the document
   * @param {any} filter filter to find document to update
   * @param {any} document new document updates
   * @returns {Promise<void>}
   */
  async updateOne(
    collectionName: string,
    filter: any,
    document: any,
  ): Promise<void> {
    const collection = await database.collection(collectionName);

    await collection.updateOne(filter, { $set: document });

    //   TODO return specific errors
  }

  /**
   * deletes a single document in collection
   * @param {string} collectionName collection to delete the document
   * @param {any} filter filter to find document to delete
   * @returns {Promise<void>}
   */
  async deleteOne(collectionName: string, filter: any): Promise<void> {
    const collection = await client.db(DATABASE).collection(collectionName);
    await collection.deleteOne(filter);
    //   TODO return specific errors
  }

  /**
   * find and returns a single document in collection
   * @param {string} collectionName collection to find the document
   * @param {any} filter filter to find document to return
   * @returns {Promise<any | null>}
   *
   */
  async findOne(collectionName: string, filter: any): Promise<any | null> {
    const collection = await database.collection(collectionName);

    const result = await collection.findOne(filter);

    return result;
    //   TODO return specific errors
  }

  // TODO implement other functions
  // export async function insertMany() {}
  // export async function updateMany() {}
  // export async function getOne() {}
  // export async function getMany() {}
  // export async function deleteMany() {}
}

export const mongoService = new MongoService();
