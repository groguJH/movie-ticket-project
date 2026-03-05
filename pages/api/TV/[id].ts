
import type { NextApiRequest, NextApiResponse } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

export default async function fetchTvDetail(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(400).json({ error: "허용되지 않은 메서드입니다." });
    }

    const { id, includeCredits } = req.query;
    if (!id) {
      return res.status(400).json({ error: "TV 프로그램 ID가 필요합니다." });
    }

    const tvRes = await fetch(
      `${API_URL}tv/${id}?api_key=${API_SECRET_KEY}&language=ko-KR`
    );

    if (!tvRes.ok) {
      return res
        .status(500)
        .json({ error: "TV 프로그램 정보를 가져오는데 실패했습니다." });
    }
    const tvData = await tvRes.json();

    const tvWithTypeData = {
      ...tvData,
      mediaType: "on_air_show" as const,
    };

    if (includeCredits === "true") {
      const creditsRes = await fetch(
        `${API_URL}tv/${id}/credits?api_key=${API_SECRET_KEY}&language=ko-KR`
      );
      if (!creditsRes.ok) {
        return res
          .status(500)
          .json({ error: "출연진 정보를 가져오는데 실패했습니다." });
      }
      const creditsData = await creditsRes.json();
      return res.status(200).json({ ...tvWithTypeData, credits: creditsData });
    }

    res.status(200).json(tvWithTypeData);
  } catch (error) {
    console.error("서버 에러:", error);
    res.status(500).json({ error: "서버 에러가 발생했습니다." });
  }
}
