# 창의적 체험활동 (창체) 목업 — 이어받기 문서

> 새 채팅 시작 시 이 문서 내용을 같이 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-05-08

---

## 현재 작업 목적
교사용 SaaS CLIPO의 **창의적 체험활동 기록 생성** 기능 목업.
교사가 학생 활동 자료(설문/활동지/관찰 키워드)를 등록하고 AI가 누가기록 초안을 만들어주는 워크플로우.

**5월 중순 배포 목표** — 기능 확장보다 **사용자 편의성**과 **혼란 제거** 우선.

**진행 중인 핵심 흐름**: `자율/진로/봉사/동아리 활동 카드` → 통합 입력 페이지 → 3단계 (자료 입력 → 콘텐츠 요소 선택 → 기록 확인) + 자료 등록 상세 페이지 (활동 키워드 / 설문 응답)

---

## 배포 환경

- **GitHub**: `obkim-lgtm/clipo-mockup`
- **Pages URL**: https://obkim-lgtm.github.io/clipo-mockup/
- **로컬 작업 경로**: PC마다 드라이브 문자 다름
  - 옥빈 본 PC: `F:\내 드라이브\Claude\clipo_mockup\`
  - 다른 PC(G드라이브): `G:\내 드라이브\Claude\clipo_mockup\`
  - Mac: `/Volumes/GoogleDrive/내 드라이브/...` 또는 `~/Library/CloudStorage/GoogleDrive-*/내 드라이브/...`
- **로컬 미리보기**: `preview_start('clipo-mockup')` → 포트 3457
  - 새 PC에서 Python 미설치면 `winget install Python.Python.3.12` 등 설치 필요
  - `~/.claude/launch.json` 또는 `C:\Users\<user>\.claude\launch.json`에 본인 PC 드라이브 경로로 설정 (싱크된 `.claude/launch.json`은 옥빈 본 PC 기준 F:로 두고, 다른 PC는 로컬에 따로 두기)
- **배포**: `git push origin master` → GitHub Pages 자동 빌드 (~30~60초)
- **Commit author 고정**: `-c user.name="obkim-lgtm" -c user.email="ob.kim@datadriven.kr"`
- **자동 배포 트리거**: 사용자가 "배포해줘 / 올려줘 / 커밋해줘"라고 하면 추가 확인 없이 즉시 commit + push

---

## 핵심 파일 (`output/`)

| 파일 | 역할 | 상태 |
|------|------|------|
| `creative_activity_list_v6_260507.html` | 활동 목록 (진입점) | ✅ 신규 입력 페이지로 라우팅 + 데모 카드(수학사고력반) seed |
| **`creative_activity_input_v1_260507.html`** | **통합 입력 페이지 (3단계 중심)** | ✅ Step 1·2·3 모두 구현, 드로어 + 자동저장 + dirty cascade + 푸시뷰 |
| **`creative_activity_keyword_upload_v1_260508.html`** | **활동 특성 키워드 업로드 (최초)** | ✅ 양식 다운로드 + dropzone + 결과 테이블 |
| **`creative_activity_keyword_upload_v2_260508.html`** | **활동 특성 키워드 업로드 (재등록 포함)** | ✅ 현재 데이터 카드(접기) + 모드 모달(추가/덮어쓰기) |
| **`creative_activity_survey_upload_v1_260508.html`** | **학생 설문 응답 업로드** | ✅ 교체 룰 + 문항별 컬럼 가로스크롤 + 좌측 sticky |
| `dong_register_v4_260507.html` | 동아리 학생 등록 | (외부) |
| `dong_student_manage_v1_260507.html` | 동아리 학생 관리 | (외부) |

**구버전 (참고용, 사용 안 함)**: `creative_activity_detail_v5`, `dong_activity_detail_v3`, `creative_activity_bulk_v5`

**자료 등록 모달 라우팅** (`creative_activity_input_v1`의 자료 등록 카드):
- 학생 설문 응답 (EXCEL) → `creative_activity_survey_upload_v1_260508.html`
- 활동지·보고서 (PDF) → 토스트만 (다음 단계에서 페이지 추가)
- 학생 활동 특성 키워드 (EXCEL) → `creative_activity_keyword_upload_v1_260508.html` (현재 v1만 연결, v2 별도 미리보기)

---

## 통합 입력 페이지 (`creative_activity_input_v1_260507.html`)

### 진입 URL 규약
```
?type=자율활동|진로활동|동아리활동|봉사활동
&cls=2학년 1반
[&new=1]   # 새 학급 (선택)
[&demo=1]  # 데모 모드: 학생 자료 채워짐 (Step 2·3는 idle 시작)
```

### 전체 페이지 구조 (3단계 공통)
```
[CLIPO 헤더 56px]
  ← 이전으로
  자율활동 : 2학년 1반   ← pt-title 22px/600
  학생 활동 자료나 특성 키워드를...   ← pt-desc 14px

[스텝 버튼 바]
  [1 학생 자료 입력] ▸ [2 콘텐츠 요소 선택] ▸ [3 기록 확인 및 수정]   [학생 추가]   ← Step 1에서만 노출

[Step 1·2·3 패널 (한 번에 하나만 표시)]

[하단 sticky CTA]   (Step별로 라벨/액션 다름)

[우측 하단 목업 토글 — 드래그 가능]
```

### Step 1: 학생 자료 입력
- **카드 헤더**: `학생 자료 현황` + 진행률 sub + [+ 자료 등록] (primary)
- **테이블 컬럼**: 학번 / 이름 / 자료 수 / **특성 키워드** / **활동 수준** / 상태 / 관리
  - 모두 **중앙 정렬**, 본문 14px (CLIPO 컨벤션)
  - 학번 5자리 (예: `20101` = 2학년 1반 1번)
  - 자료 수 "N건", 특성 키워드 "처음 2개, 외 N", 활동 수준 상/중/하/—
  - 상태: 충분/부족/없음 (색 dot)
  - 관리: 충분 시 [수정] / 없음·부족 시 [+ 자료]
- **행 전체 클릭** → 학생 상세 **모달** (Step 1 전용)
  - 자료 dropzone + 파일 리스트 (✕ 제거)
  - **특성 키워드** textarea (콤마 구분, 500자, 카운터, auto-resize)
  - **활동 수준** 칩 (상/중/하/고려 안함)
  - 가상 항목(설문 응답): 클릭 시 `modal-survey` 띄움
- **모달 닫기 시 동작 (Step 1)**: 자료 변경 + AI 기록 있어도 **재생성 권유 모달 안 띄움**. 조용히 `s.dirty=true`만 마킹 → Step 3 카드에 dirty 배지 표시. (Step 1은 자료 관리만 하는 단계)

### [+ 자료 등록] 모달
3개 시나리오 카드 → 각자 상세 페이지로 이동:
1. **학생 설문 응답 (EXCEL)** → `creative_activity_survey_upload_v1`
2. **활동지·보고서 (PDF)** — 다음 단계에서 페이지 추가 (현재 토스트만)
3. **학생 활동 특성 키워드 (EXCEL)** → `creative_activity_keyword_upload_v1`

### 학생 추가 버튼 (Step 1 전용)
- `goStep(n)`에서 `n===1`일 때만 `btn-student-manage` 노출, 2·3단계는 숨김
- 자율/진로/봉사: 학교 등록 학생 중 미배정 후보 리스트
- 동아리: 라벨 "학생 관리"로 변경 → `dong_register_v4` / `dong_student_manage_v1`로 이동

### Step 2: 콘텐츠 요소 선택
- **상단 헤더**: 콘텐츠 요소 선택 [AI 추천] + **[전체 분석 시작 / 전체 재분석]**
- **2단 레이아웃**: 좌측 학생 목록 사이드바(240px) / 우측 메인
- **상태별 카드**: 자료없음 / 키워드만 / 미분석 / 분석 중 / 완료
- **자료 있음 시나리오**: 진입 시 **idle 상태로 시작** (이전: 자동-done 처리, 사용자가 분석 클릭 유도되도록 변경)
- **[전체 분석 시작/재분석] 클릭 시**:
  - **학생 선택 모달** (Step 3 [전체 기록 생성] 모달과 동일 스타일)
  - 활동 자료 있는 학생만 후보 노출, 기본 전체 체크
  - 학생별 상태 태그(분석됨/분석 중)
  - 분석된 학생 있으면 자동 "재분석" 모드 / 없으면 "분석 시작"
  - 마스터 체크박스 + indeterminate
- **완료 상태**:
  - **특성 키워드 박스** (입력된 키워드 콤마 구분, 추천 항목 위) — 키워드 없으면 미노출
  - 콘텐츠 요소 (추천) — 추천 항목 그룹
  - 콘텐츠 요소 (추가 후보) — 후보 그룹 (펼침/접힘)
  - 직접 추가 — 빈 카드 인라인 편집
  - 학생별 [재분석] 버튼
- **하단 CTA**: `분석 완료 N/M명 · 선택된 항목 X개`

**데이터 구조** (실제 API 응답 그대로):
```js
items: [{
  id, category,  // 산출물 기여 / 역할 수행 / 진로 연결 / 학기 성장
  content,
  sources: [{label, kind:'bulk'|'individual'|'keyword'|'auto'}],
  source_origin: 'stage1_recommended' | 'stage1_candidate',
  rationale, competency,  // 지식정보처리 / 창의적사고 / 자기관리
  cross_validated
}]
```

### Step 3: 기록 확인 및 수정
**좌측: 학생 카드 그리드** (모달이 아닌 **드로어**로 진입)
- 카드 클릭 → 우측에서 슬라이드 인 (560px drawer)
- 카드 표시: 이름·학번·상태(생성됨/미생성/dirty 뱃지)·기록 미리보기·요약 메타
- **이름은 평문**, 그 아래 **[자료 수정]** 미니 버튼 (이전: 이름이 밑줄 버튼이라 클릭 인지 떨어진다는 피드백)
- 상단: [전체 생성] [생성된 기록 다운로드(.txt)] (Excel 안 함)
- 검색 + 정렬 (이름/학번/상태)

**테이블 헤더**: 학번 / 이름 / **활동 수준** / AI 기록 / 가져오기 / 편집 (이전: "수준" → "활동 수준"으로 통일)

**드로어 (학생 상세 작업창)**:
- **헤더**: 이름 · 학번 · 활동 + ✕
- **탭 2개** (1·2단계 버튼 라벨과 통일):
  1. `학생 자료 입력` — 파일 리스트 + 특성 키워드 textarea + 활동 수준 칩
  2. `콘텐츠 요소 선택 N/M` — Step 2 결과 표시 + 직접 추가
- **푸시뷰** ✅ — 자료 탭에서 가상 항목(설문) 클릭 시 드로어 본문이 설문 응답 화면으로 **밀려들어옴**. 상단 `← 학생 자료로 돌아가기` 버튼으로 복귀.
- **dirty 배너** — 자료/키워드/항목 변경 시 황색 알림 + [반영] 버튼
- **하단**: [닫기] / [저장]

**Dirty cascade (3-level)**:
- 레벨: `file` > `kw` > `items` (상위가 하위 무효화)
- 학생별 `_dirtyLevel` 보관, `markDirty(s, level)`로 갱신
- **Step 3 드로어 닫기 시**: 변경 + AI 기록 있으면 "재생성?" 모달 (`modal-dirty-confirm`)
  - [지금 재생성] → length 모달 → AI 재생성
  - [나중에] → `s.dirty=true`로 마킹 (배너로 잔존)
- **Step 1 모달 닫기 시**: 모달 안 띄우고 조용히 dirty 마킹만 (자료 관리 단계)

**자동저장**: 1.2s debounced + 명시적 [저장] 버튼 둘 다.

---

## 자료 등록 상세 페이지 (신규)

### 활동 특성 키워드 업로드 (`creative_activity_keyword_upload_v1` / `_v2`)

**v1 = 최초 등록만**, **v2 = 재등록 시나리오 포함** (현재 입력 페이지에서 v1로 라우팅 — 추후 v2로 전환 가능)

**진입 URL**: `?type=자율활동&cls=2학년 1반[&has=1]`

**양식 컬럼**: `학년 / 반 / 번호 / 이름 / 활동 키워드 / 활동 수준(선택)`
- 활동 키워드 셀: 1개 셀에 사용자가 자유 입력 (콤마 구분도 OK, 문장형도 OK)
- 활동 수준 셀: 비어있으면 미고려

**최초 등록 흐름**: 양식 다운로드 → 파일 업로드 → 결과 테이블 → 저장 → 입력 페이지 이동
**재등록 흐름** (v2): 진입 시 `현재 등록된 활동 특성 키워드` 카드(접힘, 기본 접힘) + 업로드 영역 → 파일 픽업 → **모드 선택 모달** (추가 / 전체 덮어쓰기) → 결과 테이블

**충돌 룰**:
| 모드 | 활동 키워드 | 활동 수준 |
|------|------------|----------|
| 추가 | 기존 + 신규 누적 (중복 제거) | 셀에 값 있으면 덮어쓰기, 비면 유지 |
| 전체 덮어쓰기 | 신규로 교체 | 동일 (셀 유무 기준) |

활동 수준은 모드 무관 — 모달 안내 노트로 사용자에게 명시.

**결과 테이블**: 학번 / 이름 / 활동 키워드(truncate) / 활동 수준
- 디프 표시 안 함 (백엔드 비교 API 공수 절감 — 사용자 결정)
- 모드 칩 + [모드 변경] 버튼은 결과 헤더에 유지

**상태 감지**: `localStorage.clipo_kw_<cls>` 플래그. 저장 시 set, 진입 시 read.

**목업 토글** (우측 하단): `최초 등록` / `재등록` — localStorage·URL 무관 즉시 전환.

### 설문 응답 업로드 (`creative_activity_survey_upload_v1`)

**진입 URL**: `?type=자율활동&cls=2학년 1반[&has=1]`

**양식 컬럼**: `학년 / 반 / 번호 / 이름 / 문항1 / 문항2 / … / 문항N`
- 문항 컬럼은 N개 가변, 한 셀당 한 학생의 한 문항 답변

**룰**: **교체 단일 룰** (활동 키워드와 다름 — 데이터 성격상 누적 의미 없음)
- 모드 토글 없이 **확인 다이얼로그 1개**
- 다이얼로그 요약: `기존 N명·M문항 → 새 파일 K명·M문항`
- 새 파일에 있는 학생만 응답 교체, 없는 학생은 기존 응답 유지
- 다이얼로그 노트: "설문 응답은 누적이 아닌 교체입니다."

**결과 테이블**:
- **좌측 sticky 컬럼** (3개): 학번 64px / 이름 76px / 응답수 60px (총 200px sticky)
- **문항별 컬럼 가로 스크롤**: `문항 1`, `문항 2`, … (각 240px)
- 헤더 hover 시 전체 질문 노출(title 속성)
- 답변 셀 truncate, hover 전체 텍스트
- 행 클릭 → **Q&A 상세 모달** (전 문항 풀 텍스트)
- 디프 표시 안 함 (키워드 페이지와 동일 사유)

**상태 감지**: `localStorage.clipo_survey_<cls>`.

---

## 확정된 기획 결정 (누적)

| 항목 | 결정 |
|------|------|
| **3단계 라벨** | 학생 자료 입력 → 콘텐츠 요소 선택 → 기록 확인 및 수정 |
| **용어 통일** | "키워드" → **특성 키워드**, "성적" → **활동 수준**, "데이터" 대신 **자료** |
| **Step 3 진입** | **드로어** (모달 X) — 옆 학생 비교 가능 |
| **드로어 푸시뷰** | 모달-위-모달 / 모달-위-드로어 금지. 본문이 밀려들어오는 푸시 패턴 (← 뒤로) |
| **드로어 탭명** | 1·2단계 버튼과 동일: 학생 자료 입력 / 콘텐츠 요소 선택 |
| **분량 입력 위치** | Step 3 생성 시점 |
| **수준 입력 위치** | 학생 상세(드로어/모달) 칩 — Step 1·3 모두 노출 |
| **활동 수준 표시** | **plain 텍스트** (상/중/하/—). 컬러 칩/배지 금지 |
| **테이블 정렬** | **모든 th/td 중앙 정렬**. 좌측 정렬 금지 (CLIPO 컨벤션) |
| **키워드 입력** | textarea 콤마 구분, 500자, auto-resize |
| **자료 종류 (개별)** | DOCX · JPG · PNG · PDF (HWPX는 다음 지원) |
| **일괄 업로드** | PDF (활동지) · XLSX (설문/관찰 키워드) |
| **분석 트리거** | [전체 분석] 학생 선택 모달 + 학생별 [재분석] |
| **추천 vs 후보 그룹명** | 콘텐츠 요소 (추천) / 콘텐츠 요소 (추가 후보) |
| **Step 2 진입 시 (자료 있음)** | idle 상태 — 사용자가 분석 클릭 유도 (자동-done 안 함) |
| **Step 2 결과 헤더** | 입력된 특성 키워드 박스 (콤마 구분, Step 1 textarea 스타일) |
| **카테고리** | API에 있으면 표시 (산출물 기여 / 역할 수행 / 진로 연결 / 학기 성장) |
| **직접 추가** | AI 카드와 동일 형태 빈 카드 인라인 편집 |
| **Step 1 모달 닫기** | 재생성 프롬프트 안 띄움 (조용히 dirty 마킹) |
| **Step 3 드로어 닫기** | 재생성 프롬프트 띄움 (지금/나중에 선택) |
| **Step 3 카드 진입 버튼** | 이름 평문 + [자료 수정] 미니 버튼 (이름 밑줄 버튼 X) |
| **학번 형식** | 5자리 (학년+반+번호, 예 20101) |
| **본문 폰트** | 16px. 테이블·라벨 등 informational은 13~14px |
| **자동저장** | 1.2s debounced + 명시적 저장 버튼 둘 다 |
| **Dirty cascade** | file > kw > items, 닫기 직전 변경은 `_editChanged` 임시 플래그 |
| **TXT 다운로드** | Excel 안 함, 1개 .txt에 학생별 구분선 |
| **버튼 라벨** | 단어형 (저장/추가/삭제) — "~하기" 금지 (CLIPO 표준) |
| **CLIPO 표기** | 항상 대문자 CLIPO |
| **자료 등록 페이지 디프 표시** | 결과 테이블에 디프(신규/변경/유지) 표시 안 함 — 백엔드 비교 API 공수 절감. 모달 요약(`기존 N → 새 M`)으로 의도 확인만 |
| **키워드 충돌 룰** | 모드 토글(추가/덮어쓰기) — 활동 수준은 셀 유무로 |
| **설문 충돌 룰** | 교체 단일 룰 (확인 다이얼로그) — 모드 없음 |
| **자료 등록 결과 → 입력 페이지** | 저장 시 토스트 + `creative_activity_input_v1`로 이동 (type, cls, demo=1 유지) |

---

## 빈 화면 / 데이터 시나리오

### 입력 페이지 (`creative_activity_input_v1`)
| URL / 액션 | 의미 |
|------|------|
| 기본 (params만) | empty — 학생 명단만, 자료/키워드 없음 — Step 1 첫 진입 |
| `?demo=1` | 자료/키워드 채워진 데모. **Step 2·3는 idle 상태로 시작** (분석/생성 클릭 유도) |
| 우측 하단 토글 | `자료 있음` ↔ `특성 키워드만` ↔ `빈 화면` 즉시 전환 |
| 목록 페이지 "수학사고력반" 카드 | localStorage seed → 진입 시 demo 데이터 자동 적용 |

### 자료 등록 페이지 (키워드/설문)
| URL / 액션 | 의미 |
|------|------|
| 기본 | 최초 등록 — 양식 다운로드 + dropzone만 |
| `?has=1` 또는 localStorage 플래그 | 재등록 — 현재 등록 카드(접힘) + 업로드 영역 |
| 우측 하단 토글 | `최초 등록` ↔ `재등록` 즉시 전환 |

---

## 디자인 시스템 토큰

```css
/* Primary */
#416bff (blue/500)  #365eef (blue/600, 로고)

/* 텍스트 */
#222631 (본문)  #3b3f4c (보조)  #6d7381 (muted)  #b3b6bd (subtle)

/* 상태 */
#f2525f / #b91c1c (error/없음)
#f97316 / #c2410c / #b45309 (warning/부족·dirty)
#1ab864 / #15803d (success/충분)
#7c3aed (가상 항목 — 설문 응답 등)

/* 배경 */
#fff (카드)  #f6f7f9 (페이지)  #f9fafb (테이블 헤더)
#eff3ff / #c7d6ff / #f4f8ff (블루 hint)
#fffbeb / #fde68a (dirty 배너 옐로우)

/* 폰트 */
Pretendard GOV
페이지 타이틀: 22~24px / 600
섹션 타이틀: 18~20px / 600
본문 (텍스트 영역): 16px
테이블 본문: 14px (라벨 13px)

/* z-index */
드로어 500 / modal-survey 700 (드로어 위에 떠야 함, Step 1 모달 컨텍스트용)
업로드 페이지 모달 500 / 토스트 600
```

---

## 주요 함수 / 상태 (입력 페이지 코드 참조용)

```js
// 학생 상태
STUDENTS = [{
  id, sid, name, files:[], keywords:[], level,
  s2: {status:'idle'|'analyzing'|'done', selectedIds:Set, customs:[]},
  s3: {aiText, editText, generatedAt},
  dirty:bool, _dirtyLevel:'file'|'kw'|'items'|null,
  _editChanged:bool  // 모달/드로어 세션 내 변경 임시 플래그
}]

// 핵심 함수
markDirty(s, level)            // dirty 레벨 갱신
openDrawer(id)                 // Step 3 드로어 열기 (subView/curTab 리셋)
showSurveyInDrawer(sid, i)     // 푸시뷰로 설문 응답 표시
backFromSurvey()               // 푸시뷰 → 자료 탭 복귀
cascadeFromDrawer()            // [반영] 클릭 → 단계별 cascade (file→kw 검토 / kw→items 검토 / items→regen)
scheduleAutoSave()             // 1.2s debounced 저장 + 인디케이터
renderStep3()                  // Step 3 카드 그리드 렌더
applyScenario(name)            // 목업 토글 시나리오 전환 (data/keywords-only/empty)
openAnalyzeModal()             // 전체 분석 학생 선택 모달
confirmAnalyze()               // 선택된 학생만 analyzing → done
```

---

## 미구현 / 다음 작업 후보

1. (선택) Step 1 **modal-detail → modal-survey** 흐름도 푸시뷰로 통일 (현재는 모달-위-모달 — 드로어보다 덜 시급)
2. **활동지·보고서 (PDF) 업로드 상세 페이지** 추가 (현재는 토스트만)
3. AI 생성 후 카드 항목별 직접 편집 (현재는 체크/해제만)
4. Step 1 ↔ 2 자료 변경 시 step 2 영향 안내 강화 (현재 cascade는 step 3 기준)
5. 동아리 활동 별도 워크플로우 분기 검토 (현재는 4가지 활동이 동일 페이지 공유)
6. **키워드 업로드 v2를 입력 페이지 라우팅에 적용** (현재 v1만 연결, v2는 별도 미리보기)
7. (선택) 토스트 메시지 "추천 항목" → "콘텐츠 요소" 통일 (라벨 변경 후 잔존)

---

## Notion / Jakob 댓글 (대응 보류)

기획 명세 페이지에 Jakob 댓글 3건. 답변 초안은 작성했으나 사용자가 직접 노션에 옮길 예정. 새 PC에서 이어할 때 노션에 옮기지 않은 상태일 수 있음 — 사용자에게 확인.

---

## 최근 배포 커밋

| 커밋 | 내용 |
|------|------|
| `0269a04` | 창체 자료 등록 상세 페이지 신규 추가 (활동 키워드 v1·v2 / 설문 응답 v1) + 입력 페이지 라우팅 |
| `0f720f9` | 창체 입력 페이지 UX 개선 (라벨/팝업/표시 정리) — 키워드→특성 키워드, 성적→활동 수준, 학생추가 Step 1만, 분석 학생 선택 모달, Step 1 dirty 프롬프트 제거, 자료 있음 idle 시작, 자료 수정 미니 버튼, 드로어 탭명 통일, 특성 키워드 박스, 콘텐츠 요소 (추천/추가 후보) |
| `5592064` | 창체 입력: 드로어 설문 응답을 푸시 뷰로 전환 (팝업-위-팝업 제거) |
| `eaa9421` | 목업 일괄 업데이트: 창체/동아리/채점/연수/스승의날 + 기획 가이드 |

---

## 작업 환경 빠른 복원 가이드 (다른 PC)

새 PC 또는 새 채팅:
1. 이 문서를 첫 메시지에 붙여넣기 또는 경로 알려주기
   - Windows F: `F:\내 드라이브\Claude\clipo_mockup\context_creative.md`
   - Windows G: `G:\내 드라이브\Claude\clipo_mockup\context_creative.md`
   - Mac: `/Volumes/GoogleDrive/내 드라이브/Claude/clipo_mockup/context_creative.md`
2. 한마디만: "창체 이어작업" 또는 "input_v1 이어서 작업"
3. Claude가 자동으로:
   - Google Drive 동기화 확인 (PC 드라이브 문자 자동 감지 — `[System.IO.DriveInfo]::GetDrives()` 등)
   - Python 미설치 시 사용자에게 설치 안내 (`winget install Python.Python.3.12`)
   - `~/.claude/launch.json` 또는 `C:\Users\<user>\.claude\launch.json`에 본 PC 경로로 launch.json 생성/업데이트 (싱크된 `.claude/launch.json`은 옥빈 본 PC 기준 F: drive로 두고 다른 PC에선 로컬 launch.json만 본 PC 경로로 수정)
   - `preview_start('clipo-mockup')` 미리보기 띄우기
   - 최신 `creative_activity_input_v1_260507.html` 상태 확인
4. 작업 시작 → 마치면 "배포해줘" 한마디로 자동 commit + push

**PC 차이 주의**:
- Windows F: `F:\내 드라이브\Claude\...` / Windows G: `G:\내 드라이브\Claude\...` / Mac: `/Volumes/GoogleDrive/내 드라이브/...` 또는 `~/Library/CloudStorage/GoogleDrive-*/내 드라이브/...`
- 항상 `output/` 같은 상대경로로 작업
- 미리보기 포트 `3457` 고정
- GitHub PAT는 origin에 임베드되어 있어 별도 인증 불필요 (`https://obkim-lgtm:<PAT>@github.com/obkim-lgtm/clipo-mockup.git`)
- `.claude/launch.json` (싱크됨)은 F: drive 기준이므로 다른 PC에서는 로컬 `~/.claude/launch.json`을 별도로 만들어 본 PC 드라이브 경로로 설정 (싱크된 파일은 그대로 두기)
