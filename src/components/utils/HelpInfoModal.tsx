import { Modal } from "antd";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpInfoModal({ isOpen, onClose }: HelpModalProps) {
  const handleOk = () => {
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      className="custom-help-modal"
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText="확인"
      cancelButtonProps={{ style: { display: "none" } }} // 👈 취소 버튼 숨기기
    >
      <div className="custom-help-body">
        <h3>🎬 영화 예매 사이트 안내</h3>

        <p>
          TMDB API 기반으로 제작된 포트폴리오 데모이며, 실제 결제/예매는
          진행되지 않습니다.
          <br />
          테스트 계정으로 자유롭게 이용해보세요
        </p>
        <br />
        <span> 주요 기능</span>
        <ul style={{ listStyle: "none", paddingLeft: 24, margin: 0 }}>
          <li>
            🔍 <strong>검색:</strong> 영화/방송 통합 검색 + 자동완성
          </li>
          <li>
            🎟 <strong>예매:</strong> 시간 선택 후 예매 내역 확인
          </li>
          <li>
            ❤️ <strong>즐겨찾기:</strong> 관심 콘텐츠 저장 및 관리
          </li>
          <li>
            👤 <strong>마이페이지:</strong> 프로필 수정 / 예매내역 / 즐겨찾기
          </li>
          <li>
            📝 <strong>피드백:</strong> 마이페이지에서 피드백 작성 및 수정/삭제
          </li>
        </ul>

        <br />

        <span> 사용 방법</span>
        <ul style={{ listStyle: "none", paddingLeft: 24, margin: 0 }}>
          <li style={{ listStyleType: "none" }}>
            1. 상단 검색창에서 영화/방송 검색
          </li>
          <li style={{ listStyleType: "none" }}>
            2. 영화 상세 페이지에서 예매 진행
          </li>
          <li style={{ listStyleType: "none" }}>
            3. 마이페이지에서 내 활동 확인
          </li>
        </ul>

        <br />

        <span> 안내</span>
        <ul style={{ listStyle: "none", paddingLeft: 24, margin: 0 }}>
          <li style={{ listStyleType: "none" }}>
            🔒 개인정보 보호를 위해 소셜 로그인은 지양해주세요.
          </li>
          <li style={{ listStyleType: "none" }}>
            🛠 관리자 계정은 보안상 공개하지 않습니다.
          </li>
          <li>
            📝 <strong>마이 페이지 &gt; 소중한 의견 보내기</strong> 에서 사이트
            이용 후 <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;사용경험과 개선할 부분을
            남겨주시면 감사하겠습니다.
          </li>
        </ul>
      </div>
    </Modal>
  );
}
