import CustomRadio from "../../utils/CustomRadioGroup";
import {
  ButtonGroup,
  CloseButton,
  ContentText,
  DetailContent,
  DetailHeader,
  DetailItem,
  DetailSection,
  DetailTitle,
  Direction,
  EditButton,
  HeaderButton,
  HeaderMain,
  Item,
  List,
  ListWrapper,
  MainContent,
  MainWrapper,
  MetaInfo,
  PageButton,
  Pagination,
  Title,
  TitleText,
  Wrapper,
  WrapperContent,
} from "../../utils/ListPresenter";

export interface ListPresenterProps {
  page: number;
  setUpdate: () => void;
  setPage: (page: number) => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
  selectedList: any;
  setSelectedList: (list: any) => void;
  handleClose: () => void;
  isEditMode: boolean;
  editTitle: string;
  editContent: string;
  editSatisfaction: string;
  SetEditSatisfaction: (editSatisfaction: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  data: any;
  isLoading: boolean;
  isError: boolean;
}

export default function ListPresenter({
  page,
  setPage,
  modal,
  setUpdate,
  setModal,
  selectedList,
  setSelectedList,
  data,
  isLoading,
  isError,
  isEditMode,
  editTitle,
  editContent,
  editSatisfaction,
  SetEditSatisfaction,
  onStartEdit,
  onCancelEdit,
  onTitleChange,
  onContentChange,
  handleClose,
}: ListPresenterProps) {
  const items = data?.feedback ?? [];
  const total = data?.total ?? 0;
  const limit = data?.limit ?? 10;
  const totalPages = Math.ceil(total / limit);
  const isOpenModal = selectedList !== null;
  const selectedresponses = (
    selectedList?.response ??
    selectedList?.responses ??
    []
  ).filter((res: any) => !res?.isDeleted);

  return (
    <Wrapper>
      {data === 0 && <p>등록된 피드백이 없습니다.</p>}
      {isLoading && <p>로딩 중...</p>}
      {isError && <p>데이터를 불러오는데 실패했습니다.</p>}

      <Title>피드백 목록</Title>

      <WrapperContent className={selectedList ? "has-selection" : ""}>
        <div className="list-section">
          <ListWrapper>
            <List>
              {items.map((item: any, index: number) => (
                <Item
                  key={item._id ?? index}
                  className={selectedList?._id === item._id ? "selected" : ""}
                >
                  <HeaderButton
                    onClick={() => {
                      setSelectedList(item);
                      setModal(true);
                    }}
                  >
                    <HeaderMain>
                      <TitleText>{item.title}</TitleText>
                      <MetaInfo>
                        <span>작성자: {item.userName}</span>
                        <span>|</span>
                        <span>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "-"}
                        </span>
                      </MetaInfo>
                    </HeaderMain>
                  </HeaderButton>
                </Item>
              ))}
            </List>
          </ListWrapper>
        </div>

        <div className="detail-section">
          {selectedList && (
            <DetailSection>
              <DetailHeader>
                {isEditMode ? (
                  <input
                    type="text"
                    value={editTitle}
                    required
                    onChange={(e) => onTitleChange(e.target.value)}
                  />
                ) : (
                  <DetailTitle>{selectedList.title}</DetailTitle>
                )}
                {!isEditMode && (
                  <ButtonGroup>
                    <EditButton onClick={onStartEdit}>
                      <span>수정하기</span>
                    </EditButton>
                    <CloseButton onClick={handleClose}>
                      <span>🗙</span>
                    </CloseButton>
                  </ButtonGroup>
                )}

                {isEditMode && (
                  <ButtonGroup>
                    <EditButton onClick={setUpdate}>
                      <span>저장하기</span>
                    </EditButton>
                    <CloseButton onClick={onCancelEdit}>
                      <span>🗙</span>
                    </CloseButton>
                  </ButtonGroup>
                )}
              </DetailHeader>

              <DetailContent>
                <DetailItem>
                  <strong>작성자</strong>
                  <span>{selectedList.userName}</span>
                </DetailItem>

                <DetailItem>
                  <strong>작성일</strong>
                  <span>
                    {selectedList.createdAt
                      ? new Date(selectedList.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                </DetailItem>

                <DetailItem>
                  <strong>만족도 평가</strong>
                  {isEditMode ? (
                    <div>
                      <CustomRadio
                        value="매우만족"
                        selected={editSatisfaction}
                        onChange={SetEditSatisfaction}
                      />
                      <CustomRadio
                        value="만족"
                        selected={editSatisfaction}
                        onChange={SetEditSatisfaction}
                      />
                      <CustomRadio
                        value="보통"
                        selected={editSatisfaction}
                        onChange={SetEditSatisfaction}
                      />
                      <CustomRadio
                        value="불만족"
                        selected={editSatisfaction}
                        onChange={SetEditSatisfaction}
                      />
                      <CustomRadio
                        value="매우 불만족"
                        selected={editSatisfaction}
                        onChange={SetEditSatisfaction}
                      />
                    </div>
                  ) : (
                    <span>{selectedList.satisfaction}</span>
                  )}
                </DetailItem>

                <DetailItem>
                  <strong>내용</strong>
                  {isEditMode ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => onContentChange(e.target.value)}
                      rows={10}
                      required
                    />
                  ) : (
                    <ContentText>{selectedList.content}</ContentText>
                  )}
                </DetailItem>
                {selectedresponses.length > 0 && (
                  <DetailItem>
                    {selectedresponses.map((r: any, i: number) => (
                      <div key={String(r._id ?? i)}>
                        <strong>관리자 답변</strong>
                        <span>이름 : {r.adminName}</span>
                        <br />
                        <span>
                          작성일 : {new Date(r.createdAt).toLocaleString()}
                        </span>
                        <br />
                        <span>내용 : {String(r.text)}</span>
                      </div>
                    ))}
                  </DetailItem>
                )}
              </DetailContent>
            </DetailSection>
          )}
        </div>
      </WrapperContent>

      <Pagination>
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map(
          (p) => (
            <PageButton
              key={p}
              disabled={p === page}
              onClick={() => setPage(p)}
            >
              {p}
            </PageButton>
          ),
        )}
      </Pagination>
    </Wrapper>
  );
}
