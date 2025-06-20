// 직원 타입 정의
export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  memberCount: number;
  status: 'active' | 'leave' | 'resigned';
  approvalDate: string;
  address?: string;
  account?: string;
  workHours?: string;
  memo?: string;
  revenue?: number;
  reRegistrationCount?: number; // 이번달 재등록 회원 수
  gender?: string;
  note?: string;
}

// 직원 가입 요청 타입 정의
export interface StaffRegistration {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'pending' | 'rejected';
  approvalDate: string;
  rejectedDate?: string; // 거절일자
  position?: string;
  address?: string;
  memo?: string;
  account?: string; // 계좌정보 추가
}

// 직원이 담당하는 회원 타입 정의
export interface Member {
  id: string;
  name: string;
  phone: string;
  membershipType: string;
  startDate: string;
  endDate: string;
}

// Mock 직원 데이터
export const staffMockData: Staff[] = [
  {
    id: "ST001",
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim@example.com",
    position: "헬스 트레이너",
    memberCount: 15,
    status: "active",
    approvalDate: "2024-03-15",
    address: "서울시 강남구",
    account: "국민은행 123-456-78910",
    workHours: "09:00-18:00",
    memo: "",
    revenue: 2400000,
    reRegistrationCount: 3,
    gender: "male",
    note: "",
  },
  {
    id: "ST002",
    name: "이영희",
    phone: "010-2345-6789",
    email: "lee@example.com",
    position: "개인레슨 트레이너",
    memberCount: 8,
    status: "leave",
    approvalDate: "2024-02-20",
    address: "서울시 서초구",
    account: "우리은행 234-567-89012",
    workHours: "08:00-17:00",
    memo: "",
    revenue: 1800000,
    reRegistrationCount: 2,
    gender: "female",
    note: "",
  },
  {
    id: "ST003",
    name: "박지민",
    phone: "010-3456-7890",
    email: "park@example.com",
    position: "요가 강사",
    memberCount: 12,
    status: "active",
    approvalDate: "2024-06-01",
    address: "서울시 송파구",
    account: "우리은행 123-456-78910",
    workHours: "10:00-19:00",
    memo: "",
    revenue: 1800000,
    reRegistrationCount: 5,
    gender: "female",
    note: "",
    },
  {
    id: "ST004",
    name: "최준호",
    phone: "010-4567-8901",
    email: "choi@example.com",
    position: "헬스 트레이너",
    memberCount: 0,
    status: "resigned",
    approvalDate: "2023-11-20",
    address: "서울시 동작구",
    account: "하나은행 123-456-78910",
    workHours: "06:00-15:00",
    memo: "",
    revenue: 500000,
    reRegistrationCount: 0,
    revenue: 0,
    gender: "male",
    note: "",
  },
  {
    id: "REG001", // 가입 요청 ID를 그대로 사용
    name: "홍길동",
    phone: "010-9876-5432",
    email: "hong@example.com",
    position: "트레이너",
    memberCount: 0,
    status: "active",
    approvalDate: "2025-06-08", // 가입 승인일을 현재와 유사하게 설정
    address: "서울시 강서구",
    account: "기업은행 123-456-78910",
    workHours: "09:00-18:00",
    memo: "",
    revenue: 0,
    gender: "M",
    note: "",
  },
  {
    id: "REG002", // 가입 요청 ID를 그대로 사용
    name: "김영수",
    phone: "010-8765-4321",
    email: "kim.ys@example.com",
    position: "개인레슨 트레이너",
    memberCount: 0,
    status: "active",
    approvalDate: "2025-06-09", // 가입 승인일을 현재와 유사하게 설정
    address: "서울시 마포구",
    account: "SC은행 123-456-78910",
    workHours: "12:00-21:00",
    memo: "",
    revenue: 0,
    gender: "male",
    note: "",
  }
];

// 직원별 담당 회원 mock 데이터
export const membersMockData: Record<string, Member[]> = {
  "ST001": [
    { id: "M001", name: "김회원", phone: "010-1111-2222", membershipType: "개인레슨 12회", startDate: "2025-01-10", endDate: "2025-07-10" },
    { id: "M002", name: "이회원", phone: "010-2222-3333", membershipType: "개인레슨 24회", startDate: "2025-02-15", endDate: "2025-08-15" },
    { id: "M003", name: "박회원", phone: "010-3333-4444", membershipType: "개인레슨 8회", startDate: "2025-03-01", endDate: "2025-05-01" },
    { id: "M009", name: "송회원", phone: "010-9999-0000", membershipType: "개인레슨 16회", startDate: "2025-04-10", endDate: "2025-07-10" },
    { id: "M010", name: "정회원", phone: "010-0000-1111", membershipType: "개인레슨 30회", startDate: "2025-03-15", endDate: "2025-09-15" },
  ],
  "ST002": [
    { id: "M004", name: "최회원", phone: "010-4444-5555", membershipType: "개인레슨 16회", startDate: "2025-01-05", endDate: "2025-04-05" },
    { id: "M005", name: "정회원", phone: "010-5555-6666", membershipType: "개인레슨 36회", startDate: "2025-02-10", endDate: "2025-11-10" },
    { id: "M011", name: "황회원", phone: "010-1111-2222", membershipType: "개인레슨 12회", startDate: "2025-01-20", endDate: "2025-04-20" },
  ],
  "ST003": [
    { id: "M006", name: "강회원", phone: "010-6666-7777", membershipType: "개인레슨 12회", startDate: "2025-01-15", endDate: "2025-04-15" },
    { id: "M007", name: "조회원", phone: "010-7777-8888", membershipType: "필라테스 클래스", startDate: "2025-02-20", endDate: "2025-05-20" },
    { id: "M008", name: "윤회원", phone: "010-8888-9999", membershipType: "요가 클래스", startDate: "2025-03-05", endDate: "2025-06-05" },
    { id: "M012", name: "추회원", phone: "010-2222-3333", membershipType: "필라테스 클래스", startDate: "2025-02-15", endDate: "2025-05-15" },
  ],
  "REG001": [
    // 홍길동 트레이너의 담당 회원은 아직 없음
  ],
  "REG002": [
    // 김영수 트레이너의 담당 회원은 아직 없음
  ]
};

// 가입 요청 목록 mock 데이터
export const registrationMockData: StaffRegistration[] = [
  {
    id: "REG003",
    name: "이민지",
    phone: "010-7654-3210",
    email: "lee.mj@example.com",
    status: "pending",
    approvalDate: "2025-06-07",
    position: "헬스 트레이너",
    address: "서울시 서초구",
    account: "신한은행 987-654-32109",
    memo: ""
  },
  {
    id: "REG004",
    name: "장하준",
    phone: "010-6543-2109",
    email: "jang@example.com",
    status: "pending",
    approvalDate: "2025-06-08",
    position: "스포츠 마사지사",
    address: "서울시 중구",
    account: "우리은행 876-543-21098",
    memo: ""
  },
  {
    id: "REG005",
    name: "임수진",
    phone: "010-5432-1098",
    email: "lim@example.com",
    status: "rejected",
    approvalDate: "2025-06-01",
    rejectedDate: "2025-06-03",
    position: "에어로빅 강사",
    address: "서울시 양천구",
    account: "국민은행 765-432-10987",
    memo: ""
  },
  {
    id: "REG006",
    name: "최도영",
    phone: "010-4321-0987",
    email: "choi@example.com",
    status: "pending",
    approvalDate: "2025-06-09",
    position: "필라테스 강사",
    address: "서울시 강동구",
    account: "하나은행 654-321-09876",
    memo: ""
  }
];
