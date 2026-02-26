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
  if (req.method !== "PUT") {
    return res
      .status(401)
      .json({ message: "세션, 메소드요청 문제로 인증 실패" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
  }

  const { email, password, name, phone, profileImage, agreeSms, agreeEmail } =
    req.body;

  try {
    const { id: userId, email, provider } = session.user!;

    if (provider === "kakao" || provider === "naver") {
      if (!profileImage) {
        return res.status(400).json({ message: "프로필 이미지는 필수입니다." });
      }

      await updateEditProfileService({
        userId,
        name: name || "",
        password: password || "",
        profileImage,
        agreeSms,
        agreeEmail,
        ...(phone && { phone }),
      });
      return res.status(200).json({ message: "개인정보 수정 성공" });
    }

    if (!email && !password && !name) {
      return res.status(400).json({ message: "필수값이 누락되었습니다." });
    }
    await updateEditProfileService({
      userId,
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
    console.error("프로필 업데이트 실패했습니다.", err);
    return res.status(500).json({ message: "서버 에러로 개인정보 수정 실패" });
  }
}
