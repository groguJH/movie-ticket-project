import { ObjectId } from "mongodb";
import editProfile from "../../repositories/editProfile/editProfile";

export interface updateEditProfileParams {
  userId?: string;
  oldEmail?: string | null;
  newEmail?: string | null;
  name?: string;
  password?: string;
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
  ...rest
}: updateEditProfileParams) {
  const filter: any = {};

  if (userId) filter._id = new ObjectId(userId);
  else if (oldEmail) filter.email = oldEmail;
  else throw new Error("사용자를 식별할 수 없습니다.");

  const updateData: any = {
    ...(rest.name !== undefined && { name: rest.name }),
    ...(rest.newEmail !== undefined && { email: rest.newEmail }),
    ...(rest.password !== undefined && { password: rest.password }),
    ...(rest.phone !== undefined && { phone: rest.phone }),
    ...(rest.profileImage !== undefined && { profileImage: rest.profileImage }),
    ...(rest.agreeSms !== undefined && { agreeSms: rest.agreeSms }),
    ...(rest.agreeEmail !== undefined && { agreeEmail: rest.agreeEmail }),
  };

  try {
    const result = await editProfile(filter, updateData);
    return result;
  } catch (error) {
    console.error("=== 서비스 에러 ===", error);
    throw error;
  }
}
