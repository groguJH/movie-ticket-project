import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import updateEditProfileService from "../../../src/services/editProfile/updateEditProfileService";

/**
 * 회원 개인정보 수정 API 핸들러
 * @param req
 * @param res
 * @returns
 */

export default async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ message: "세션, 메소드요청 문제로 인증 실패" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
  }

  const {
    newEmail,
    password,
    name,
    phone,
    profileImage,
    agreeSms,
    agreeEmail,
  } = req.body;

  try {
    const { id: userId, email: sessionEmail, provider } = session.user!;

    const updateData: any = { userId };

    if (name !== undefined) updateData.name = name;
    if (password !== undefined) updateData.password = password;
    if (phone !== undefined) updateData.phone = phone;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (agreeSms !== undefined) updateData.agreeSms = agreeSms;
    if (agreeEmail !== undefined) updateData.agreeEmail = agreeEmail;

    if (newEmail !== undefined && newEmail !== null) {
      if (!sessionEmail) {
        return res
          .status(400)
          .json({ message: "기존 세션 이메일을 찾을 수 없습니다." });
      }
      updateData.newEmail = newEmail;
      updateData.oldEmail = sessionEmail;
    }

    const hasUpdateContent = Object.keys(updateData).length > 1;

    if (!hasUpdateContent) {
      return res.status(400).json({ message: "수정할 정보가 없습니다." });
    }

    if (provider === "kakao" || provider === "naver") {
      if (!profileImage) {
        return res.status(400).json({ message: "프로필 이미지는 필수입니다." });
      }

      await updateEditProfileService(updateData);
      return res.status(200).json({ message: "개인정보 수정 성공" });
    }

    await updateEditProfileService(updateData);
    return res.status(200).json({ message: "개인정보 수정 성공" });
  } catch (err) {
    console.error("프로필 업데이트 실패했습니다.", err);
    return res.status(500).json({ message: "서버 에러로 개인정보 수정 실패" });
  }
}
