import { ObjectId } from "mongodb";
import clientPromise from "../lib/mongodb";

/**
 * 피드백 데이터 마이그레이션 스크립트
 * - createdAt 필드의 문자열을 Date 객체로 변환합니다.
 * - status 필드가 없는 문서에 전체적으로 기본값 "before reply" 설정합니다.
 * - 모든 문서의 기본값은 "before reply"입니다.
 * - response 배열 내 ID 없는 요소들에 _id 부여합니다.
 * - 성공 여부와 관계없이 연결 종료 보장합니다.
 */
async function insertFeedbacks() {
  const client = await clientPromise;
  try {
    const db = client.db("mymovieticket");
    const col = db.collection("feedback");

    await col.createIndex(
      { title: "text", content: "text" },
      { name: "feedback_text_index" },
    );

    const DataCursor = col.find({ createdAt: { $type: "string" } });
    while (await DataCursor.hasNext()) {
      const doc = await DataCursor.next();
      if (!doc) continue;
      const date = new Date(doc.createdAt);
      await col.updateOne({ _id: doc._id }, { $set: { createdAt: date } });
    }

    await col.updateMany(
      { status: { $exists: false } },
      { $set: { status: "before reply" } },
    );

    console.log("날짜, 상태 데이터 마이그레이션 완료");

    const feedbackWithRes = col.find({ response: { $exists: true } });
    while (await feedbackWithRes.hasNext()) {
      const doc = await feedbackWithRes.next();

      if (!doc || !Array.isArray(doc.response)) continue;

      let isUpdated = false;
      const updatedRes = doc.response.map((res: any) => {
        if (!res) return res;
        if (!res._id) {
          isUpdated = true;
          return { ...res, _id: new ObjectId() };
        }
        return res;
      });

      if (isUpdated) {
        await col.updateOne(
          { _id: doc._id },
          { $set: { response: updatedRes } },
        );
      }
    }
    console.log("모든 데이터 마이그레이션 정상 종료");
  } catch (error) {
    console.error("마이그레이션 중 치명적 오류:", error);
    throw error;
  } finally {
    await client.close();
  }
}

insertFeedbacks().catch((err) => {
  console.error("스크립트 실행 실패:", err);
  process.exit(1);
});
