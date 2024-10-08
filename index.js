import { MongoClient } from 'mongodb'
import 'dotenv/config'
import {createHash} from 'node:crypto';

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'dbTest';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('colTest6');

  let arr = new Array();

  for(let i = 0; i < 10000000; i++) {
    const obj = {};
    obj.i = i;
    obj.a = Math.random();
    obj.b = createHash('sha256').update("" + i).digest('base64');

    arr[i] = collection.insertOne(obj);

    if(i % 1000 == 0) {
      console.log(`${new Date()} i = ${i}`);
      console.log('obj = ' + JSON.stringify(obj));
    }

    if(i % 10000 == 0) {
      await Promise.all(arr);
      arr = [];
    }
  }

  await Promise.all(arr);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
