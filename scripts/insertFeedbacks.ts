import clientPromise from "../lib/mongodb";

/**
 * 피드백 데이터 마이그레이션 스크립트
 * - createdAt 필드의 문자열을 Date 객체로 변환합니다.
 * - status 필드가 없는 문서에 전체적으로 기본값 "before reply" 설정합니다.
 * - 모든 문서의 기본값은 "before reply"입니다.
 */
async function insertFeedbacks() {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const col = db.collection("feedback");

  await col.createIndex(
    { title: "text", content: "text" },
    { name: "feedback_text_index" },
  );

  const DataCursor = col.find({ createdAt: { $type: "string" } });
  while (await DataCursor.hasNext()) {
    const doc = await DataCursor.next();
    const date = new Date(doc?.createdAt);
    await col.updateOne({ _id: doc?._id }, { $set: { createdAt: date } });
  }

  await col.updateMany(
    { status: { $exists: false } },
    { $set: { status: "before reply" } },
  );
  (" 날짜, 상태 데이터 마이그레이션 완료 ");
  await client.close();
}

insertFeedbacks().catch((err) => {
  console.error("피드백 데이터 삽입 중 오류 발생:", err);
  process.exit(1);
});
