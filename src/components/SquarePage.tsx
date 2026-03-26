import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const communities = [
  { name: '融科橄榄城', avgPrice: '7.2万/㎡', trend: '↓2.3%', trendDown: true },
  { name: '保利中央公园', avgPrice: '6.8万/㎡', trend: '↑1.2%', trendDown: false },
  { name: '万科翡翠公园', avgPrice: '8.1万/㎡', trend: '↑0.5%', trendDown: false },
  { name: '中海国际城', avgPrice: '6.5万/㎡', trend: '↓1.1%', trendDown: true },
];

const comparisons = [
  { name: '融科橄榄城 3室', price: '685万', area: '112㎡', tags: ['地铁800m', '对口实验小学'] },
  { name: '万科翡翠公园 3室', price: '780万', area: '125㎡', tags: ['地铁300m', '满五唯一'] },
  { name: '中海国际城 2室', price: '610万', area: '95㎡', tags: ['地铁200m', '次新房'] },
];

const tips = [
  { text: '您关注的"融科橄榄城"降价了 2.3%，是否安排带看？', action: '约看' },
  { text: '根据您的偏好，推荐您关注"保利中央公园"，匹配度 92%。', action: '查看详情' },
];

export default function SquarePage() {
  const { statusCards } = useApp();
  const [tipIndex] = useState(0);
  const viewCount = statusCards.filter(c => c.type === 'view').length;

  return (
    <div className="px-4 pt-6 pb-32 space-y-4">
      <h2 className="text-lg font-bold text-foreground">📈 跟踪广场</h2>

      {/* 关注小区动态 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">关注小区动态</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {communities.map(c => (
            <div key={c.name} className="status-card min-w-[140px] flex-shrink-0 space-y-1">
              <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground">挂牌均价 {c.avgPrice}</p>
              <p className={`text-sm font-bold ${c.trendDown ? 'text-success' : 'text-destructive'}`}>{c.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 服务进度 */}
      <div className="status-card space-y-3">
        <h3 className="text-sm font-semibold text-foreground">服务进度跟踪</h3>
        <div className="flex items-center gap-3">
          <img src="https://picsum.photos/40/40?random=10" alt="" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="text-sm font-medium text-foreground">李华</p>
            <p className="text-xs text-muted-foreground">链家·朝阳门店</p>
          </div>
        </div>
        <div className="space-y-2 border-t border-border pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-foreground">李华约您周六下午 2:00 看房</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">已完成带看 {viewCount} 次</span>
          </div>
        </div>
      </div>

      {/* 竞品对比 */}
      <div className="status-card space-y-3">
        <h3 className="text-sm font-semibold text-foreground">竞品对比看板</h3>
        <div className="space-y-3">
          {comparisons.map(c => (
            <div key={c.name} className="flex items-start justify-between border-b border-border pb-2 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <div className="flex gap-1">
                  {c.tags.map(t => (
                    <span key={t} className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-primary">{c.price}</p>
                <p className="text-xs text-muted-foreground">{c.area}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 智能建议 - 底部固定 */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-40">
        <div className="ai-bubble flex items-center justify-between">
          <p className="text-xs text-foreground flex-1 mr-2">
            <span className="mr-1">✨</span>
            {tips[tipIndex].text}
          </p>
          <button className="btn-primary !py-1.5 !px-3 !text-xs flex-shrink-0">
            {tips[tipIndex].action}
          </button>
        </div>
      </div>
    </div>
  );
}
