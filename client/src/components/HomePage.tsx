import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleGoToSignUp = () => {
    navigate('/register'); // 회원가입 페이지 경로로 이동
  };

  return (
    <div>
      <h1>메인 페이지</h1>
      <button onClick={handleGoToSignUp}>
        회원가입 하러 가기
      </button>
    </div>
  );
}

export default HomePage;