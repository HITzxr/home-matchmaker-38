import { useApp, type PageType } from '@/context/AppContext';

const tabs: { key: PageType; icon: string; label: string }[] = [
  { key: 'collect', icon: '📋', label: '需求收集' },
  { key: 'manage', icon: '📊', label: '管理' },
  { key: 'square', icon: '📈', label: '广场' },
];

export default function BottomTabs() {
  const { currentPage, setCurrentPage, hasCompletedCollect } = useApp();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-14 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(tab => {
          // 未完成收集时，不让点管理和广场
          const disabled = !hasCompletedCollect && tab.key !== 'collect';
          const active = currentPage === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => !disabled && setCurrentPage(tab.key)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 active:scale-95 ${
                active ? 'tab-active' : disabled ? 'opacity-30 cursor-not-allowed' : 'tab-inactive'
              }`}
              disabled={disabled}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
