import { AppProvider, useApp } from '@/context/AppContext';
import BottomTabs from '@/components/BottomTabs';
import CollectPage from '@/components/CollectPage';
import ManagePage from '@/components/ManagePage';
import SquarePage from '@/components/SquarePage';

function PageRouter() {
  const { currentPage } = useApp();
  return (
    <>
      {currentPage === 'collect' && <CollectPage />}
      {currentPage === 'manage' && <ManagePage />}
      {currentPage === 'square' && <SquarePage />}
    </>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <div className="mobile-container bg-background min-h-screen">
        <PageRouter />
        <BottomTabs />
      </div>
    </AppProvider>
  );
}
