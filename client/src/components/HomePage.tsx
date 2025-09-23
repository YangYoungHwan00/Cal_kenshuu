import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleGoToSignUp = () => {
    navigate('/register'); // 회원가입 페이지 경로로 이동
  };

  const handleGoToLogin = () => {
    navigate('/login'); // 로그인 페이지 경로로 이동
  }

  const handleGoToRanking = () => {
    navigate('/ranking'); // 랭킹 페이지 경로로 이동
  }

  return (
    <div>
      <h1>메인 페이지</h1>
      <button onClick={handleGoToSignUp}>
        회원가입 하러 가기
      </button>
      <button onClick={handleGoToLogin}>
        로그인 하러 가기
      </button>
      <button onClick={handleGoToRanking}>
        랭킹
      </button>
    </div>
  );
}

export default HomePage;