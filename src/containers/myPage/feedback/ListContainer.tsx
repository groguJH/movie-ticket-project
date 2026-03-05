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
  const [isEditMode, setIsEditMode] = useState(false); // 수정모드 상태
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [backupData, setBackupData] = useState<FeedbackDetail | null>(null);
  const updateMutation = useUpdateFeedback();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedback", page],
    queryFn: () => fetchPost(page, 10),
    // keepPreviousData: true, // 이전 데이터 유지(깜빡임 방지)
    refetchInterval: 1000 * 60, // 1분마다 데이터 새로고침
  });

  // 수정작업을 보여주는 버튼을 실행하기 함수
  // ✅ 수정 모드 진입 함수 (기존의 데이터를 담아서 진입함)
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

    // 통신
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

  // 페이지네이션 관리 함수
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 모달을 열고 닫는 함수
  const handleModal = () => {
    setModal(!modal);
  };

  // 닫기 기능
  const handleClose = () => {
    setSelectedList(null);
    setModal(false);
  };

  //
  return (
    <ListPresenter
      page={page}
      setPage={handlePageChange}
      modal={modal}
      setModal={handleModal}
      selectedList={selectedList}
      setSelectedList={setSelectedList}
      // ✅ 추가 Props
      isEditMode={isEditMode}
      editTitle={editTitle}
      editContent={editContent}
      editSatisfaction={editSatisfaction}
      SetEditSatisfaction={SetEditSatisfaction}
      setUpdate={handleUpdate} // 요청하기
      onStartEdit={handleStartEdit} // 수정모드
      onCancelEdit={handleCancelEdit} // 수정취소
      onTitleChange={setEditTitle}
      onContentChange={setEditContent}
      // ✅ 기존 Props
      handleClose={handleClose}
      data={data}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
