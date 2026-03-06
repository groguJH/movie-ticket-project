import React, { useCallback, useEffect, useState } from "react";
import FeedbackDetailPresenter from "../../components/presenters/FeedbackAdmin/FeedbackDetailPresenter";
import axios from "axios";

interface FeedbackDetailProps {
  selectedId: string;
  onClose: () => void;
  onRefreshAction: () => void;
}
export type FeedbackStatus = "before reply" | "in_progress" | "resolved";

/**
 *
 * @param selectedId 선택된 피드백 아이디
 * @param onClose 모달 닫기 함수
 * @param onRefreshAction 피드백 리스트 새로고침 함수
 * @description
 *   피드백 상세 조회, 답글 추가, 답글 삭제, 게시글 처리상태 수정 기능을 제공합니다.
 */
export default function FeedbackDetailContainer({
  selectedId,
  onClose,
  onRefreshAction,
}: FeedbackDetailProps) {
  const [data, setData] = useState(null);
  const [comment, setComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState<FeedbackStatus>("before reply");
  const [saving, setSaving] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/adminFeedback/${selectedId}`);
      const payload = res?.data ?? res.data;

      setData(payload);
      setStatus(payload.status);
    } catch (err: any) {
      ("상세 조회할 수 없습니다.", err);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail, selectedId]);

  async function handleAddComment(text: string) {
    setComment(true);
    try {
      const res = await axios.post(
        `/api/adminFeedback/${selectedId}/response/index`,
        {
          text,
        },
      );
      const payload = res?.data ?? res.data;
      setData(payload);
      if (onRefreshAction) {
        onRefreshAction();
      }
    } catch (err) {
      ("답글 추가할 수 없습니다", err);
      alert("답글 추가할 수 없습니다");
    } finally {
      setComment(false);
    }
  }

  async function onSaveStatus() {
    try {
      setSaving(true);
      await axios.patch(`/api/adminFeedback/${selectedId}`, { status });

      onRefreshAction();
      onClose();
    } catch (err) {
      ("상태를 저장할 수 없습니다.", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteComment(hard = false) {
    if (!confirm("이 피드백을 삭제하시겠습니까? (복구 불가할 수 있습니다.)"))
      return;
    setComment(true);

    try {
      const res = await axios.delete(
        `/api/adminFeedback/${selectedId}/response/index`,
        {
          data: { hard },
        },
      );
      const payload = res?.data ?? res.data;
      setData(payload);
      if (onRefreshAction) {
        onRefreshAction();
      }
      onClose();
    } catch (err) {
      ("삭제할 수 없습니다", err);
      alert("삭제할 수 없습니다");
    } finally {
      setComment(false);
    }
  }

  return (
    <FeedbackDetailPresenter
      selectedId={selectedId}
      data={data}
      onClose={onClose}
      comment={comment}
      loading={loading}
      error={error}
      status={status}
      onChangeStatus={setStatus}
      handleAddComment={handleAddComment}
      onSaveStatus={onSaveStatus}
      handleDeleteComment={handleDeleteComment}
    />
  );
}
