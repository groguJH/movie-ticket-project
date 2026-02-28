# AIMODIFY

## Diff Format Unified

- All code blocks are unified to `diff --git` format.
- Date: 2026-02-27

## Base Commit Diff (28da050)

```diff
diff --git a/pages/api/adminFeedback/[id]/response/[rid].ts b/pages/api/adminFeedback/[id]/response/[rid].ts
index c3a3806..a78c451 100644
--- a/pages/api/adminFeedback/[id]/response/[rid].ts
+++ b/pages/api/adminFeedback/[id]/response/[rid].ts
@@ -7,7 +7,7 @@ import addResponse, {
 } from "../../../../../src/services/adminFeedback/FeedbackAdService";

 /**
- * 관리자의 답글 수정/삭제 핸들러
+ * 관리자의 답글 작성/수정/삭제 핸들러
  * @param req
  * @param res
  */
@@ -35,13 +35,14 @@ export default async function handler(
   }

   if (req.method === "PATCH") {
-    const patchContext = req.body;
-    const updated = await patchFeedbackService(id, patchContext, AdminName);
+    const { text } = req.body;
+    const updated = await patchFeedbackService(id, rid, { text }, AdminName);
     return res.status(200).json({ ok: true, data: updated });
   }
+
   if (req.method === "DELETE") {
-    const soft = true;
-    await deleteFeedbackService(id, AdminName, soft);
+    const isSoft = true;
+    await deleteFeedbackService(id, rid, AdminName, isSoft);
     return res.status(200).json({ ok: true });
   }
   return res.status(405).end();
diff --git a/src/repositories/feedbackAdmin/FeedbackAdRepository.ts b/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
index 40542cc..215b1f6 100644
--- a/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
+++ b/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
@@ -158,11 +158,18 @@ export async function getFeedbackStatusStats() {
  * - patch 객체를 받아 해당 피드백의 필드를 수정합니다.
  * - 유효한 상태 값인지 검증합니다.
  */
-export async function patchFeedback(id: string, patch: any) {
+export async function patchFeedback(id: string, rid: string, patch: any) {
   const collection = await getCollection();
-  const _id = new ObjectId(id);
-  await collection.updateOne({ _id }, { $set: patch });
-  return await collection.findOne({ _id });
+  await collection.updateOne(
+    { _id: new ObjectId(id), "responses._id": new ObjectId(rid) },
+    {
+      $set: {
+        "responses.$.text": patch.text,
+        "responses.$.updatedAt": new Date(),
+      },
+    },
+  );
+  return await collection.findOne({ _id: new ObjectId(id) });
 }

 /**
@@ -174,15 +181,17 @@ export async function patchFeedback(id: string, patch: any) {
  * - soft가 false일 경우 실제로 문서를 삭제합니다.
  * @return 삭제 결과
  */
-export async function deleteFeedback(id: string, soft = true) {
+export async function deleteFeedback(id: string, rid: string) {
   const collection = await getCollection();
-  const _id = new ObjectId(id);
-  if (soft) {
-    await collection.updateOne({ _id }, { $set: { isDeleted: true } });
-  } else {
-    return collection.deleteOne({ _id });
-  }
-  return { ok: true };
+  return await collection.updateOne(
+    {
+      _id: new ObjectId(id),
+      "responses._id": new ObjectId(rid),
+    },
+    {
+      $set: { "responses.$.isDeleted": true },
+    },
+  );
 }

 interface UpdateFeedbackStatusPayload {
diff --git a/src/services/adminFeedback/FeedbackAdService.ts b/src/services/adminFeedback/FeedbackAdService.ts
index c269c86..a7c31a8 100644
--- a/src/services/adminFeedback/FeedbackAdService.ts
+++ b/src/services/adminFeedback/FeedbackAdService.ts
@@ -46,6 +46,7 @@ export default async function addResponse(

 export async function patchFeedbackService(
   id: string,
+  rid: string,
   patch: any,
   adminName: string,
 ) {
@@ -54,11 +55,11 @@ export async function patchFeedbackService(
     !["new", "in_progress", "resolved", "closed"].includes(patch.status)
   )
     throw new Error("Invalid status");
-  const updated = await patchFeedback(id, patch);
+  const updated = await patchFeedback(id, rid, patch);
   await logAdminAction({
     adminName,
     action: "patchFeedback",
-    targetId: id,
+    targetId: `${id}-${rid}`,
     details: patch,
   });
   return updated;
@@ -66,14 +67,15 @@ export async function patchFeedbackService(

 export async function deleteFeedbackService(
   id: string,
+  rid: string,
   adminName: string,
   soft: boolean,
 ) {
-  const result = await deleteFeedback(id, soft);
+  const result = await deleteFeedback(id, rid);
   await logAdminAction({
     adminName: adminName,
     action: "deleteFeedback",
-    targetId: id,
+    targetId: `${id}-${rid}`,
     details: { soft },
   });
   return result;
```

## Current Working Tree Diff

```diff
diff --git a/pages/api/adminFeedback/[id]/response/index.ts b/pages/api/adminFeedback/[id]/response/index.ts
index 480671c..55089ad 100644
--- a/pages/api/adminFeedback/[id]/response/index.ts
+++ b/pages/api/adminFeedback/[id]/response/index.ts
@@ -13,7 +13,11 @@ import { authOptions } from "../../../auth/[...nextauth]";

 export default async function index(req: NextApiRequest, res: NextApiResponse) {
   const { id } = req.query;
-  const { text } = req.body;
+  const { text, rid } = req.body ?? {};
+
+  if (!id || Array.isArray(id)) {
+    return res.status(400).json({ message: "유효한 피드백 ID가 필요합니다." });
+  }

   // 2. 세션 및 권한 체크
   const session = await getServerSession(req, res, authOptions);
@@ -25,14 +29,19 @@ export default async function index(req: NextApiRequest, res: NextApiResponse) {
   // 3. 메서드별 로직 분기
   try {
     if (req.method === "POST") {
+      if (!text || typeof text !== "string") {
+        return res.status(400).json({ message: "답글 내용을 입력해주세요." });
+      }
       const result = await addResponse(id as string, text, adminName);
       return res.status(200).json(result);
     }

     if (req.method === "DELETE") {
-      const { hard } = req.body;
-      // deleteResponse 서비스 함수가 있다고 가정
-      const result = await deleteFeedbackService(id as string, adminName, true);
+      if (!rid || typeof rid !== "string") {
+        return res.status(400).json({ message: "삭제할 답글 ID(rid)가 필요합니다." });
+      }
+      // 하위 호환을 위해 index 라우트에서도 rid 삭제를 지원합니다.
+      const result = await deleteFeedbackService(id as string, rid, adminName, true);
       return res.status(200).json(result);
     }

diff --git a/src/components/presenters/FeedbackAdmin/FeedbackDetailPresenter.tsx b/src/components/presenters/FeedbackAdmin/FeedbackDetailPresenter.tsx
index 5aceecc..098fd1a 100644
--- a/src/components/presenters/FeedbackAdmin/FeedbackDetailPresenter.tsx
+++ b/src/components/presenters/FeedbackAdmin/FeedbackDetailPresenter.tsx
@@ -44,6 +44,9 @@ export default function FeedbackDetailPresenter({
   if (!selectedId) null;

   const [responseText, SetResponseText] = useState("");
+  const responses = (Array.isArray(data?.response) ? data.response : []).filter(
+    (res: any) => !res?.isDeleted,
+  );

   // 모달엔 아이디, 데이터, 로딩에러,뿐만 아니라 답글추가, 수정, 삭제도 필요하다.
   return (
@@ -108,11 +111,10 @@ export default function FeedbackDetailPresenter({
                 <DetailItem>
                   <strong>관리자 응답</strong>

-                  {Array.isArray(data.responses) &&
-                  data.responses.length > 0 ? (
-                    data.responses.map((r: any) => (
+                  {responses.length > 0 ? (
+                    responses.map((r: any) => (
                       <div
-                        key={r.createdAt}
+                        key={String(r._id ?? r.createdAt)}
                         style={{
                           padding: "8px 0",
                           borderBottom: "1px dashed #444",
diff --git a/src/components/presenters/feedback/ListPresenter.tsx b/src/components/presenters/feedback/ListPresenter.tsx
index d9ba15d..98df1f9 100644
--- a/src/components/presenters/feedback/ListPresenter.tsx
+++ b/src/components/presenters/feedback/ListPresenter.tsx
@@ -79,6 +79,12 @@ export default function ListPresenter({
   const limit = data?.limit ?? 10;
   const totalPages = Math.ceil(total / limit);
   const isOpenModal = selectedList !== null;
+  // 저장 키(response) 변경 이후에도 기존 responses 문서를 함께 처리하기 위한 호환 배열입니다.
+  const selectedresponses = (
+    selectedList?.response ??
+    selectedList?.responses ??
+    []
+  ).filter((res: any) => !res?.isDeleted);

   return (
     <Wrapper>
@@ -110,7 +116,11 @@ export default function ListPresenter({
                       <MetaInfo>
                         <span>작성자: {item.userName}</span>
                         <span>|</span>
-                        <span>{new Date().toLocaleDateString()}</span>
+                        <span>
+                          {item.createdAt
+                            ? new Date(item.createdAt).toLocaleDateString()
+                            : "-"}
+                        </span>
                       </MetaInfo>
                     </HeaderMain>
                   </HeaderButton>
@@ -165,7 +175,11 @@ export default function ListPresenter({

                 <DetailItem>
                   <strong>작성일</strong>
-                  <span>{new Date().toLocaleDateString()}</span>
+                  <span>
+                    {selectedList.createdAt
+                      ? new Date(selectedList.createdAt).toLocaleDateString()
+                      : "-"}
+                  </span>
                 </DetailItem>

                 <DetailItem>
@@ -173,7 +187,7 @@ export default function ListPresenter({
                   {isEditMode ? (
                     <div>
                       <CustomRadio
-                        value="매우 만족"
+                        value="매우만족"
                         selected={editSatisfaction}
                         onChange={SetEditSatisfaction}
                       />
@@ -216,10 +230,10 @@ export default function ListPresenter({
                     <ContentText>{selectedList.content}</ContentText>
                   )}
                 </DetailItem>
-                {selectedList.responses?.length > 0 && (
+                {selectedresponses.length > 0 && (
                   <DetailItem>
-                    {selectedList.responses.map((r: any, i: number) => (
-                      <div key={i}>
+                    {selectedresponses.map((r: any, i: number) => (
+                      <div key={String(r._id ?? i)}>
                         <strong>관리자 답변</strong>
                         <span>이름 : {r.adminName}</span>
                         <br />
diff --git a/src/containers/feedbackAdmin/FeedbackDetailContainer.tsx b/src/containers/feedbackAdmin/FeedbackDetailContainer.tsx
index d2234e2..849672c 100644
--- a/src/containers/feedbackAdmin/FeedbackDetailContainer.tsx
+++ b/src/containers/feedbackAdmin/FeedbackDetailContainer.tsx
@@ -29,6 +29,12 @@ export default function FeedbackDetailContainer({

   const [status, setStatus] = useState<FeedbackStatus>("before reply");
   const [saving, setSaving] = useState(false);
+  // 저장 키(response) 변경 이후 기존 responses 데이터도 읽기 위한 호환 배열입니다.
+  const activeresponses = (
+    (data as any)?.response ??
+    (data as any)?.responses ??
+    []
+  ).filter((res: any) => !res?.isDeleted);

   const fetchDetail = useCallback(async () => {
     setLoading(true);
@@ -91,14 +97,15 @@ export default function FeedbackDetailContainer({
     setComment(true);

     try {
-      const res = await axios.delete(
-        `/api/adminFeedback/${selectedId}/response/index`,
-        {
-          data: { hard },
-        },
-      );
-      const payload = res?.data ?? res.data;
-      setData(payload);
+      // 현재 UI는 특정 답글 선택 기능이 없어, 마지막(최신) 답글을 삭제 대상으로 사용합니다.
+      const targetResponse = [...activeresponses].pop();
+      const responseId = targetResponse?._id;
+      if (!responseId) {
+        alert("삭제할 관리자 답글이 없습니다.");
+        return;
+      }
+
+      await axios.delete(`/api/adminFeedback/${selectedId}/response/${responseId}`);
       if (onRefreshAction) {
         onRefreshAction();
       }
diff --git a/src/repositories/feedbackAdmin/FeedbackAdRepository.ts b/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
index 498273f..98d7b83 100644
--- a/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
+++ b/src/repositories/feedbackAdmin/FeedbackAdRepository.ts
@@ -99,6 +99,8 @@ export async function response(
     {
       $push: {
         response: {
+          // rid 기반 수정/삭제 API에서 사용할 답글 식별자입니다.
+          _id: new ObjectId(),
           text: response.text,
           adminName: response.adminName,
           createdAt: new Date(),
@@ -169,9 +171,11 @@ export async function patchFeedback(id: string, rid: string, patch: any) {
       },
     },
   );
+
   if (res.matchedCount === 0) {
-    throw new Error("업데이트 완료했습니다.");
+    throw new Error("수정할 답변을 찾을 수 없습니다.");
   }
+
   return await collection.findOne({ _id: new ObjectId(id) });
 }

@@ -199,7 +203,6 @@ export async function deleteFeedback(id: string, rid: string) {
   if (res.matchedCount === 0) {
     throw new Error("삭제할 피드백을 찾을 수 없습니다.");
   }
-
   return;
 }

diff --git a/src/services/feedback/FeedbackService.ts b/src/services/feedback/FeedbackService.ts
index 22af9a7..5ef3fa9 100644
--- a/src/services/feedback/FeedbackService.ts
+++ b/src/services/feedback/FeedbackService.ts
@@ -10,6 +10,20 @@ import {
   updateFeedbackById,
 } from "../../repositories/feedback/updateFeedback";

+const ALLOWED_SATISFACTION = [
+  "매우만족",
+  "매우 만족",
+  "만족",
+  "보통",
+  "불만족",
+  "매우 불만족",
+] as const;
+
+function normalizeSatisfaction(value: string) {
+  // 통계 집계 키와 맞추기 위해 공백 변형(매우 만족)을 저장 표준값(매우만족)으로 정규화합니다.
+  return value === "매우 만족" ? "매우만족" : value;
+}
+
 export async function CreateFeedbackService(feedback: any) {
   const { title, content, satisfaction } = feedback;

@@ -25,14 +39,14 @@ export async function CreateFeedbackService(feedback: any) {
  * 피드백 수정 서비스 함수
  * @description
  * - feedbackId와 userId로 피드백을 식별
- * - 만족도는 1~5 사이의 정수여야 합니다
+ * - 만족도는 허용된 문자열(매우만족/만족/보통/불만족/매우 불만족)만 허용합니다.
  * - 변경된 내용이 없으면 오류 발생
  * - 최신순 정렬로 페이지네이션 합니다.
  */
 export async function UpdateFeedbackService(
   feedbackId: string,
   userId: string,
-  satisfaction: string,
+  _satisfaction: string,
   updateData: UpdateFeedbackRequest,
 ) {
   const feedback = await getFeedback(feedbackId);
@@ -45,11 +59,13 @@ export async function UpdateFeedbackService(
     throw new Error("수정 권한이 없습니다.");
   }

-  if (updateData.satisfaction !== null) {
-    const s = Number(satisfaction);
-    if (!Number.isInteger(s) || s < 1 || s > 5) {
-      throw new Error("satisfaction 만족도는 1~5 사이의 정수여야 합니다.");
+  if (typeof updateData.satisfaction === "string") {
+    const normalized = normalizeSatisfaction(updateData.satisfaction.trim());
+    if (!ALLOWED_SATISFACTION.includes(normalized as (typeof ALLOWED_SATISFACTION)[number])) {
+      throw new Error("허용되지 않은 만족도 값입니다.");
     }
+    // 업데이트 전 normalize 값을 반영해 저장/통계 키를 일관되게 유지합니다.
+    updateData.satisfaction = normalized;
   }

   const Updated =
diff --git a/types/feedbackModal.ts b/types/feedbackModal.ts
index 6d53afc..239d89c 100644
--- a/types/feedbackModal.ts
+++ b/types/feedbackModal.ts
@@ -27,7 +27,7 @@ export interface FeedbackEntity {
   isPublic?: boolean; // 공개해도 되는 내용인지 여부
   isFlagged?: boolean; // 내용의 중요도 여부
   replied?: boolean; // 답변여부
-  response?: FeedbackAdResponse[];
+  response?: FeedbackAdResponse[];
 }

 export interface FeedbackResponse {
@@ -36,13 +36,16 @@ export interface FeedbackResponse {
   userName: string;
   satisfaction?: string;
   createdAt: string;
-  responses?: FeedbackAdResponse[];
+  response?: FeedbackAdResponse[];
 }

 export interface FeedbackAdResponse {
+  _id?: string | ObjectId;
   text: string;
   adminName: string;
   createdAt: Date | string;
+  updatedAt?: Date | string;
+  isDeleted?: boolean;
 }

 export interface FeedbackListResponse {
```
