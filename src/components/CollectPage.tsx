import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';

interface Question {
  key: string;
  bubble: string;
  subText?: string;
  emotionalNote?: string;
  multi: boolean;
  isTextarea?: boolean;
  options?: { emoji: string; label: string }[];
}

const questions: Question[] = [
  {
    key: 'purpose',
    bubble: '🏠 您购房的主要目的是？',
    multi: false,
    options: [
      { emoji: '🏠', label: '自住' },
      { emoji: '📈', label: '投资' },
      { emoji: '🎓', label: '学区' },
      { emoji: '✨', label: '改善' },
    ],
  },
  {
    key: 'budget',
    bubble: '💰 您的购房预算是？',
    multi: false,
    options: [
      { emoji: '💰', label: '300万↓' },
      { emoji: '💵', label: '300-500万' },
      { emoji: '💶', label: '500-800万' },
      { emoji: '💎', label: '800-1200万' },
      { emoji: '🏦', label: '1200万↑' },
    ],
  },
  {
    key: 'districts',
    bubble: '📍 您意向的区域是？',
    subText: '可多选',
    multi: true,
    options: [
      { emoji: '☀️', label: '朝阳区' },
      { emoji: '🌊', label: '海淀区' },
      { emoji: '🌳', label: '丰台区' },
      { emoji: '🚇', label: '通州区' },
      { emoji: '🏞️', label: '昌平区' },
      { emoji: '🌾', label: '大兴区' },
      { emoji: '✨', label: '其他' },
    ],
  },
  {
    key: 'houseType',
    bubble: '🏘️ 您想要的户型是？',
    emotionalNote: '太棒了，我已经大概知道你想要什么样的家了！',
    multi: false,
    options: [
      { emoji: '🛏️', label: '1居' },
      { emoji: '🛏️🛏️', label: '2居' },
      { emoji: '🛏️🛏️🛏️', label: '3居' },
      { emoji: '🏢', label: '4居+' },
    ],
  },
  {
    key: 'area',
    bubble: '📏 您期望的面积是？',
    emotionalNote: '越具体越好，我会帮你精准匹配～',
    multi: false,
    options: [
      { emoji: '📐', label: '50㎡↓' },
      { emoji: '📏', label: '50-70㎡' },
      { emoji: '📐', label: '70-90㎡' },
      { emoji: '📏', label: '90-120㎡' },
      { emoji: '🏢', label: '120㎡↑' },
    ],
  },
  {
    key: 'preferences',
    bubble: '⭐ 哪些是您的必选项？',
    subText: '可多选',
    multi: true,
    options: [
      { emoji: '🚇', label: '近地铁' },
      { emoji: '🎓', label: '带学区' },
      { emoji: '🌞', label: '南北通' },
      { emoji: '✅', label: '满五唯一' },
      { emoji: '🚪', label: '带电梯' },
      { emoji: '🧓', label: '低楼层' },
      { emoji: '🌇', label: '高楼层' },
    ],
  },
  {
    key: 'extra',
    bubble: '📝 还有其他要求吗？',
    subText: '可选',
    multi: false,
    isTextarea: true,
  },
];

type Answers = {
  purpose: string;
  budget: string;
  districts: string[];
  houseType: string;
  area: string;
  preferences: string[];
  extra: string;
};

export default function CollectPage() {
  const { userRequirements, setUserRequirements, setCurrentPage, setHasCompletedCollect } = useApp();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    purpose: userRequirements.purpose,
    budget: userRequirements.budget,
    districts: [...userRequirements.districts],
    houseType: userRequirements.houseType,
    area: userRequirements.area,
    preferences: [...userRequirements.preferences],
    extra: userRequirements.extra,
  });
  const [visible, setVisible] = useState(true);

  // Sync from context when editing
  useEffect(() => {
    setAnswers({
      purpose: userRequirements.purpose,
      budget: userRequirements.budget,
      districts: [...userRequirements.districts],
      houseType: userRequirements.houseType,
      area: userRequirements.area,
      preferences: [...userRequirements.preferences],
      extra: userRequirements.extra,
    });
  }, [userRequirements]);

  const q = questions[step];
  const total = questions.length;

  const currentValue = answers[q.key as keyof Answers];

  const isEnabled = q.isTextarea
    ? true
    : q.multi
      ? (currentValue as string[]).length > 0
      : (currentValue as string) !== '';

  const handleSelect = (label: string) => {
    const key = q.key as keyof Answers;
    if (q.multi) {
      const arr = answers[key] as string[];
      const next = arr.includes(label) ? arr.filter(v => v !== label) : [...arr, label];
      setAnswers(prev => ({ ...prev, [key]: next }));
    } else {
      setAnswers(prev => ({ ...prev, [key]: label }));
    }
  };

  const goTo = (next: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
    }, 200);
  };

  const handleContinue = () => {
    if (step < total - 1) {
      goTo(step + 1);
    } else {
      // Final step
      console.log('用户需求收集结果：', answers);
      setUserRequirements(answers);
      setHasCompletedCollect(true);
      setCurrentPage('manage');
    }
  };

  const handleBack = () => {
    if (step > 0) goTo(step - 1);
  };

  const isSelected = (label: string) => {
    if (q.multi) return (currentValue as string[]).includes(label);
    return currentValue === label;
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`text-xl w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            step === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 active:scale-95'
          }`}
        >
          ‹
        </button>
        <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 min-w-[2.5rem] text-right">{step + 1}/{total}</span>
      </div>

      {/* Content area */}
      <div
        className={`flex-1 flex flex-col px-5 py-4 overflow-y-auto transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        key={step}
      >
        {/* AI avatar + bubble */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
            🦉
          </div>
          <div className="relative bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
            <p className="text-base font-semibold text-gray-800 leading-relaxed">{q.bubble}</p>
            {q.emotionalNote && (
              <p className="text-sm text-blue-500 mt-2 leading-relaxed">{q.emotionalNote}</p>
            )}
            {q.subText && (
              <p className="text-xs text-gray-400 mt-1">{q.subText}</p>
            )}
          </div>
        </div>

        {/* Options or textarea */}
        {q.isTextarea ? (
          <textarea
            value={answers.extra}
            onChange={e => setAnswers(prev => ({ ...prev, extra: e.target.value }))}
            placeholder="例如：安静、车位、小区环境…"
            className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-32 shadow-sm"
          />
        ) : (
          <div className="space-y-3">
            {q.options?.map(opt => {
              const selected = isSelected(opt.label);
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(opt.label)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.97] ${
                    selected
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-200'
                      : 'border-gray-100 bg-white shadow-sm hover:border-gray-200'
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className={`text-base font-medium ${selected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {opt.label}
                  </span>
                  {selected && (
                    <span className="ml-auto text-blue-500 text-lg">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="px-5 pb-6 pt-2">
        <button
          onClick={handleContinue}
          disabled={!isEnabled}
          className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 active:scale-[0.97] ${
            isEnabled
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 hover:bg-blue-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === total - 1 ? '完成' : '继续'}
        </button>
      </div>
    </div>
  );
}
