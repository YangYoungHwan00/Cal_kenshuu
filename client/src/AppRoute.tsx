import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import PhaserGameContainer from './components/PhaserGameContainer';
import RankingPage from './components/RankingPage';

const AppRoutes = () => {
  return (
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/game" element={<PhaserGameContainer />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    
  );
};

export default AppRoutes;