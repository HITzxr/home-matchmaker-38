import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

const sections = [
  { key: 'purpose', label: '购房目的', options: ['自住', '投资', '学区'] },
  { key: 'budget', label: '预算区间', options: ['300-500万', '500-800万', '800-1200万'] },
  { key: 'area', label: '意向区域', options: ['朝阳区', '海淀区', '丰台区', '通州区'] },
  { key: 'layout', label: '户型', options: ['1居', '2居', '3居', '4居+'] },
  { key: 'tags', label: '特殊标签', options: ['近地铁', '带学区', '南北通透', '满五唯一'] },
] as const;

type SectionKey = typeof sections[number]['key'];

export default function CollectPage() {
  const { userRequirements, setUserRequirements, setCurrentPage, setHasCompletedCollect } = useApp();

  const [selected, setSelected] = useState<Record<SectionKey, string[]>>({
    purpose: [...userRequirements.purpose],
    budget: [...userRequirements.budget],
    area: [...userRequirements.area],
    layout: [...userRequirements.layout],
    tags: [...userRequirements.tags],
  });
  const [extra, setExtra] = useState(userRequirements.extra);
  const [showAi, setShowAi] = useState(false);

  // 回填已有标签
  useEffect(() => {
    setSelected({
      purpose: [...userRequirements.purpose],
      budget: [...userRequirements.budget],
      area: [...userRequirements.area],
      layout: [...userRequirements.layout],
      tags: [...userRequirements.tags],
    });
    setExtra(userRequirements.extra);
  }, [userRequirements]);

  const toggle = (key: SectionKey, val: string) => {
    setSelected(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  };

  const totalSelected = Object.values(selected).flat().length;

  const handleConfirm = () => {
    setUserRequirements({ ...selected, extra });
    setHasCompletedCollect(true);
    setCurrentPage('manage');
  };

  // 模拟AI补全
  useEffect(() => {
    if (extra.length > 2) {
      const t = setTimeout(() => setShowAi(true), 600);
      return () => clearTimeout(t);
    }
    setShowAi(false);
  }, [extra]);

  const aiText = extra.includes('安静')
    ? '您提到了"安静"，为您推荐低楼层或远离主干道的房源。'
    : extra.includes('学')
    ? '您关注学区，将优先匹配带优质学区的房源。'
    : '已记录您的补充需求，将据此优化推荐。';

  return (
    <div className="px-5 pt-12 pb-24 space-y-6">
      {/* 标题 */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">🏠 告诉我你的找房需求</h1>
        <p className="text-sm text-muted-foreground">选择偏好标签，AI 会帮你精准匹配房源</p>
      </div>

      {/* 标签选择 */}
      {sections.map(sec => (
        <div key={sec.key} className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{sec.label}</h3>
          <div className="flex flex-wrap gap-2">
            {sec.options.map(opt => (
              <button
                key={opt}
                onClick={() => toggle(sec.key, opt)}
                className={`capsule-tag ${selected[sec.key].includes(opt) ? 'capsule-tag-active' : 'capsule-tag-inactive'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 文字补充 */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">补充需求</h3>
        <textarea
          value={extra}
          onChange={e => setExtra(e.target.value)}
          placeholder={'补充需求，如"希望安静不临街"'}
          className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
        />
      </div>

      {/* AI 补全气泡 */}
      {showAi && (
        <div className="ai-bubble animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-sm text-foreground">
            <span className="mr-1">✨</span>
            <span className="font-medium">AI 解析：</span>
            {aiText}
          </p>
        </div>
      )}

      {/* 确认按钮 */}
      <button
        onClick={handleConfirm}
        disabled={totalSelected === 0}
        className="btn-primary w-full"
      >
        确认，进入主页面
      </button>
    </div>
  );
}
