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
export default async function editProfile(updateData: UpdateUserData) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const collection = db.collection("users");

  try {
    const existingUser = await collection.findOne(updateData.filter);

    if (!existingUser) {
      console.error("=== 기존 사용자 없음 ===", updateData.filter);
      throw new Error(
        `사용자를 찾을 수 없습니다: ${JSON.stringify(updateData.filter)}`,
      );
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      updateData.password = hashedPassword;
    }

    const updateResult = await collection.updateOne(updateData.filter, {
      $set: updateData,
    });

    if (updateResult.matchedCount === 0) {
      throw new Error("업데이트할 사용자를 찾을 수 없습니다.");
    }

    const updatedUser = await collection.findOne(updateData.filter);

    return updatedUser;
  } catch (error) {
    console.error("=== 리포지토리 에러 ===");
    console.error("에러 상세:", error);
    throw error;
  }
}
