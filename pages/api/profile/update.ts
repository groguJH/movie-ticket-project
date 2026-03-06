import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import updateEditProfileService from "../../../src/services/editProfile/updateEditProfileService";

// 회원 개인정보 수정 API핸들러입니다.
// 피드백전송페이지와는 무관합니다.
export default async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  const { email, password, name, phone, profileImage, agreeSms, agreeEmail } =
    req.body;

  if (!session || req.method !== "PUT") {
    return res
      .status(401)
      .json({ message: "세션, 메소드요청 문제로 인증 실패" });
  }
  try {
    const { id: userId, email, provider } = session.user!;

    // 소셜회원가입 유저
    if (provider === "kakao" || provider === "naver") {
      if (!profileImage) {
        return res.status(400).json({ message: "프로필 이미지는 필수입니다." });
      }

      await updateEditProfileService({
        userId,
        name: name || "", // 기존 이름 유지
        password: password || "", // 소셜 유저는 비밀번호 없음
        profileImage,
        agreeSms,
        agreeEmail,
        ...(phone && { phone }),
      });
      return res.status(200).json({ message: "개인정보 수정 성공" });
    }

    // 일반회원가입 유저
    if (!email && !password && !name) {
      return res.status(400).json({ message: "필수값이 누락되었습니다." });
    }
    await updateEditProfileService({
      newEmail: email,
      oldEmail: session.user?.email || "",
      name,
      password,
      profileImage,
      agreeSms,
      agreeEmail,
      ...(phone && { phone }),
    });
    return res.status(200).json({ message: "개인정보 수정 성공" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 에러로 개인정보 수정 실패" });
  }
}
