import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type PageType = 'collect' | 'manage' | 'square';

export interface UserRequirements {
  purpose: string[];
  budget: string[];
  area: string[];
  layout: string[];
  tags: string[];
  extra: string;
}

export interface StatusCard {
  id: string;
  type: 'browse' | 'favorite' | 'consult' | 'visit' | 'view';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  houseName?: string;
  price?: string;
  coverUrl?: string;
  agentName?: string;
  lastMessage?: string;
  avatar?: string;
  location?: string;
  status?: string;
  aiSummary?: string;
}

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  userRequirements: UserRequirements;
  setUserRequirements: (req: UserRequirements) => void;
  statusCards: StatusCard[];
  setStatusCards: React.Dispatch<React.SetStateAction<StatusCard[]>>;
  deleteCard: (id: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  hasCompletedCollect: boolean;
  setHasCompletedCollect: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// 生成相对于今天的日期
const getDate = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const initialCards: StatusCard[] = [
  {
    id: '1',
    type: 'browse',
    date: getDate(0),
    time: '10:30',
    houseName: '融科橄榄城 3室2厅',
    price: '685万',
    coverUrl: 'https://picsum.photos/80/80?random=1',
  },
  {
    id: '2',
    type: 'favorite',
    date: getDate(-1),
    time: '14:00',
    houseName: '保利中央公园 2室1厅',
    price: '520万',
    coverUrl: 'https://picsum.photos/80/80?random=2',
  },
  {
    id: '3',
    type: 'consult',
    date: getDate(1),
    time: '09:00',
    agentName: '李华',
    lastMessage: '您好，朝阳区有几套新上房源，要看看吗？',
    avatar: 'https://picsum.photos/40/40?random=3',
  },
  {
    id: '4',
    type: 'visit',
    date: getDate(0),
    time: '15:00',
    agentName: '王芳',
    location: '链家·朝阳门店',
    status: '待面访',
    avatar: 'https://picsum.photos/40/40?random=4',
  },
  {
    id: '5',
    type: 'view',
    date: getDate(0),
    time: '11:00',
    houseName: '万科翡翠公园 3室2厅',
    price: '780万',
    agentName: '李华',
    aiSummary: '优点：户型方正，得房率高，小区绿化好；建议：核实学区名额，注意西晒问题',
    coverUrl: 'https://picsum.photos/80/80?random=5',
  },
  {
    id: '6',
    type: 'view',
    date: getDate(2),
    time: '14:30',
    houseName: '中海国际城 2室2厅',
    price: '610万',
    agentName: '张明',
    aiSummary: '优点：近地铁5号线，步行3分钟；建议：关注物业费较高问题',
    coverUrl: 'https://picsum.photos/80/80?random=6',
  },
];

const defaultRequirements: UserRequirements = {
  purpose: [],
  budget: [],
  area: [],
  layout: [],
  tags: [],
  extra: '',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('collect');
  const [userRequirements, setUserRequirements] = useState<UserRequirements>(defaultRequirements);
  const [statusCards, setStatusCards] = useState<StatusCard[]>(initialCards);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hasCompletedCollect, setHasCompletedCollect] = useState(false);

  const deleteCard = useCallback((id: string) => {
    setStatusCards(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      userRequirements, setUserRequirements,
      statusCards, setStatusCards,
      deleteCard,
      selectedDate, setSelectedDate,
      hasCompletedCollect, setHasCompletedCollect,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
