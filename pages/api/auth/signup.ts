import type { NextApiRequest, NextApiResponse } from "next";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

/**
 * 회원가입 API 핸들러
 * 환경변수로부터 MongoDB Atlas 연결 URI를 가져옵니다.
 * @param req
 * @param res
 * @description
 *  - Method: POST
 *  - Body: { email: string;
 *            password: string;
 *            name: string;
 *            phone?: string }
 * - Response: { message: string; result?: any }
 * @throws 400 - 필수 필드 누락
 * @throws 500 - 서버 에러
 */
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI 환경변수를 설정하세요!");
}
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global.mongoClientPromise) {
    client = new MongoClient(uri, options);
    global.mongoClientPromise = client.connect();
  }
  clientPromise = global.mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("mymovieticket");
      const collection = db.collection("users");

      const { email, password, name, phone } = req.body;

      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ error: "필수 필드를 모두 입력해주세요." });
      }

      const preEmail = await collection.findOne({ email });

      if (preEmail) {
        return res.status(409).json({ error: "이미 가입된 이메일입니다." });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        createdAt: new Date(),
        role: "user",
      };

      const result = await collection.insertOne(newUser);

      res
        .status(201)
        .json({ message: "회원가입이 성공적으로 완료되었습니다.", result });
    } catch (error) {
      console.error("회원가입 API 에러:", error);
      res.status(500).json({ error: "서버 에러로 회원가입에 실패했습니다." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json(`Method ${req.method} Not Allowed`);
  }
}
