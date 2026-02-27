# AIMODIFY

## Codex Diff 변경 설명

최근 커밋(28da050) 기준으로, 핵심 변경은 "피드백 문서 전체" 단위 수정/삭제에서 "답글(rid)" 단위 수정/삭제로 동작 축을 옮긴 것입니다.

1. API 라우트 변경 (`pages/api/adminFeedback/[id]/response/[rid].ts`)
- PATCH 처리에서 body 전체 전달이 아니라 `text`를 분리하여 전달하도록 수정.
- PATCH/DELETE 모두 `id + rid` 조합을 서비스로 넘기도록 수정.

2. 서비스 레이어 변경 (`src/services/adminFeedback/FeedbackAdService.ts`)
- `patchFeedbackService`, `deleteFeedbackService`에 `rid` 인자를 추가.
- Repository 호출을 `id + rid` 기준으로 변경.
- 관리자 액션 로그 `targetId`를 `id`에서 `${id}-${rid}`로 변경하여 답글 단위 추적 가능.

3. 리포지토리(DB 쿼리) 변경 (`src/repositories/feedbackAdmin/FeedbackAdRepository.ts`)
- `patchFeedback`이 피드백 전체 `$set`에서, `adminRes.$`(포지셔널)로 특정 답글 텍스트/수정시각만 업데이트하도록 변경.
- `deleteFeedback`도 피드백 문서 삭제가 아니라 `adminRes.$.isDeleted = true`로 답글 소프트 삭제 처리하도록 변경.

4. 동작 요약
- 변경 전: 피드백 문서 중심 처리.
- 변경 후: `id + rid` 기반 답글 1건 중심 처리.
- 효과: 수정/삭제 범위가 명확해지고, 관리자 로그 추적성이 개선됨.

---

Source Commit: 28da050 (관리자 피드백 수정)

워킹 트리 diff가 비어 있어, 최신 커밋의 변경 전/후 코드를 저장합니다.

## pages/api/adminFeedback/[id]/response/[rid].ts

### Before (HEAD~1)

```
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import addResponse, {
  deleteFeedbackService,
  patchFeedbackService,
} from "../../../../../src/services/adminFeedback/FeedbackAdService";

/**
 * 관리자의 답글 수정/삭제 핸들러
 * @param req
 * @param res
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, rid } = req.query as { id: string; rid: string };

  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if (req.method === "POST") {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "답글 내용을 입력해주세요." });
    }
    const updated = await addResponse(id as string, text, AdminName as string);
    return res.status(200).json(updated);
  }

  if (req.method === "PATCH") {
    const patchContext = req.body;
    const updated = await patchFeedbackService(id, patchContext, AdminName);
    return res.status(200).json({ ok: true, data: updated });
  }
  if (req.method === "DELETE") {
    const soft = true;
    await deleteFeedbackService(id, AdminName, soft);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
```

### After (HEAD)

```
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";
import addResponse, {
  deleteFeedbackService,
  patchFeedbackService,
} from "../../../../../src/services/adminFeedback/FeedbackAdService";

/**
 * 관리자의 답글 작성/수정/삭제 핸들러
 * @param req
 * @param res
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, rid } = req.query as { id: string; rid: string };

  const session = await getServerSession(req, res, authOptions);
  const AdminName = (session?.user?.name as string) ?? "admin-unknown";

  if (session?.user?.role !== "admin") {
    return res.status(403).json({ message: "접근 권한이 없습니다." });
  }

  if (req.method === "POST") {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "답글 내용을 입력해주세요." });
    }
    const updated = await addResponse(id as string, text, AdminName as string);
    return res.status(200).json(updated);
  }

  if (req.method === "PATCH") {
    const { text } = req.body;
    const updated = await patchFeedbackService(id, rid, { text }, AdminName);
    return res.status(200).json({ ok: true, data: updated });
  }

  if (req.method === "DELETE") {
    const isSoft = true;
    await deleteFeedbackService(id, rid, AdminName, isSoft);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
```

## src/repositories/feedbackAdmin/FeedbackAdRepository.ts

### Before (HEAD~1)

```
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
  // 🚨 답변여부, 아래는 responses 배열의 길이로 판단, 삭제할수도 있는 코드
  if (replied === true) match["responses.0"] = { $exists: true };
  if (replied === false) match["responses"] = { $exists: true, $size: 0 };
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
export async function addAdminResponse(
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
        responses: {
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
export async function patchFeedback(id: string, patch: any) {
  const collection = await getCollection();
  const _id = new ObjectId(id);
  await collection.updateOne({ _id }, { $set: patch });
  return await collection.findOne({ _id });
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
export async function deleteFeedback(id: string, soft = true) {
  const collection = await getCollection();
  const _id = new ObjectId(id);
  if (soft) {
    await collection.updateOne({ _id }, { $set: { isDeleted: true } });
  } else {
    return collection.deleteOne({ _id });
  }
  return { ok: true };
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
    throw new Error("피드백을 찾을 수 없습니다.");
  }
  return res;
}
```

### After (HEAD)

```
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
  // 🚨 답변여부, 아래는 adminRes 배열의 길이로 판단, 삭제할수도 있는 코드
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
  await collection.updateOne(
    { _id: new ObjectId(id), "adminRes._id": new ObjectId(rid) },
    {
      $set: {
        "adminRes.$.text": patch.text,
        "adminRes.$.updatedAt": new Date(),
      },
    },
  );
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
  return await collection.updateOne(
    {
      _id: new ObjectId(id),
      "adminRes._id": new ObjectId(rid),
    },
    {
      $set: { "adminRes.$.isDeleted": true },
    },
  );
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
    throw new Error("피드백을 찾을 수 없습니다.");
  }
  return res;
}
```

## src/services/adminFeedback/FeedbackAdService.ts

### Before (HEAD~1)

```
import React from "react";
import {
  addAdminResponse,
  deleteFeedback,
  getFeedbackById,
  getFeedbackLists,
  getFeedbackStatusStats,
  patchFeedback,
  updateFeedbackStatus,
} from "../../repositories/feedbackAdmin/FeedbackAdRepository";
import { logAdminAction } from "../../../lib/logAdminAction";

export function findFeedbackQueryService(q: any) {
  return getFeedbackLists(q);
}

export async function getAdminFeedbackStatsService() {
  const stats = await getFeedbackStatusStats();
  return stats;
}

export async function getFeedbackByIdService(id: string) {
  const feedback = await getFeedbackById(id);
  return feedback;
}

export default async function addResponse(
  feedbackId: string,
  text: string,
  adminName: string,
) {
  const updated = await addAdminResponse(feedbackId, {
    text,
    adminName: adminName,
  });

  await logAdminAction({
    adminName: adminName,
    action: "addAdminResponse",
    targetId: feedbackId,
    details: { textLength: text.length },
  });

  return updated;
}

export async function patchFeedbackService(
  id: string,
  patch: any,
  adminName: string,
) {
  if (
    patch.status &&
    !["new", "in_progress", "resolved", "closed"].includes(patch.status)
  )
    throw new Error("Invalid status");
  const updated = await patchFeedback(id, patch);
  await logAdminAction({
    adminName,
    action: "patchFeedback",
    targetId: id,
    details: patch,
  });
  return updated;
}

export async function deleteFeedbackService(
  id: string,
  adminName: string,
  soft: boolean,
) {
  const result = await deleteFeedback(id, soft);
  await logAdminAction({
    adminName: adminName,
    action: "deleteFeedback",
    targetId: id,
    details: { soft },
  });
  return result;
}

/**
 * 피드백 상태별 통계 조회 서비스
 * @return 상태별 피드백 통계
 */
export async function getFeedbackStatsService() {
  return await getFeedbackStatusStats();
}

/**
 * 피드백 상태 업데이트 서비스
 * @param id 피드백 ID
 * @param status 새로운 상태 값
 * @param AdminId 관리자 ID (선택적)
 * @returns 업데이트된 피드백 문서
 */
export async function updateFeedbackStatusService(
  id: string,
  status: "before reply" | "resolved" | "in_progress",
  AdminId?: string,
) {
  const allowed = ["before reply", "resolved", "in_progress"];

  if (!allowed.includes(status)) {
    throw new Error("허용되지 않은 status 값입니다.");
  }
  return await updateFeedbackStatus(id, { status, AdminId });
}
```

### After (HEAD)

```
import React from "react";
import {
  adminResponse,
  deleteFeedback,
  getFeedbackById,
  getFeedbackLists,
  getFeedbackStatusStats,
  patchFeedback,
  updateFeedbackStatus,
} from "../../repositories/feedbackAdmin/FeedbackAdRepository";
import { logAdminAction } from "../../../lib/logAdminAction";

export function findFeedbackQueryService(q: any) {
  return getFeedbackLists(q);
}

export async function getAdminFeedbackStatsService() {
  const stats = await getFeedbackStatusStats();
  return stats;
}

export async function getFeedbackByIdService(id: string) {
  const feedback = await getFeedbackById(id);
  return feedback;
}

export default async function addResponse(
  feedbackId: string,
  text: string,
  adminName: string,
) {
  const updated = await adminResponse(feedbackId, {
    text,
    adminName: adminName,
  });

  await logAdminAction({
    adminName: adminName,
    action: "addAdminResponse",
    targetId: feedbackId,
    details: { textLength: text.length },
  });

  return updated;
}

export async function patchFeedbackService(
  id: string,
  rid: string,
  patch: any,
  adminName: string,
) {
  if (
    patch.status &&
    !["new", "in_progress", "resolved", "closed"].includes(patch.status)
  )
    throw new Error("Invalid status");
  const updated = await patchFeedback(id, rid, patch);
  await logAdminAction({
    adminName,
    action: "patchFeedback",
    targetId: `${id}-${rid}`,
    details: patch,
  });
  return updated;
}

export async function deleteFeedbackService(
  id: string,
  rid: string,
  adminName: string,
  soft: boolean,
) {
  const result = await deleteFeedback(id, rid);
  await logAdminAction({
    adminName: adminName,
    action: "deleteFeedback",
    targetId: `${id}-${rid}`,
    details: { soft },
  });
  return result;
}

/**
 * 피드백 상태별 통계 조회 서비스
 * @return 상태별 피드백 통계
 */
export async function getFeedbackStatsService() {
  return await getFeedbackStatusStats();
}

/**
 * 피드백 상태 업데이트 서비스
 * @param id 피드백 ID
 * @param status 새로운 상태 값
 * @param AdminId 관리자 ID (선택적)
 * @returns 업데이트된 피드백 문서
 */
export async function updateFeedbackStatusService(
  id: string,
  status: "before reply" | "resolved" | "in_progress",
  AdminId?: string,
) {
  const allowed = ["before reply", "resolved", "in_progress"];

  if (!allowed.includes(status)) {
    throw new Error("허용되지 않은 status 값입니다.");
  }
  return await updateFeedbackStatus(id, { status, AdminId });
}
```


