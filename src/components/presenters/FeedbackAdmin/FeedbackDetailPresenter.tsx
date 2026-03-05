import React, { useState } from "react";
import {
  ButtonGroup,
  CloseButton,
  ContentText,
  DetailContent,
  DetailHeader,
  DetailItem,
  DetailSection,
  DetailTitle,
  EditButton,
  ModalBox,
  ModalOverlay,
} from "../../utils/ListPresenter";
import { FeedbackStatus } from "../../../containers/feedbackAdmin/FeedbackDetailContainer";

interface DetailPresenterProps {
  selectedId: string;
  data: any | null;
  comment: any | null;
  loading: boolean;
  error?: string | null;
  handleAddComment: (text: string) => void;

  handleDeleteComment: (hard?: boolean) => void;
  onClose: () => void;
  status: FeedbackStatus;
  onSaveStatus: () => void;
  onChangeStatus: (status: FeedbackStatus) => void;
}

export default function FeedbackDetailPresenter({
  selectedId,
  data,
  loading,
  error,
  handleAddComment,
  onSaveStatus,
  onChangeStatus,
  status,
  handleDeleteComment,
  onClose,
}: DetailPresenterProps) {
  if (!selectedId) return null;

  const [responseText, SetResponseText] = useState("");
  const responses = (Array.isArray(data?.response) ? data.response : []).filter(
    (res: any) => !res?.isDeleted,
  );

  return (
    <ModalOverlay role="dialog" aria-modal="true" onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <DetailSection style={{ width: "100%", height: "100%", padding: 20 }}>
          <DetailHeader>
            <DetailTitle>
              {loading ? "로딩 중..." : (data?.title ?? "제목 없음")}
            </DetailTitle>
            <ButtonGroup>
              <CloseButton onClick={onClose}>
                <span>×</span>
              </CloseButton>
            </ButtonGroup>
          </DetailHeader>

          <DetailContent>
            {error && <p style={{ color: "salmon" }}>{error}</p>}
            {!error && !loading && data && (
              <>
                <DetailItem>
                  <strong>작성자</strong>
                  <span>
                    {data.userName} ( 아이디 : {data.userId} )
                  </span>
                </DetailItem>

                <DetailItem>
                  <strong>작성일</strong>
                  <span>{new Date(data.createdAt).toLocaleString()}</span>
                </DetailItem>

                <DetailItem>
                  <strong>상태</strong>
                  <div style={{ marginTop: 8 }}>
                    <select
                      value={status}
                      onChange={(e) =>
                        onChangeStatus(e.target.value as FeedbackStatus)
                      }
                    >
                      <option value="before reply">대기</option>
                      <option value="in_progress">처리 중</option>
                      <option value="resolved">완료</option>
                    </select>
                    <EditButton
                      onClick={onSaveStatus}
                      style={{ marginLeft: 8 }}
                    >
                      저장
                    </EditButton>
                  </div>
                </DetailItem>

                <DetailItem>
                  <strong>내용</strong>
                  <ContentText>{data.content}</ContentText>
                </DetailItem>

                {/* response 목록 */}
                <DetailItem>
                  <strong>관리자 응답</strong>

                  {responses.length > 0 ? (
                    responses.map((r: any) => (
                      <div
                        key={String(r._id ?? r.createdAt)}
                        style={{
                          padding: "8px 0",
                          borderBottom: "1px dashed #444",
                        }}
                      >
                        <div style={{ fontSize: 13, color: "#cfcfcf" }}>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : " "}
                        </div>

                        <div style={{ marginTop: 6 }}>
                          <span style={{ fontWeight: "bold", fontSize: 16 }}>
                            {String(r.adminName)}
                          </span>
                          <span style={{ fontSize: 13 }}>
                            {String(r.text)}{" "}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#a9a9a9" }}>
                      등록된 응답이 없습니다.
                    </div>
                  )}
                </DetailItem>

                {/* 응답 작성 폼 */}
                <DetailItem>
                  <strong>응답 작성</strong>
                  <textarea
                    value={responseText}
                    onChange={(e) => SetResponseText(e.target.value)}
                    rows={4}
                    placeholder="응답 내용을 입력하세요"
                  />
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <EditButton
                      onClick={() => {
                        if (!responseText.trim()) {
                          alert("응답을 입력하세요.");
                          return;
                        }
                        handleAddComment(responseText.trim());
                        SetResponseText("");
                      }}
                    >
                      전송
                    </EditButton>
                    <EditButton
                      onClick={() => {
                        SetResponseText("");
                      }}
                    >
                      초기화
                    </EditButton>
                    <EditButton
                      onClick={() => handleDeleteComment(false)}
                      style={{ background: "#c62828" }}
                    >
                      삭제
                    </EditButton>
                  </div>
                </DetailItem>
              </>
            )}
          </DetailContent>
        </DetailSection>
      </ModalBox>
    </ModalOverlay>
  );
}
