import { MongoClient } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

dotenv.config();

const setup = async () => {
  let client;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const hasFlashcardData = await client
      .db('cards')
      .collection('cards')
      .countDocuments();

    if (hasFlashcardData) {
      console.log('Flashcard atabase already exists with data');
      client.close();
      return;
    }

    const records = [...Array(10)].map(() => {
      const question = faker.lorem.sentence();
      const answer = faker.lorem.sentence();
      const category = faker.lorem.word();

      return {
        question,
        answer,
        category
      };
    });

    const insert = await client
      .db('cards')
      .collection('cards')
      .insertMany(records);

    if (insert.acknowledged) {
      console.log('Successfully inserted records');
    }
  } catch (error) {
    return 'Database is not ready yet';
  } finally {
    if (client) {
      await client.close();
    }
  }
};

try {
  setup();
} catch {
  console.warn('Database is not ready yet. Skipping seeding...');
}

export { setup };
