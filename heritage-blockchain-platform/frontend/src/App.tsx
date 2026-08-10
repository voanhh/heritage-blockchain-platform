import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { BlockchainRecordsPage } from './pages/BlockchainRecordsPage';
import { DashboardPage } from './pages/DashboardPage';
import { HeritageDetailPage } from './pages/HeritageDetailPage';
import { HeritageListPage } from './pages/HeritageListPage';
import { LoginPage } from './pages/LoginPage';
import { VerificationPage } from './pages/VerificationPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/heritages" element={<HeritageListPage />} />
        <Route path="/heritages/:id" element={<HeritageDetailPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/blockchain" element={<BlockchainRecordsPage />} />
      </Route>
    </Routes>
  );
}

