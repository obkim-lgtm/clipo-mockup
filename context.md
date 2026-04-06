# Clipo Mockup - 프로젝트 맥락

## 서비스 개요
교사의 서·논술형 평가 업무를 AI로 지원하는 B2B SaaS.
유사 해외 서비스: Pensive(pensive.com/schools), Co-Grader.
환경: PC 중심 웹 / React / OCR / AI 크레딧 과금 / 타겟: 중·고등 교사

## 핵심 플로우
회원가입·교사인증 → 수업 생성 → 평가 설계(성취기준+루브릭) → 답안 업로드 → AI 채점 → 결과 검토·수정 → 세특/행특 생성 → 저장

## 주요 화면
① 교사 홈
② 수업 관리
③ 평가 설계
④ 답안 업로드
⑤ AI 채점
⑥ 학생기록 생성 (세특/행특/창체)
⑦ 학교 관리
⑧ 이용권·크레딧

## 핵심 설계 원칙
- 한 화면 = 한 가지 핵심 행동
- 교사 업무 시간 단축 우선, 예쁜 UI는 그 다음
- 다음 단계가 항상 명확하게 보일 것
- AI 결과는 항상 수정 가능 ("AI 초안 (수정 가능)" 표현 사용, 완성본처럼 보이지 않게)
- Primary 버튼 화면당 1개, 행동 중심 텍스트 (❌ 저장 → ✅ 채점 시작하기)

## 목업 작성 규칙
- 기본 형식: React JSX 컴포넌트 (Tailwind 또는 인라인 스타일)
- 컬러 토큰: primary #4A7FE8 기준, 기존 파일 스타일 그대로 이어받기
- 반드시 포함: 실제 데이터 예시, AI 결과 더미, 빈 상태(empty state), 버튼 클릭 후 흐름
- 기획 논의가 끝나면 바로 코드로 진입 (중간 설명 최소화)

## 벤치마킹 기준
- **Pensive** 참고 포인트: 루브릭 설계 UX, 채점 결과 뷰, 교사 피드백 플로우
- **Co-Grader** 참고 포인트: AI 채점 결과 표현 방식, 수정 인터페이스
- 두 서비스 UX 흐름 참고하되, 한국 교육 현장 언어와 생기부 작성 워크플로우에 맞게 조정

## 피해야 할 것
- 설정 화면처럼 복잡한 UI / 옵션 과다 노출
- AI 결과를 확정값처럼 표현
- 교육 현장과 동떨어진 용어

## 핵심 과제
인증 후 75% 이탈 → **온보딩~value realization 구간이 항상 설계 우선순위**

## 디자인 토큰

### 폰트
- **Pretendard GOV** (행정안전부 공공서체)
- CDN 임포트:
  ```css
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-gov.min.css');
  font-family: 'Pretendard GOV', -apple-system, sans-serif;
  ```

### 타이포그래피 — 실제 사용 위계 (실측 기준)

| 용도 | 크기 | Weight |
|------|------|--------|
| 섹션 타이틀 ("내 수업") | **26px** | SemiBold |
| 카드/항목 제목 | **20px** | SemiBold |
| **기본 (base)** | **16px** | Regular / Medium — 대부분의 텍스트 |
| 레이블, 보조 설명, 메타 | **14px** | Regular / Medium |

- 13px는 거의 사용 안 함
- 텍스트 색상 기본: `#222631` (fg/fg), 보조: `#6d7381` (gray/600)
- 피그마 G/T/B/C 스케일은 시스템 정의용, 실개발 기준은 위 4단계

### 기타 토큰
- `pureBlack`: `#000000`
- `pureWhite`: `#ffffff`
- `shadow_md`: `box-shadow: 0 0 1px #2226314D, 0 4px 8px #0000001A`

### 시멘틱 토큰
| 토큰 | Hex |
|------|-----|
| `fg/fg` (본문 텍스트) | `#222631` |
| `gray/fg` (보조 텍스트) | `#3b3f4c` |
| `text/subtle` | `#808080` |
| `border/border` | `#d9d9d9` |
| `border/emphasized` | `#b3b3b3` |
| `green/subtle` (bg) | `#f1f9f3` |

### Blue (Primary)
| 단계 | Hex |
|------|-----|
| 50 | `#f4f8ff` |
| 100 | `#e9f2ff` |
| 200 | `#ccdfff` |
| 300 | `#a3c3ff` |
| **500 (Primary)** | **`#416bff`** |
| 600 | `#365eef` |
| 700 | `#3151c4` |

> ⚠️ Primary 실측값은 `#416bff` (기존 메모 `#4A7FE8`에서 수정)

### Gray
| 단계 | Hex |
|------|-----|
| 50 | `#f6f7f9` |
| 100 | `#f1f3f5` |
| 200 | `#dde1e8` |
| 300 | `#c7cbd3` |
| 400 | `#b3b6bd` |
| 600 | `#6d7381` |
| 800 | `#3b3f4c` |
| solid | `#222631` |

### Red
| 단계 | Hex |
|------|-----|
| 50 | `#fff3f4` |
| 100 | `#fee2e2` |
| muted | `#fecaca` |
| 500 | `#f2525f` |
| 600 | `#db3e51` |

### Green
| 단계 | Hex |
|------|-----|
| 50 | `#eefcf4` |
| 200 | `#dbf1e0` |
| 300 | `#93e3b9` |
| 500 | `#1ab864` |
| 600 | `#319d64` |
| 700 | `#27724b` |

### Orange
| 단계 | Hex |
|------|-----|
| 50 | `#fff7ed` |
| 100 | `#ffedd5` |
| 200 | `#fed7aa` |
| 300 | `#fdba74` |
| 500 | `#f97316` |
| 600 | `#ea580c` |
| 700 | `#92310a` |

### Yellow
| 단계 | Hex |
|------|-----|
| 100 | `#fef9c3` |
| 200 | `#fef08a` |
| 300 | `#fde047` |
| 600 | `#ca8a04` |
| 900 | `#422006` |

### Purple
| 단계 | Hex |
|------|-----|
| 100 | `#ebdfff` |
| 200 | `#d5bfff` |
| 300 | `#b793f9` |
| 600 | `#6f34db` |
| 700 | `#5d26c4` |

### 보조 컬러 용도
- `red` → 오류, 경고, 삭제
- `green` → 성공, 완료, 통과
- `orange` → 주의, 중간 상태
- `yellow` → 알림, 강조
- `purple` → 보조 레이블, 배지
- `gray` → 텍스트, 비활성, 구분선

## 고정 요소

> ⚠️ **NB v2.0 적용 범위**: 수행평가 채점 등 신규 화면부터 적용.
> 창의적 체험활동(창체) 목업은 기존 CLAUDE.md의 NB v1 스펙을 유지한다.

### 헤더 — Top bar (NB v2.0, 피그마 Design System v2.0 기준)
```
[☰ 40×40] [CLIPO로고 76×16] ──────── [학교 유료] D-180  [✨] AI 크레딧 200  │  최대표 선생님(대표교사) ▾
```
- 높이: **56px**, 배경: `white`, 하단 border 없음 (사이드바가 border-right 담당)
- 좌측: `padding: 0 8px` → ☰ Icon Button(40×40, ghost/gray) + 로고
- 우측: 플랜 배지 + D-일수 + AI 크레딧 + separator + 유저 드롭다운
- **CSS**: `padding: 0; justify-content: space-between`

| 요소 | 스펙 |
|------|------|
| ☰ 버튼 | Icon Button 40×40, `menu` 아이콘 20px, ghost/gray |
| 로고 | 76×16px, `#365EEF` |
| 플랜 배지 | h24, rounded-full(100px), bg `#e9f2ff`, border 1px `#ccdfff`, text 13px Medium `#3151c4` |
| D-일수 | 15px Medium `#222631` |
| AI 크레딧 아이콘 | **`wand-sparkles`** 20px (기존 `bot`에서 변경) |
| AI 크레딧 텍스트 | 15px Medium `#222631` |
| separator | width 0, height 14px, border-left 1px `#dde1e8` |
| 유저 버튼 | 15px Medium `#222631` + `chevron-down` 20px, **border 없음** |

### 왼쪽 사이드바 — Side_menu_Teacher (NB v2.0)
| 상태 | 너비 |
|------|------|
| 접힘 (fold) | **56px** |
| 펼침 (expand) | **222px** (기존 200px에서 변경) |

- 배경: `white`, border-right 1px `#dde1e8` (colors/border/border)
- 메뉴 아이템 `NV_Menu_Icon`:
  - padding: **10px**, gap: **10px**, border-radius: **4px**
  - 아이콘: **20px** (접힘 시 Icon Button 40×40 안에 중앙 배치)
  - 레이블: **15px Medium** `#3b3f4c` (colors/gray/fg)
  - 선택 시: bg `#e9f2ff` (colors/blue/subtle), 레이블 **15px SemiBold** `#3151c4` (colors/blue/fg)
- 그룹 간 구분: divider 1px `#dde1e8`

**메뉴 항목 (NB v2.0 기준, 창체 미포함):**
| 그룹 | 아이콘 | 레이블 |
|------|--------|--------|
| ① 메인 | `home` | 홈 |
| | `scissors` | 평가계획 |
| *(divider)* | | |
| ② 수업 | `clipboard-list` | 수업 |
| *(divider)* | | |
| ③ 도구 | `zap` | 세특 간편 생성기 (Beta) |
| | `refresh-cw` | 행동특성 및 종합기록 지원 |
| | `bar-chart-2` | 리포트 |
| | `building-2` | 학교 설정 |
| *(divider — footer)* | | |
| ④ 하단 | `file-down` | 매뉴얼 다운로드 |
| | `credit-card` | 요금제 |
| | `circle-help` | 고객센터 |

> **창의적 체험활동**: 향후 배포 시 ③ 도구 그룹에 추가 예정. 현재 채점/수행평가 화면에는 미포함.

### 아이콘 시스템
- **Lucide Icons** (`lucide-react`) — 피그마 Icon,Asset 페이지와 동일한 세트
- 목업 코드에서 `import { IconName } from 'lucide-react'` 로 사용
- 새로운 아이콘 라이브러리 추가 금지, Lucide 내에서만 선택

## 화면별 컴포넌트 스펙 (피그마 실측)

### 모달 공통 구조
| 항목 | 값 |
|------|-----|
| 모달 너비 | **672px** |
| 모달 헤더(Dialog) 높이 | **63px** |
| 헤더 텍스트 | 20px SemiBold `#222631` |
| 닫기(X) 버튼 | 우상단 고정 |
| Body 좌우 패딩 | **24px** |
| Body 상단 패딩 | **8px** |
| 섹션 타이틀 | 14px Medium `#222631` — 항목 간 간격 32px |
| 배경 오버레이 | `rgba(0,0,0,0.4)` |
| border-radius | **12px** |

---

### AI 채점 실행 모달 (1/2) — 채점 설정
피그마 노드: `302:2751` (신규), `305:1936` (재채점)

**구성 요소 (위→아래):**

**① AI Assistant 채점 모델** — Radio Card 3개
| 모델 | 설명 |
|------|------|
| v3.0 | 자료 해석이 필요한 복합형 채점에 적합 `Beta` 배지 |
| v2.2 | 일반적인 서·논술형 채점에 적합 ← **기본 선택** |
| v1.0 | 단일 문항형 채점에 적합 |

- Radio Card: 전체 너비 624px, border `1px solid #d9d9d9`, radius `8px`
- 선택 시: border `2px solid #416bff`, radio dot 파란색
- 섹션 제목 우측에 `circle-help` 아이콘 (Lucide, 20px)

**② 채점 수준** — 슬라이더
- 신규 채점: `관대하게` / `기본값` / `엄격하게`
- 재채점: `이전보다 관대` / `이전과 유사` / `이전보다 엄격`
- 기본 위치: 중앙(기본값)

**③ 학생 피드백 구성** — Radio 2개
- `선생님이 직접 작성` (기본 선택)
- `자동 구성` + Select 드롭다운 (`채점 근거 기반 자동 구성`)

**버튼:** `다음으로 >` — Primary, 112×40px, 우하단, Lucide `chevron-right` 아이콘

---

### AI 채점 실행 모달 (2/2) — 학생 선택
피그마 노드: `302:2851`

**테이블 구조:**
| 컬럼 | 너비 | 내용 |
|------|------|------|
| 선택 (체크박스) | 98px | 전체선택 체크박스 |
| 학번 | 80px | |
| 이름 | 100px | |
| AI 채점 결과 | 100px | `-` / `미제출` / `채점 실패`(red) |
| 선생님 채점 결과 | 124px | Badge |

- 테이블 헤더 높이: **40px**, 배경 `#f6f7f9`, 텍스트 14px Medium
- 테이블 행 높이: **48px**
- 미제출 학생 행: 텍스트 color `#b3b6bd` (gray/400), 체크박스 비활성

**Badge 종류 (선생님 채점 결과):**
| 배지 | 색상 | 의미 |
|------|------|------|
| `미채점` | orange subtle bg + orange text | 채점 전 |
| `완료` | green subtle bg + green text | 채점 완료 |
| `확인 필요` | red subtle bg + red text | AI 채점 실패 후 교사 확인 필요 |

**하단 버튼:**
- 좌: `< 이전으로` — ghost/outline 버튼
- 우: `AI 채점 실행 (N)` — Primary, Lucide `zap` 아이콘, 선택 학생 수 표시

---

### 컴포넌트 실측 스펙 (피그마 Components 페이지 기준)

#### Button
| 타입 | 높이 | radius | padding | fill |
|------|------|--------|---------|------|
| solid (primary) | **40px** | **4px** | 10/16 (상하/좌우) | `#365eef` |
| outline | 40px | 4px | 10/16 | transparent, border 1px |
| subtle | 40px | 4px | 10/16 | `#e9f2ff` |
| roundfull 변형 | 40px | **9999px** | 10/16 | — |
- 아이콘+텍스트 gap: **8px**
- 텍스트: 14px SemiBold white (solid), 14px SemiBold `#365eef` (outline/subtle)

#### Input
| 상태 | 높이 | radius | padding |
|------|------|--------|---------|
| Default | **40px** | **4px** | 좌우 12px |
| Typing (focus) | 40px | 4px | 좌우 12px, border `#416bff` |
| Error | 40px | 4px | 좌우 12px, border `#f2525f` |
| Disabled | 40px | 4px | bg `#f6f7f9` |
- 기본 border: 1px solid `#d9d9d9`
- placeholder 색상: `#b3b6bd`
- 텍스트: 14px Regular `#222631`

#### Badge
| 사이즈 | 높이 | radius | padding |
|--------|------|--------|---------|
| sm | **20px** | **4px** | 좌우 6px |
| xs | 18px | 4px | 좌우 4px |
- type: `solid` / `subtle` / `surface` / `outline`
- 텍스트: 12px Medium

#### Checkbox
| 사이즈 | 높이 | 박스 크기 |
|--------|------|---------|
| md (기본) | 20px | 18×18px |
| sm | 19px | 16×16px |
- 선택: bg `#416bff`, border `#416bff`, white 체크
- 미선택: bg white, border 1px `#d9d9d9`
- error: border `#f2525f`
- radius: **4px**

#### Radio
| 사이즈 | 높이 |
|--------|------|
| md (기본) | 20px |
| sm | 19px |
| lg | 24px |
- 선택: 내부 dot `#416bff`
- 미선택: border 1px `#d9d9d9`

#### Tabs (필터형)
- 높이: **45px**, radius: 12px (탭 컨테이너)
- 활성 탭: bg `#416bff`, text white, SemiBold
- 비활성 탭: bg transparent, text `#6d7381`
- 구분선: 1px `#d9d9d9`

#### Alert / Banner
- 높이: **78px** (기본 2줄), radius: **2px**
- padding: T16 R24 B16 L16
- type: `subtle`(연한 bg) / `surface`(흰 bg+border) / `solid`(진한 bg)
- 색상: info(blue) / success(green) / warning(orange) / error(red)

#### Radio Card (AI 모델 선택 등)
- 전체 너비: **624px**, radius: **8px**
- border: 1px solid `#d9d9d9` (기본) / 2px solid `#416bff` (선택)
- padding: 16px 내외
- 선택 표시: 우측 Radio dot (파란색)

## 레이아웃 시스템 (피그마 Design System v2.0, Nv_teacher_template 기준)

### 전체 레이아웃
| 상태 | 전체 크기 | 사이드바 너비 | 콘텐츠 영역 |
|------|----------|------------|-----------|
| 접힘 (fold) | 1440×888px | **56px** | 1384px |
| 펼침 (expand) | 1440×880px | **222px** | 1218px |

- 헤더 고정 높이: **56px** → 콘텐츠 영역 실제 높이: fold 832px / expand 824px
- 콘텐츠 영역 좌우 패딩: **28px** (Page Header 기준)
- 사이드바 border: right 1px `#dde1e8`

### Page Header 패턴
| 타입 | 전체 높이 | 패딩 |
|------|----------|------|
| 기본 (타이틀만) | **111px** | T28 R0 B28 L0 |
| 뒤로가기 버튼 포함 | **122px** | T20 R0 B20 L0 |

- Page Header 너비: **1248px** (콘텐츠 영역 내)
- 타이틀 텍스트: 26px SemiBold `#222631`

### Dialog (모달) 치수
| 컴포넌트 | 크기 | 패딩 |
|----------|------|------|
| Dialog 헤더 (Basic Modal) | 672×63px | T24 R24 B16 L24 |
| Dialog 푸터 | — | T8 R24 B16 L24 |
| Dialog_Confirm (소형) | 384×266px | T28 R20 B28 L20 |

- Dialog border-radius: **12px**
- 배경 오버레이: `rgba(0,0,0,0.4)`
- 닫기(X) 버튼: 헤더 우상단 고정

### Template 섹션 구성 (참조 목록)
`NV_components` · `Nv_teacher_template` · `Card` · `Page_Header` · `Header Title` · `Dialog` · `설계` · `세특` · `Padding&Gap` · `Home_Teacher` · `Plan`

---

## 작업 이력
- (작업하며 채워넣기)
