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
import { Progress, Tooltip } from "antd";

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
  const totalPages = Math.ceil(data?.total / data?.limit);

  return (
    <Wrapper>
      <Title>피드백 관리자 페이지</Title>

      <WrapperSection>
        <StatCard>
          <StatCardHeader>요약 통계</StatCardHeader>
          <StatCardBody>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
                gap: 16,
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
                    alignItems: "center",
                    textAlign: "center",
                    minWidth: 120,
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
                    alignItems: "center",
                    textAlign: "center",
                    minWidth: 120,
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

        <StatCard>
          <StatCardHeader>세부 만족도</StatCardHeader>
          <StatCardBody>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <StatValueText>매우 만족</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.verySatisfied ?? 0}
                  style={{ flex: 1, minWidth: 180 }}
                  strokeColor="#52c41a"
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <StatValueText>만족</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.satisfied ?? 0}
                  style={{ flex: 1, minWidth: 180 }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <StatValueText>보통</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.neutral ?? 0}
                  style={{ flex: 1, minWidth: 180 }}
                  strokeColor="orange"
                />
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <StatValueText>불만</StatValueText>
                <Progress
                  percent={processedStats?.satisfaction?.veryUnsatisfied ?? 0}
                  style={{ flex: 1, minWidth: 180 }}
                  strokeColor="red"
                />
              </div>
            </div>
          </StatCardBody>
        </StatCard>
      </WrapperSection>

      <ListWrapper>
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
