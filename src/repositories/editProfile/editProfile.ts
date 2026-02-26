import bcrypt from "bcryptjs";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

interface UpdateUserData {
  filter: { email?: string; _id: ObjectId };
  name?: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  agreeSms?: boolean;
  agreeEmail?: boolean;
  email?: string;
}

/**
 *
 * 사용자 프로필 수정하는 레포지토리 함수
 * @param updateData
 * @returns updatedUser
 *
 */
export default async function editProfile(
  filter: { email?: string; _id?: ObjectId },
  updateData: UpdateUserData,
) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const collection = db.collection("users");

  try {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updateResult = await collection.updateOne(filter, {
      $set: updateData,
    });

    if (updateResult.matchedCount === 0) {
      throw new Error("업데이트할 사용자를 찾지 못했습니다.");
    }

    return await collection.findOne(filter);
  } catch (error) {
    console.error("=== 레포지토리 에러 ===", error);
    throw error;
  }
}
