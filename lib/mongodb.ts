import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
// dotenv는 .env.local 파일을 읽어 환경 변수를 설정하는 데 사용됩니다.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = { family: 4, serverSelectionTimeoutMS: 10000 }; // IPv4 우선 사용

if (!uri) {
  throw new Error(
    "환경 변수 MONGODB_URI가 정의되지 않았습니다. .env.local 파일을 확인하세요.",
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // 개발 환경에서는 클라이언트를 전역 변수로 저장하여 핫 리로드 시 재사용
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // 프로덕션에서는 새 클라이언트 생성
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
