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
 * @param AdminId 관리자 ID
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
