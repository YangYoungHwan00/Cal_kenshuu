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
      <h1>Home</h1>
      <button onClick={handleGoToSignUp}>
        会員登録
      </button>
      <button onClick={handleGoToLogin}>
        ログイン
      </button>
      <button onClick={handleGoToRanking}>
        ランキング
      </button>
    </div>
  );
}

export default HomePage;