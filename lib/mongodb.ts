import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = { family: 4, serverSelectionTimeoutMS: 10000 };

if (!uri) {
  throw new Error(
    "환경 변수 MONGODB_URI가 정의되지 않았습니다. .env.local 파일을 확인하세요.",
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise() {
  if (process.env.NODE_ENV === "development") {
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise as Promise<MongoClient>;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

const lazyClientPromise: Promise<MongoClient> = {
  then(onfulfilled, onrejected) {
    return getClientPromise().then(onfulfilled, onrejected);
  },
  catch(onrejected) {
    return getClientPromise().catch(onrejected);
  },
  finally(onfinally) {
    return getClientPromise().finally(onfinally);
  },
  [Symbol.toStringTag]: "Promise",
};

export default lazyClientPromise;
