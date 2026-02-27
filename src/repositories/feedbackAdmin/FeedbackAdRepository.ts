import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import { FeedbackEntity } from "../../../types/feedbackModal";

type Filter = {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  satisfaction?: string;
  page?: number;
  limit?: number;
  replied?: boolean;
  sort?: "-createdAt";
};

/**
 *
 * 피드백 컬렉션을 가져오는 헬퍼 함수
 */
async function getCollection() {
  const client = await clientPromise;
  const db = client.db("mymovieticket");

  return db.collection<FeedbackEntity>("feedback");
}

/**
 *
 * 관리자용 피드백 리스트 조회 기능
 * @param filters
 * @description
 * - 다양한 필터링 옵션을 지원합니다.
 * - 페이징 및 정렬 기능을 포함합니다.
 * - promise.all 병렬처리로 기능을 높임
 */
export async function getFeedbackLists(filters: Filter) {
  const collection = await getCollection();

  const {
    q,
    status,
    from,
    to,
    sort = "-createdAt",
    satisfaction,
    replied,
    page = 1,
    limit = 20,
  } = filters;
  const match: any = { isDeleted: { $ne: true } };

  if (q) {
    match.$text = { $search: q };
  }
  if (status) match.status = status;
  if (satisfaction) match.satisfaction = satisfaction;
  // 🚨 답변여부, 아래는 adminRes 배열의 길이로 판단
  if (replied === true) match["adminRes.0"] = { $exists: true };
  if (replied === false) match["adminRes"] = { $exists: true, $size: 0 };
  if (from || to) {
    match.createdAt = {};
    if (from) match.createdAt.$gte = new Date(from);
    if (to) match.createdAt.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const sortObj: any = {};

  if (sort.startsWith("-")) sortObj[sort.slice(1)] = -1;
  else sortObj[sort] = 1;

  const [items, total] = await Promise.all([
    collection.find(match).sort(sortObj).skip(skip).limit(limit).toArray(),
    collection.countDocuments(match),
  ]);

  return { items, total, page, limit };
}

/**
 * 관리자 답변 추가 기능
 * @param feedbackId
 * @param response
 * @returns
 */
export async function adminResponse(
  feedbackId: string,
  response: {
    text: string;
    adminName: string;
  },
) {
  const collection = await getCollection();
  const _id = new ObjectId(feedbackId);

  await collection.updateOne(
    { _id },
    {
      $push: {
        adminRes: {
          text: response.text,
          adminName: response.adminName,
          createdAt: new Date(),
        },
      },
      $set: {
        status: "in_progress",
        handledBy: response.adminName,
        handledAt: new Date(),
      },
    },
  );
  return await collection.findOne({ _id });
}

/**
 * 단일 피드백 조회기능
 * @param id
 * @returns id에 해당하는 피드백 문서, isDeleted가 아닌 것을 반환
 */
export async function getFeedbackById(id: string) {
  const collection = await getCollection();
  const _id = new ObjectId(id);
  return collection.findOne({ _id, isDeleted: { $ne: true } });
}

/**
 * 피드백 상태별 통계 조회 기능
 */
export async function getFeedbackStatusStats() {
  const collection = await getCollection();
  const [res] = await collection
    .aggregate([
      {
        $facet: {
          Total: [{ $count: "count" }],
          Status: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          Satisfaction: [
            { $group: { _id: "$satisfaction", count: { $sum: 1 } } },
          ],
        },
      },
    ])
    .toArray();
  return {
    total: res.Total[0]?.count ?? 0,
    status: res.Status,
    satisfaction: res.Satisfaction,
  };
}

/**
 * 피드백 수정 기능
 * @param id
 * @param patch
 * @description
 * - patch 객체를 받아 해당 피드백의 필드를 수정합니다.
 * - 유효한 상태 값인지 검증합니다.
 */
export async function patchFeedback(id: string, rid: string, patch: any) {
  const collection = await getCollection();
  const res = await collection.updateOne(
    { _id: new ObjectId(id), "adminRes._id": new ObjectId(rid) },
    {
      $set: {
        "adminRes.$.text": patch.text,
        "adminRes.$.updatedAt": new Date(),
      },
    },
  );
  if (res.matchedCount === 0) {
    throw new Error("업데이트 완료했습니다.");
  }
  return await collection.findOne({ _id: new ObjectId(id) });
}

/**
 * 피드백 삭제 기능
 * @param id
 * @param soft
 * @description
 * - soft가 true일 경우 isDeleted 플래그를 설정하여 소프트 삭제를 수행합니다.
 * - soft가 false일 경우 실제로 문서를 삭제합니다.
 * @return 삭제 결과
 */
export async function deleteFeedback(id: string, rid: string) {
  const collection = await getCollection();
  const res = await collection.updateOne(
    {
      _id: new ObjectId(id),
      "adminRes._id": new ObjectId(rid),
    },
    {
      $set: { "adminRes.$.isDeleted": true },
    },
  );

  if (res.matchedCount === 0) {
    throw new Error("삭제할 피드백을 찾을 수 없습니다.");
  }

  return;
}

interface UpdateFeedbackStatusPayload {
  status: "before reply" | "resolved" | "in_progress";
  AdminId?: string;
}

/**
 * 피드백 상태 업데이트 기능
 * @param id
 * @param payload
 * @description
 * - 피드백의 상태를 업데이트합니다.
 * - 상태 변경 시 관리자 ID와 업데이트 시간을 기록합니다.
 * - 관리자가 직접 선택하여 답변상태를 변경합니다.
 */
export async function updateFeedbackStatus(
  id: string,
  payload: UpdateFeedbackStatusPayload,
) {
  const collection = await getCollection();
  const res = await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        status: payload.status,
        AdminId: payload.AdminId,
        updatedAt: new Date(),
      },
    },
  );
  if (res.matchedCount === 0) {
    throw new Error("수정할 피드백을 찾을 수 없습니다.");
  }
  return res;
}
