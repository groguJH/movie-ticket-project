import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import {
  FeedbackEntity,
  UpdateFeedbackRequest,
} from "../../../types/feedbackModal";

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  return db.collection<FeedbackEntity>("feedback");
}

/**
 * 피드백을 생성하는 레포지토리 함수
 * @param feedback
 * @return 생성된 FeedbackEntity 객체
 *
 */
export async function createFeedback(feedback: FeedbackEntity) {
  const collection = await getCollection();
  const result = await collection.insertOne({
    ...feedback,
    createdAt: new Date(),
  });

  return {
    ...feedback,
    _id: result.insertedId.toString(),
    createdAt: new Date(),
  };
}

// 전체 피드백 조회
export async function getFeedbackLists(filter: Partial<FeedbackEntity> = {}) {
  const collection = await getCollection();
  const res = await collection.find(filter).toArray();
  return res.map((item) => ({
    ...item,
    _id: item._id?.toString(),
  }));
}

/**
 * 특정 사용자의 상세피드백 조회 레포지토리 함수
 * @param id
 */
export async function getFeedback(id: string) {
  const collection = await getCollection();
  const res = await collection.findOne({ _id: new ObjectId(id) });
  return res ? { ...res, _id: res._id?.toString() } : null;
}

/**
 * 피드백 게시글을 업데이트하는 레포지토리 함수
 * @param feedbackId
 * @param data
 * @returns 성공여부 반환
 */
export async function updateFeedbackById(
  feedbackId: string,
  data: UpdateFeedbackRequest,
) {
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(feedbackId) },
    { $set: { ...data, updatedAt: new Date() } },
  );
  return result.modifiedCount === 1;
}
