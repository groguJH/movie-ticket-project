import { ObjectId } from "mongodb";
import editProfile from "../../repositories/editProfile/editProfile";

export interface updateEditProfileParams {
  userId?: string; // 소셜 유저 식별용
  oldEmail?: string | null; // 일반 유저 식별용
  newEmail?: string | null;
  name?: string;
  password: string;
  phone?: string;
  profileImage?: string;
  agreeSms?: boolean;
  agreeEmail?: boolean;
}

/**
 * 사용자 프로필 수정 서비스 함수
 * @description
 * - userId 또는 oldEmail을 사용하여 사용자를 식별
 * - email or id중 선택이며, email은 일반회원, id는 소셜로그인으로 식별합니다.
 */
export default async function updateEditProfileService({
  userId,
  oldEmail,
  newEmail,
  name,
  password,
  phone,
  profileImage,
  agreeSms,
  agreeEmail,
}: updateEditProfileParams) {
  const filter: any = {};
  if (oldEmail) {
    filter.email = oldEmail;
  } else if (userId) {
    filter._id = new ObjectId(userId);
  } else {
    throw new Error(
      "사용자를 식별할 수 없습니다. userId 또는 oldEmail이 필요합니다.",
    );
  }

  const updateData: any = {
    email: newEmail,
    name,
    ...(password && { password }),
    ...(phone && { phone }),
    ...(profileImage && { profileImage }),
    ...(agreeSms !== undefined && { agreeSms }),
    ...(agreeEmail !== undefined && { agreeEmail }),
  };

  if (newEmail) updateData.email = newEmail;
  const finalData = { ...updateData, filter };

  try {
    const result = await editProfile(finalData);

    return result;
  } catch (error) {
    console.error("=== editProfile 호출 실패 ===");
    console.error("에러:", error);
    throw error;
  }
}
