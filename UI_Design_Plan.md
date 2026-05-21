# [KTAS Smart Emergency Room Triage & Resource Management System] UI Design Plan

## 1. Objective
응급실의 긴박한 환경에서도 의료진이 신속하고 정확하게 환자를 분류하고 자원을 관리할 수 있도록 **직관적이고 정보 집약적인 UI/UX**를 설계합니다.

---

## 2. 디자인 가이드라인 (Design Guidelines)
- **Primary Color:** Navy (#1A2B4C) - 신뢰감과 안정을 주는 전문적인 톤
- **Urgency Colors (KTAS Standard):**
    - **Grade 1 (Resuscitation):** Red (#E53E3E)
    - **Grade 2 (Emergent):** Orange (#ED8936)
    - **Grade 3 (Urgent):** Yellow (#F6E05E)
    - **Grade 4 (Less Urgent):** Green (#48BB78)
    - **Grade 5 (Non-Urgent):** Blue (#4299E1)
- **Typography:** 읽기 쉬운 Sans-serif 계열 (Pretendard 등)

---

## 3. 핵심 화면 설계 (Key View Designs)

### 3.1. 통합 대시보드 (Patient Flow-centric Dashboard)
- **우선순위 지표:** 응급 등급별 대기 환자 수, 평균 대기 시간, 최근 분류 환자 리스트.
- **중앙 환자 리스트:** KTAS 등급(1~5)과 대기 시간을 복합 연산하여 정렬된 '진료 우선순위 큐'.
- **상태 카드:** 현재 총 환자 수, 중증 환자 수(Grade 1, 2), 가용 병상 수 요약.
- **실시간 알림:** 신규 분류 환자 및 상태 악화 위험 환자 팝업 알림.

### 3.2. 지능형 Triage (Simplified Sequential Selection)
- **빠른 분류 시스템:** 바이탈 사인 등 복잡한 입력 없이 '대분류 > 중분류 > 세부 증상' 선택만으로 즉각 추천 등급 도출.
- **계층적 선택 UI:** 인터렉티브 버튼/카드 레이아웃.
- **즉각 피드백:** 선택 시 우측 사이드바에 실시간 추천 등급 및 분류 근거(Reference) 노출.
- **단축 버튼:** 빈번하게 발생하는 증상(흉통, 호흡곤란, 외상 등)에 대한 'Quick Access' 버튼 배치.

### 3.3. 리소스 맵 (Bed/Room Visualizer)
- **2D 플로어 플랜:** 응급실 구역별 병상 상태(사용 중, 예약, 청소 중, 가용) 시각화.
- **카드형 상세 정보:** 병상 클릭 시 해당 환자의 간단한 차트(KTAS 등급, 입실 시간) 오버레이.

---

## 4. 구현 및 검증 계획 (Implementation & Verification)

### Step 1: 레이아웃 프로토타입 (HTML/CSS/JS)
- React(Next.js) 환경에서 레이아웃 컴포넌트 구조 잡기.
- Tailwind CSS 또는 CSS Modules를 활용하여 일관된 스타일 적용.

### Step 2: 인터렉티브 Triage 로직 구현
- KTAS 데이터 구조(JSON) 기반의 동적 선택 로직 구현.
- 등급 판정 엔진(Grade Recommender) 개발.

### Step 3: 실시간 리소스 시각화
- SVG 또는 Canvas를 활용한 병상 맵 인터페이스 구현.
- 상태 변화에 따른 실시간 애니메이션 및 색상 변경 적용.

---

## 5. 결론
본 설계를 통해 의료진은 복잡한 조작 없이도 정확하게 환자를 분류하고, 대시보드를 통해 응급실 전체의 환자 흐름을 한눈에 파악하여 최적의 진료 의사결정을 내릴 수 있습니다.
