import { useMemo, useState, useCallback } from 'react';
import { useApp, type StatusCard } from '@/context/AppContext';

// 获取一周的日期
function getWeekDates(weekOffset: number) {
  const now = new Date();
  const day = now.getDay() || 7; // 周日=7
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + 1 + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}

// 相对时间显示
function relativeDay(dateStr: string) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  if (dateStr === today) return '今天';
  if (dateStr === yesterday) return '昨天';
  if (dateStr === tomorrow) return '明天';
  return dateStr.slice(5);
}

const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
  browse: { icon: '👁️', label: '浏览', color: 'text-muted-foreground' },
  favorite: { icon: '❤️', label: '收藏', color: 'text-destructive' },
  consult: { icon: '💬', label: '咨询', color: 'text-accent' },
  visit: { icon: '🤝', label: '面访', color: 'text-warning' },
  view: { icon: '🏠', label: '带看', color: 'text-primary' },
};

export default function ManagePage() {
  const { userRequirements, setCurrentPage, statusCards, deleteCard, selectedDate, setSelectedDate } = useApp();
  const [weekOffset, setWeekOffset] = useState(0);
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const todayStr = new Date().toISOString().split('T')[0];

  // 已看套数
  const viewCount = statusCards.filter(c => c.type === 'view').length;
  const badge = viewCount === 0 ? { text: '刚启动', cls: 'bg-muted text-muted-foreground' }
    : viewCount <= 2 ? { text: '意向中', cls: 'bg-accent text-accent-foreground' }
    : { text: '接近决策', cls: 'bg-warning text-warning-foreground' };

  // 所有标签
  const allTags = [
    ...userRequirements.purpose,
    ...userRequirements.budget,
    ...userRequirements.area,
    ...userRequirements.layout,
    ...userRequirements.tags,
  ];

  // 日期上有卡片的集合
  const datesWithCards = useMemo(() => new Set(statusCards.map(c => c.date)), [statusCards]);

  // 筛选后的卡片
  const filteredCards = useMemo(() => {
    let cards = [...statusCards];
    if (selectedDate) cards = cards.filter(c => c.date === selectedDate);
    return cards.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
  }, [statusCards, selectedDate]);

  const handleWeekChange = useCallback((dir: number) => {
    setWeekOffset(prev => prev + dir);
    setSelectedDate(null);
  }, [setSelectedDate]);

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteCard(id);
      setDeletingId(null);
      setSwipedId(null);
    }, 300);
  }, [deleteCard]);

  // 月份标题
  const monthTitle = (() => {
    const mid = weekDates[3];
    return `${mid.getFullYear()}年${mid.getMonth() + 1}月`;
  })();

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      {/* 用户状态模块 */}
      <div className="status-card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">我的找房偏好</h2>
          <button onClick={() => setCurrentPage('collect')} className="text-sm text-primary active:scale-95 transition-transform">✏️ 编辑</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allTags.length > 0 ? allTags.map(tag => (
            <span key={tag} className="capsule-tag capsule-tag-active text-xs">{tag}</span>
          )) : <span className="text-sm text-muted-foreground">暂未设置偏好</span>}
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <span className="text-sm text-muted-foreground">已看 <span className="font-bold text-foreground">{viewCount}</span> 套房</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.text}</span>
        </div>
      </div>

      {/* 日历区 */}
      <div className="status-card space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={() => handleWeekChange(-1)} className="text-lg active:scale-90 transition-transform">←</button>
          <span className="text-sm font-semibold text-foreground">{monthTitle}</span>
          <button onClick={() => handleWeekChange(1)} className="text-lg active:scale-90 transition-transform">→</button>
        </div>
        <div className="flex justify-between gap-1">
          {weekDates.map((d, i) => {
            const ds = formatDate(d);
            const isSelected = selectedDate === ds;
            const isToday = ds === todayStr;
            const hasCard = datesWithCards.has(ds);
            return (
              <button key={ds} onClick={() => setSelectedDate(isSelected ? null : ds)}
                className={`week-day flex-1 ${isSelected ? 'week-day-active' : ''}`}>
                <span className="text-xs text-muted-foreground">{dayNames[i]}</span>
                <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                  {d.getDate()}
                </span>
                {hasCard && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
        {selectedDate && (
          <button onClick={() => setSelectedDate(null)} className="text-xs text-primary font-medium">
            查看全部 →
          </button>
        )}
      </div>

      {/* 状态卡列表 */}
      <div className="space-y-3">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">暂无记录</div>
        ) : filteredCards.map(card => (
          <div key={card.id}
            className={`relative overflow-hidden ${deletingId === card.id ? 'animate-slide-out' : ''}`}>
            <div className="status-card"
              onClick={() => setSwipedId(swipedId === card.id ? null : card.id)}>
              <CardContent card={card} />
            </div>
            {swipedId === card.id && (
              <div className="flex justify-end mt-1 gap-2 animate-in fade-in duration-200">
                <button onClick={() => handleDelete(card.id)}
                  className="text-xs bg-destructive text-destructive-foreground px-4 py-2 rounded-xl active:scale-95 transition-transform">
                  🗑️ 删除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CardContent({ card }: { card: StatusCard }) {
  const cfg = typeConfig[card.type];
  const day = relativeDay(card.date);

  if (card.type === 'consult') {
    return (
      <div className="flex items-start gap-3">
        <img src={card.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">{card.agentName}</span>
            <span className="text-xs text-muted-foreground">{day} {card.time}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1">{card.lastMessage}</p>
        </div>
        <span className="text-lg">{cfg.icon}</span>
      </div>
    );
  }

  if (card.type === 'visit') {
    return (
      <div className="flex items-start gap-3">
        <img src={card.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-foreground">{card.agentName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${card.status === '已完成' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{card.status}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">📍 {card.location}</p>
          <p className="text-xs text-muted-foreground">{day} {card.time}</p>
        </div>
        <span className="text-lg">{cfg.icon}</span>
      </div>
    );
  }

  // browse, favorite, view
  return (
    <div className="flex gap-3">
      <img src={card.coverUrl} alt="" className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-foreground truncate">{card.houseName}</span>
          <span className="text-lg">{cfg.icon}</span>
        </div>
        <p className="text-primary font-bold text-sm mt-0.5">{card.price}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{day} {card.time}</p>
        {card.type === 'view' && card.agentName && (
          <p className="text-xs text-muted-foreground">经纪人：{card.agentName}</p>
        )}
        {card.type === 'view' && card.aiSummary && (
          <div className="ai-bubble mt-2 !p-2">
            <p className="text-xs text-foreground">✨ {card.aiSummary}</p>
          </div>
        )}
      </div>
    </div>
  );
}
