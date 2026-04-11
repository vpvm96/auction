export type AuctionType = 'apartment' | 'car' | 'officetel' | 'house' | 'commercial' | 'land' | 'equipment' | 'other'

export interface AuctionItem {
  id: string
  type: AuctionType
  title: string
  address: string
  court: string
  caseNumber: string
  auctionDate: string
  appraisalPrice: number
  minimumBid: number
  bidRatio: number
  failedBids: number
  area: number
  thumbnailUrl: string
  imageUrls: string[]
  /** 투자등급 (예: "A+", "A", "B", "C") */
  investmentRating?: string
  /** 투자 종합 점수 */
  investmentScore?: number
  /** 시세 괴리율 — 음수 = 시세 대비 저렴 (예: -18.5) */
  marketGapRate?: number
  /** 시세 괴리 등급 */
  marketGapGrade?: string
  /** 최근 실거래가 (원) */
  latestTradeAmount?: number
  /** 최근 실거래 날짜 */
  latestTradeDate?: string
}

export interface AuctionStats {
  realEstate: { count: number; change: number }
  personal: { count: number; change: number }
}

export const MOCK_STATS: AuctionStats = {
  realEstate: { count: 19135, change: 611 },
  personal: { count: 561, change: 31 },
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  date: string
  type: 'auction' | 'system'
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: '관심 물건 경매 D-1',
    body: '서울 강남구 역삼동 아파트 경매가 내일(3월 25일) 예정되어 있습니다.',
    date: '2026-03-24',
    type: 'auction',
  },
  {
    id: '2',
    title: '낙찰가율 하락 알림',
    body: '관심 지역 아파트 평균 낙찰가율이 78.3%로 하락했습니다.',
    date: '2026-03-22',
    type: 'auction',
  },
  {
    id: '3',
    title: '새 경매 물건 등록',
    body: '서울 마포구에 새로운 오피스텔 경매 물건이 등록되었습니다.',
    date: '2026-03-20',
    type: 'auction',
  },
  {
    id: '4',
    title: '서비스 점검 안내',
    body: '3월 25일 새벽 02:00~04:00 서비스 점검이 예정되어 있습니다. 해당 시간에는 서비스 이용이 불가합니다.',
    date: '2026-03-18',
    type: 'system',
  },
  {
    id: '5',
    title: '이용약관 변경 안내',
    body: '2026년 4월 1일부터 서비스 이용약관이 일부 변경됩니다. 자세한 내용을 확인해주세요.',
    date: '2026-03-15',
    type: 'system',
  },
]

export interface CourtItem {
  id: string
  name: string
  region: string
}

export const MOCK_COURTS: CourtItem[] = [
  { id: 'seoul-central', name: '서울중앙지방법원', region: '서울' },
  { id: 'seoul-east', name: '서울동부지방법원', region: '서울' },
  { id: 'seoul-west', name: '서울서부지방법원', region: '서울' },
  { id: 'seoul-south', name: '서울남부지방법원', region: '서울' },
  { id: 'seoul-north', name: '서울북부지방법원', region: '서울' },
  { id: 'incheon', name: '인천지방법원', region: '인천' },
  { id: 'suwon', name: '수원지방법원', region: '경기' },
  { id: 'seongnam', name: '수원지방법원 성남지원', region: '경기' },
  { id: 'uijeongbu', name: '의정부지방법원', region: '경기' },
  { id: 'daejeon', name: '대전지방법원', region: '대전' },
  { id: 'cheonan', name: '대전지방법원 천안지원', region: '충남' },
  { id: 'daegu', name: '대구지방법원', region: '대구' },
  { id: 'busan', name: '부산지방법원', region: '부산' },
  { id: 'gwangju', name: '광주지방법원', region: '광주' },
]

export interface NewsArticle {
  id: string
  title: string
  date: string
  source: string
  category: string
  body: string
}

export const MOCK_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: '"대출 이자 더는 감당 못해"... 지난해 서울 아파트 경매 역대 최고치',
    date: '2026-03-20',
    source: '조선일보',
    category: '부동산 경매',
    body: '지난해 서울 아파트 법원경매 건수가 역대 최고치를 기록한 것으로 나타났다. 금리 인상 이후 이자 부담을 이기지 못한 집주인들이 경매로 내몰리는 사례가 급증한 탓이다.\n\n법원 경매 전문 업체 자료에 따르면 2025년 서울 아파트 경매 진행 건수는 총 1만 2,847건으로 집계됐다. 이는 전년 대비 38% 증가한 수치로, 통계를 집계하기 시작한 이래 가장 많은 수치다.\n\n전문가들은 "고금리 장기화로 인해 원리금 상환 부담이 커지면서 버티지 못하는 집주인이 늘고 있다"며 "특히 2021~2022년에 고점에서 매수한 수요자들이 직격탄을 맞고 있다"고 분석했다.\n\n낙찰가율도 하락세를 보이고 있다. 지난해 서울 아파트 평균 낙찰가율은 78.3%로, 2024년의 84.1%에 비해 5.8%포인트 떨어졌다. 이는 경매 시장에 물건이 넘쳐나면서 입찰 경쟁이 완화된 결과로 해석된다.\n\n다만 일부 전문가들은 "경매 물건 급증이 오히려 실수요자에게는 기회가 될 수 있다"며 "권리 분석만 잘 한다면 시세보다 저렴하게 내 집 마련이 가능하다"고 조언했다.',
  },
  {
    id: '2',
    title: '법원경매 물건 수 역대 최고치 경신, 2월 기준 2만건 돌파',
    date: '2026-03-15',
    source: '한국경제',
    category: '법원 경매',
    body: '전국 법원경매 물건 수가 2월 기준으로 2만 건을 돌파하며 역대 최고치를 경신했다. 이는 2023년 2월 대비 약 2배 수준으로, 부동산 시장 침체와 고금리의 영향으로 풀이된다.\n\n경매 정보 플랫폼 분석에 따르면 2026년 2월 말 기준 전국 법원경매 진행 중인 물건 수는 2만 1,345건으로 집계됐다. 이 중 아파트가 8,721건(40.9%)으로 가장 많았고, 단독·다가구주택 4,532건(21.2%), 토지 3,218건(15.1%), 상업용 부동산 2,876건(13.5%) 순이었다.\n\n지역별로는 경기도가 6,234건으로 가장 많았으며, 서울 3,891건, 인천 1,748건이 뒤를 이었다. 수도권 물건이 전체의 55.9%를 차지했다.\n\n경매 시장 전문가는 "금리 인상 이후 버티던 집주인들이 이제 한계에 달하고 있다"며 "올 상반기까지는 경매 물건 수 증가 추세가 계속될 것"으로 전망했다.\n\n반면 낙찰률은 29.4%로 전년 동월 대비 3.2%포인트 하락했다. 물건은 늘었지만 투자 심리 위축으로 실제 낙찰로 이어지는 경우는 줄어든 것이다.',
  },
  {
    id: '3',
    title: '강남 오피스텔 경매 낙찰가율 85% 회복, 투자 수요 증가',
    date: '2026-03-10',
    source: '매일경제',
    category: '부동산 투자',
    body: '서울 강남권 오피스텔 법원경매 낙찰가율이 85%를 넘어서며 회복세를 보이고 있다. 전세 수요 증가와 임대 수익률 개선이 맞물리며 투자 수요가 살아나고 있다는 분석이다.\n\n경매 데이터에 따르면 2026년 1~2월 강남3구(강남·서초·송파) 오피스텔 경매 낙찰가율은 평균 85.7%를 기록했다. 이는 작년 하반기 평균 79.3%에서 6.4%포인트 상승한 수치다.\n\n특히 역세권 소형 오피스텔의 인기가 높았다. 강남구 역삼동 소재 전용 33㎡ 오피스텔은 감정가 2억 4,000만 원에 대해 2억 2,500만 원(낙찰가율 93.8%)에 낙찰됐다. 이 물건에는 12명이 입찰에 참여했다.\n\n전문가들은 "고금리로 인한 전세 수요 증가와 임대료 상승이 오피스텔 투자 매력도를 높이고 있다"며 "특히 강남권 역세권 오피스텔은 공실 리스크가 낮아 선호도가 높다"고 설명했다.\n\n다만 권리 분석을 소홀히 하면 낭패를 볼 수 있다는 점도 강조됐다. 일부 물건의 경우 임차인의 대항력이나 가처분 등이 설정되어 있어 낙찰 후 분쟁이 발생하는 사례도 있어 주의가 필요하다.',
  },
]

export const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: '1',
    type: 'apartment',
    title: '서울 강남구 역삼동 아파트',
    address: '서울특별시 강남구 역삼동 123-45 역삼아이파크 101동 1502호',
    court: '서울중앙지방법원',
    caseNumber: '2024타경12345',
    auctionDate: '2026-03-25',
    appraisalPrice: 1200000000,
    minimumBid: 960000000,
    bidRatio: 80,
    failedBids: 1,
    area: 84.9,
    thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
  },
  {
    id: '2',
    type: 'house',
    title: '경기 성남시 분당구 단독주택',
    address: '경기도 성남시 분당구 정자동 456-78',
    court: '수원지방법원 성남지원',
    caseNumber: '2024타경67890',
    auctionDate: '2026-03-26',
    appraisalPrice: 850000000,
    minimumBid: 595000000,
    bidRatio: 70,
    failedBids: 2,
    area: 132.6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
  },
  {
    id: '3',
    type: 'officetel',
    title: '서울 마포구 합정동 오피스텔',
    address: '서울특별시 마포구 합정동 789-12 합정오피스텔 502호',
    court: '서울서부지방법원',
    caseNumber: '2024타경11111',
    auctionDate: '2026-03-24',
    appraisalPrice: 280000000,
    minimumBid: 196000000,
    bidRatio: 70,
    failedBids: 3,
    area: 36.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  },
  {
    id: '4',
    type: 'car',
    title: '2021년식 BMW 530i',
    address: '경기도 화성시 동탄',
    court: '수원지방법원',
    caseNumber: '2024타경22222',
    auctionDate: '2026-03-27',
    appraisalPrice: 45000000,
    minimumBid: 31500000,
    bidRatio: 70,
    failedBids: 1,
    area: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
  },
  {
    id: '5',
    type: 'commercial',
    title: '서울 송파구 잠실동 상가',
    address: '서울특별시 송파구 잠실동 321-65 잠실상가 B101호',
    court: '서울동부지방법원',
    caseNumber: '2024타경33333',
    auctionDate: '2026-03-28',
    appraisalPrice: 620000000,
    minimumBid: 434000000,
    bidRatio: 70,
    failedBids: 2,
    area: 55.3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'],
  },
  {
    id: '6',
    type: 'land',
    title: '충남 천안시 서북구 토지',
    address: '충청남도 천안시 서북구 성환읍 777-88',
    court: '대전지방법원 천안지원',
    caseNumber: '2024타경44444',
    auctionDate: '2026-03-25',
    appraisalPrice: 185000000,
    minimumBid: 129500000,
    bidRatio: 70,
    failedBids: 0,
    area: 450.0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800'],
  },
  {
    id: '7',
    type: 'apartment',
    title: '인천 연수구 송도동 아파트',
    address: '인천광역시 연수구 송도동 555-99 더샵 203동 805호',
    court: '인천지방법원',
    caseNumber: '2024타경55555',
    auctionDate: '2026-03-26',
    appraisalPrice: 720000000,
    minimumBid: 576000000,
    bidRatio: 80,
    failedBids: 1,
    area: 101.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
  },
  {
    id: '8',
    type: 'equipment',
    title: '굴삭기 두산 DX300LC',
    address: '경기도 파주시 문산읍',
    court: '의정부지방법원',
    caseNumber: '2024타경66666',
    auctionDate: '2026-03-24',
    appraisalPrice: 38000000,
    minimumBid: 26600000,
    bidRatio: 70,
    failedBids: 0,
    area: 0,
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400',
    imageUrls: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'],
  },
]
