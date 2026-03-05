import clientPromise from "./mongodb";
/**
 * @param {string} adminId - 관리자 ID
 * @param {string} action - 수행한 행동 (예: "deleteUser", "updateFeedbackStatus" 등)
 * @param {string}  targetId - 행동의 대상이 되는 리소스 ID (예: 사용자 ID, 피드백 ID 등)
 * @param {Object}  details - 추가 세부 정보 (예: 변경 전후 값 등)
 */

interface LogAdminActionParams {
  adminName: string;
  action: string;
  targetId?: string;
  details?: Record<string, any>;
}

/**
 * 관리자 행동 로그 저장하는 함수
 * @prop { adminId, action, targetId, details}: LogAdminActionParams
 * @description
 * - 관리자 행동 로그를 데이터베이스에 저장합니다.
 * - 로그는 adminActions 컬렉션에 저장됩니다.
 */
export async function logAdminAction({
  adminName: adminId,
  action,
  targetId,
  details,
}: LogAdminActionParams) {
  const client = await clientPromise;
  const db = client.db("mymovieticket");
  const col = db.collection("adminActions");
  await col.insertOne({
    adminId,
    action,
    targetId,
    details,
    createdAt: new Date(),
  });
}
