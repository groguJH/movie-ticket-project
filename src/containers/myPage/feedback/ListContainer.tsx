import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import fetchPost from "../../../../lib/utils/fetchPost";
import ListPresenter from "../../../components/presenters/feedback/ListPresenter";
import useUpdateFeedback from "../../../components/utils/useUpdateFeedback";
import { FeedbackDetail } from "../../../../types/feedbackModal";
import { message } from "antd";

/**
 *
 * 피드백 리스트 컨테이너 컴포넌트
 * @description
 * - React Query를 사용하여 피드백 목록을 비동기 조회
 * - 페이지네이션 기능을 통해 사용자가 원하는 페이지의 피드백을 볼 수 있도록 함
 * - 피드백 수정 기능을 제공하여 사용자가 선택한 피드백을 수정할 수 있도록 함
 * - 수정 모드 진입, 취소, 요청하기 기능을 구현
 * - 모달 열기/닫기 기능을 구현
 * - 피드백 목록이 있을 경우 ListPresenter 컴포넌트에 데이터를 전달하여 UI 렌더링
 *
 */
export default function ListContainer() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [selectedList, setSelectedList] = useState<FeedbackDetail | null>(null);
  const totalPages = Math.ceil(100 / 10);
  const [messageApi, contextHolder] = message.useMessage();

  const [editSatisfaction, SetEditSatisfaction] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [backupData, setBackupData] = useState<FeedbackDetail | null>(null);
  const updateMutation = useUpdateFeedback();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedback", page],
    queryFn: () => fetchPost(page, 10),
    refetchInterval: 1000 * 60,
  });

  const handleStartEdit = () => {
    if (!selectedList) return;
    setIsEditMode(true);
    setEditTitle(selectedList.title);
    setEditContent(selectedList.content);
    SetEditSatisfaction(selectedList.satisfaction);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditTitle("");
    setEditContent("");
    SetEditSatisfaction("");
  };

  const handleUpdate = () => {
    if (!selectedList) return;

    setBackupData(selectedList);
    setIsEditMode(false);
    setSelectedList({
      ...selectedList,
      title: editTitle,
      content: editContent,
      satisfaction: editSatisfaction,
    });

    updateMutation.mutate(
      {
        id: selectedList?._id as string,
        data: {
          title: editTitle,
          content: editContent,
          satisfaction: editSatisfaction,
        },
      },
      {
        onSuccess: (res) => {
          res;
        },
        onError: (err) => {
          err;

          if (backupData) {
            setSelectedList(backupData);
            setIsEditMode(true);
            setEditTitle(selectedList.title);
            setEditContent(selectedList.content);
            SetEditSatisfaction(selectedList.satisfaction);
          }
          messageApi.open({
            type: "error",
            content: "수정에 실패했습니다 다시 시도해주세요",
          });
          setBackupData(null);
        },
      },
    );
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  const handleClose = () => {
    setSelectedList(null);
    setModal(false);
  };

  return (
    <ListPresenter
      page={page}
      setPage={handlePageChange}
      modal={modal}
      setModal={handleModal}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
      isEditMode={isEditMode}
      editTitle={editTitle}
      editContent={editContent}
      editSatisfaction={editSatisfaction}
      SetEditSatisfaction={SetEditSatisfaction}
      setUpdate={handleUpdate}
      onStartEdit={handleStartEdit}
      onCancelEdit={handleCancelEdit}
      onTitleChange={setEditTitle}
      onContentChange={setEditContent}
      handleClose={handleClose}
      data={data}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
