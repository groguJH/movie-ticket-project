import React from "react";
import { Input } from "../../utils/WriteForm";
import {
  DetailSection,
  EditButton,
  HeaderButton,
  HeaderMain,
  Item,
  List,
  ListWrapper,
  PageButton,
  Pagination,
  SearchRow,
  StatCard,
  StatCardBody,
  StatCardHeader,
  StatLabel,
  StatusBadge,
  StatValueText,
  Title,
  TitleText,
  Wrapper,
  WrapperSection,
  WriterInfo,
} from "../../utils/ListPresenter";
import { Flex, Progress, Space, Tooltip } from "antd";

interface FeedbackAdPresenterProps {
  search: string;
  selectedId: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  data: {
    items: any[];
    total: number;
    page?: number;
    limit: number;
  };
  onOpenDetail?: (selectedId: string) => void;
  processedStats?: {
    total: number;
    status: {
      inProgress: number;
      beforeReply: number;
    };
    satisfaction: {
      verySatisfied: number;
      satisfied: number;
      neutral: number;
      veryUnsatisfied: number;
    };
    totalSatis: number;
  };
}

export default function FeedbackAdPresenter({
  search,
  setSearch,
  loading,
  data,
  page,
  setPage,
  onOpenDetail,
  selectedId,
  processedStats,
}: FeedbackAdPresenterProps) {
  const hasSelection = !!selectedId;
  const totalPages = Math.ceil(data?.total / data?.limit);

  return (
    <Wrapper>
      {/* 제목은 최상단에 있다 */}
      <Title>피드백 관리자 페이지</Title>

      {/* 통계 섹션: 두 개의 같은 너비 카드(1,2)를 가로 정렬 */}
      <WrapperSection>
        {/* 카드 1: 원형 통계(답변 진행률, 사용자 만족도 원형 2개) */}
        <StatCard>
          <StatCardHeader>요약 통계</StatCardHeader>
          <StatCardBody>
            <div
              style={{
                display: "flex",
                gap: 20,
                justifyContent: "space-around",
              }}
            >
              <Tooltip
                title={`전체 ${processedStats?.total ?? 0}건 중 답변 완료 통계`}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Progress
                    type="circle"
                    percent={processedStats?.status?.inProgress ?? 0}
                    strokeColor="#52c41a"
                    width={110}
                  />
                  <StatLabel>답변 진행률</StatLabel>
                </div>
              </Tooltip>

              <Tooltip title="사용자 만족도 (만족 + 매우만족)">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <Progress
                    type="circle"
                    percent={processedStats?.totalSatis ?? 0}
                    strokeColor="#3bcaad"
                    width={110}
                  />
                  <StatLabel>사용자 만족도</StatLabel>
                </div>
              </Tooltip>
            </div>
          </StatCardBody>
        </StatCard>

        {/* 카드 2: 세부 만족도 바 차트들 */}
        <StatCard>
          <StatCardHeader>세부 만족도</StatCardHeader>
          <StatCardBody>
            <Flex
              vertical
              gap="small"
              style={{ width: "100%", height: "100%" }}
            >
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <StatValueText>매우 만족</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.verySatisfied ?? 0}
                  style={{ width: 480, minWidth: 120 }}
                  strokeColor="#52c41a"
                />
              </Space>

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <StatValueText>만족</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.satisfied ?? 0}
                  style={{ width: 480, minWidth: 120 }}
                />
              </Space>

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <StatValueText>보통</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.neutral ?? 0}
                  style={{ width: 480, minWidth: 120 }}
                  strokeColor="orange"
                />
              </Space>

              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <StatValueText>불만</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.veryUnsatisfied ?? 0}
                  style={{ width: 480, minWidth: 120 }}
                  strokeColor="red"
                />
              </Space>
            </Flex>
          </StatCardBody>
        </StatCard>
      </WrapperSection>

      {/* 검색 + 리스트 영역 */}
      <ListWrapper>
        {/* 변경: 검색영역을 중앙에 넓게 배치하기 위해 SearchRow 스타일 사용 */}
        <StatCardHeader>검색으로 피드백 조회하기</StatCardHeader>
        <SearchRow>
          <Input
            placeholder="제목 또는 내용 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchRow>

        {loading && <p>검색 중...</p>}

        <p style={{ color: "#cfcfcf", margin: "12px 0" }}>
          총 {data.total ?? 0}건
        </p>

        <List>
          {data.items.map((feedback) => (
            <Item
              key={feedback._id}
              className={
                String(selectedId) === String(feedback._id) ? "selected" : ""
              }
            >
              <HeaderButton
                onClick={() => onOpenDetail?.(String(feedback._id))}
              >
                <HeaderMain>
                  <TitleText>{feedback.title}</TitleText>
                  <StatusBadge status={feedback.status}>
                    {feedback.status}
                  </StatusBadge>
                </HeaderMain>

                <WriterInfo>
                  <span>{feedback.userName}</span>
                  <span>{feedback.satisfaction}</span>
                </WriterInfo>
              </HeaderButton>
            </Item>
          ))}
        </List>

        {/* 페이지네이션 */}
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageButton
              key={p}
              disabled={p === page}
              onClick={() => setPage(p)}
            >
              {p}
            </PageButton>
          ))}
        </Pagination>
      </ListWrapper>
    </Wrapper>
  );
}
