# 창의적 체험활동 (창체) + 간편 세특 목업 — 작업 인수인계

> 새 채팅 시작 시 이 문서 내용을 같이 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-05-27

## 0. 빠른 시작 (다른 PC에서)
새 채팅 첫 메시지에:
> "창체/간편 세특 작업 이어할게. `F:\내 드라이브\Claude\clipo_mockup\context_creative.md` 와 `F:\내 드라이브\Claude\clipo_mockup\creative_activity_policy_spec.md` 먼저 읽고 컨텍스트 잡아줘. preview_start('clipo-mockup') 도 띄워줘."

## 1. 환경
- **로컬 경로**: `F:\내 드라이브\Claude\clipo_mockup\` (Google Drive 동기화)
- **Repo**: `https://github.com/obkim-lgtm/clipo-mockup` (master 브랜치)
- **GitHub Pages 배포**: `https://obkim-lgtm.github.io/clipo-mockup/output/<파일명>`
- **미리보기**: `preview_start('clipo-mockup')` → `localhost:3457`
- **최근 커밋**: `3070608 창체 3단계·모달 정책 정비 + 일관성 통일`

## 2. 작업 대상 파일

### 창의적 체험활동 (창체)
| 파일 | 역할 |
|------|------|
| `output/creative_activity_list_v6_260507.html` | 활동 리스트 / 카드 / 모달 |
| `output/creative_activity_input_v1_260507.html` | **3단계 메인 페이지** (자료 입력 → 분석 → 기록) — 작업 80%가 여기 |
| `output/creative_activity_survey_upload_v1_260508.html` | 설문 응답 일괄 등록 |
| `output/creative_activity_pdf_upload_v1_260526.html` | 활동지·보고서 PDF 일괄 등록 |
| `output/creative_activity_keyword_upload_v1_260526.html` | 학생 활동 내용 EXCEL 일괄 등록 |
| `output/dong_register_v4_260507.html` | 동아리 학생 등록 페이지 |

### 간편 세특 (quick_seteuk) — **창체 3단계 구조 그대로 가져갈 예정**
| 파일 | 역할 |
|------|------|
| `output/quick_seteuk_list_v1_260526.html` | 간편 세특 리스트 |
| `output/quick_seteuk_register_v1_260526.html` | 간편 세특 등록 |
| `output/quick_seteuk_input_v1_260526.html` | 입력 페이지 (좌측 학생 패널 + 우측 입력) |

> ⚠️ **간편 세특 작업 시 핵심 정책**:
> 1단계·2단계·3단계 흐름, dirty 상태 추적, 모달 분기, 라벨 등 — **창체 input_v1과 동일한 정책 적용**
> `creative_activity_policy_spec.md` 참조하여 일관성 유지

## 3. 창체 정책 핵심 (요약본 — 상세는 별도 spec 문서)

> 별도 문서: `F:\내 드라이브\Claude\clipo_mockup\creative_activity_policy_spec.md`

### 3단계 워크플로우
1. **1단계 학생 자료 입력** — 드로어로 학생별 자료/내용/수준 입력
2. **2단계 AI 자료 분석** — 학생 사이드바 + 분석 결과
3. **3단계 기록 확인 및 수정** — 표 (학번/이름/AI 기록/가져오기/선생님 작성/글자수)

### 핵심 상태 플래그 (내부 변수 — 사용자 노출 X)
- `s.dirty` — 자료/내용/수준 등 변경 후 저장된 상태 (3단계 점 노출 기준)
- `s._dirtyLevel` — `'file' | 'kw' | 'items' | 'analysis' | null` (가장 높은 순위)
- `s._dirtyLevels` — Set, 복수 변경 추적 (3단계 태그 라벨용)
- `s._editChanged` — 드로어 세션 변경 감지 (저장 시 dirty 승격)
- `s.s2.status` — `'idle' | 'analyzing' | 'done'`
- `s.s3.aiText` / `s.s3.editText` — AI 기록 / 선생님 작성 기록

### 변경 종류별 동작 매트릭스
| 변경 종류 | 1단계 모달 | 2단계 점·안내 | 3단계 행 점 | 3단계 태그 | 3단계 액션 |
|----------|-----------|--------------|----------|---------|-----------|
| **자료(파일) 변경, 재분석 X** | ✅ | ✅ | ✅ | 자료 변경됨 | **[2단계 자료 분석 →]** ⛔ |
| 활동 내용 변경 | ❌ | ❌ | ✅ | 활동 내용 변경됨 | [다시 생성] |
| 활동 수준 변경 | ❌ | ❌ | ✅ | 활동 수준 변경됨 | [다시 생성] |
| 추천 항목 (2단계) | — | ❌ | ✅ | 활동 수준 변경됨 | [다시 생성] |
| **2단계 재분석 후** | — | ❌ | ✅ | 분석 결과 갱신됨 | [다시 생성] |
| 자료+내용 동시 (재분석 X) | ✅ | ✅ | ✅ | 여러 항목 변경됨 | **[2단계 자료 분석 →]** ⛔ |
| 활동 내용+수준 동시 | ❌ | ❌ | ✅ | 여러 항목 변경됨 | [다시 생성] |

### 1단계 모달 (자료 파일 변경 + 기록 보유 학생)
- 타이틀: "AI 자료 분석을 다시 할까요?"
- 본문: "변경한 자료를 반영하려면 2단계에서 다시 분석해야 해요. 분석 후 3단계에서 기록까지 다시 생성하면 새 자료가 반영돼요."
- 버튼: [나중에] / [지금 다시 분석] → 2단계로 이동 + 해당 학생 선택

### 재생성 모달 분기 (단순 규칙)
- **첫 생성**: 분량 선택만, 요청사항 X
- **재생성** (기존 기록 보유 학생 포함): 분량 + 다시 생성 요청사항 (선택)

### 전체 기록 생성 모달 — 학생 상태 라벨 (단일 컬럼)
| 학생 상태 | 라벨 | 체크박스 |
|---------|------|---------|
| 자료 없음 | 생성 불가 | ⛔ |
| 자료 있는데 분석 안 됨 | 분석 필요 | ⛔ |
| 분석 완료, 기록 미생성 | 생성 전 | ✅ |
| 분석 완료, 기록 있음 (변경 없음) | 생성 완료 | ✅ |
| 분석 완료, 기록 있음 (변경 있음) | 다시 생성 필요 | ✅ |

> **선택 차단 정책**: 분석 안 거친 학생은 모든 진입점에서 기록 생성 불가 (분석 필수)

## 4. 자료 있음 시나리오 데모 학생 (8명) — 모든 케이스 커버

| 학번 | 이름 | 케이스 |
|------|------|--------|
| 20101 김민수 | D. 모두 완료 (변경 없음) |
| 20102 박서연 | A. 자료 없음 |
| 20103 이지호 | E. 자료(파일) 변경됨 |
| 20104 최유진 | B. 분석 필요 (`demoSkipAutoAnalyze`) |
| 20105 정우진 | B. 분석 필요 (`demoSkipAutoAnalyze`) |
| 20106 한지민 | C. 분석 완료, 기록 미생성 (`demoSkipAutoGen`) |
| 20107 유태성 | F. 활동 수준만 변경됨 (`demoDirtyLevel: 'items'`) |
| 20108 송예린 | G. 자료+활동 수준 동시 변경 (`demoDirtyLevels: ['file','items']`) |

**시드 함수**: `seedDemoCompletedStudent()` (페이지 로드 + 'data' 시나리오 진입 시 실행)
**시나리오 토글**: `applyScenario('data' | 'keywords-only' | 'empty')`
**릴리스 토글**: `applyRelease('604' | 'after')`

## 5. 카피 / 라벨 규칙

- **요체 통일**: "~돼요/해요/입니다" → "~돼요/해요" (CLIPO 톤)
- **단어형 버튼**: "추가/저장/삭제" (✗ "~하기")
- **재생성 → "다시 생성"** (사용자 노출 텍스트 전체)
- **stale/dirty/fresh** 같은 영문 jargon 금지 → "변경됨/변경 없음" 등 한국어
- **내부 변수명**(`_dirtyLevel` 등)은 코드에만, 문서엔 노출 X

## 6. 디자인 토큰
- **Primary**: `#416bff`, hover `#365eef`
- **Stale/warning 톤** (주황): `#f97316` icon, `#fff7ed` bg, `#c2410c` text, `#9a3412` notice text
- **Error**: `#f2525f`
- **타이포**: 본문 16px, 라벨 14px 이상, 사용자 작성 영역은 16px+ 필수

## 7. 배포 흐름
```bash
cd "F:/내 드라이브/Claude/clipo_mockup"
git add output/<변경파일>
git -c user.name="obkim-lgtm" -c user.email="ob.kim@datadriven.kr" commit -m "메시지"
git push origin master
# 1~2분 후 GitHub Pages 반영
```
사용자가 "배포" 한 마디만 해도 위 명령어로 즉시 푸시.

## 8. 사용자 / 호칭
- 사용자: **올립** (Olivia, 김옥빈, CLIPO PM) — "옥빈" 금지
- 영업·CS 공동 열람 문서는 단순하게, 인용 블록(>) 금지

## 9. 자주 쓰는 Figma file key
`u64nCDkeJkJoN1aSkSViLG` (2026 CLIPO Design)

Figma 노드 처리 흐름:
1. `mcp__d17fa23b...__get_screenshot` 으로 fetch (maxDimension 2000~2400)
2. `curl -s -o /tmp/figma_shots/이름.png "URL"` 다운로드
3. `Read C:\Users\user\AppData\Local\Temp\figma_shots\이름.png` 확인 (Windows /tmp 경로)

## 10. 간편 세특 작업 시 체크리스트

창체에서 정한 정책 그대로 적용할 영역:
- [ ] 1단계 자료 입력 드로어 구조 (좌측 학생 패널 + 우측 입력)
- [ ] dirty 상태 추적 (s.dirty, _dirtyLevel, _dirtyLevels)
- [ ] 1단계 모달 카피 "AI 자료 분석을 다시 할까요?"
- [ ] 2단계 점·안내·헤더 액션 (file 변경에만 노출)
- [ ] 3단계 dirty 셀 UI (주황 dashed 박스 + filled blue [다시 생성])
- [ ] [다시 생성] 차단 정책 (file dirty + 분석 미수행)
- [ ] 전체 기록 생성 모달 단일 상태 컬럼 (분석 필요 학생 선택 불가)
- [ ] 재생성 요청사항 영역 단순 규칙 (기록 보유시 노출)
- [ ] "다시 생성" 일관 라벨
- [ ] 데모 시나리오 8 케이스 커버 (변경 없음 / 변경됨 / 분석 필요 등)

## 11. 코드 함수 매핑 (참고 — 개발자만)
| 단계 | 함수 |
|------|------|
| 1단계 | `renderSummary()`, `openDrawer()`, `markDirty()` |
| 2단계 | `renderS2Sidebar()`, `renderS2Main()`, `startAnalyze()`, `reanalyze()` |
| 3단계 | `renderStep3()`, `renderS3Row()`, `generateAllRecords()`, `regenerateOne()`, `bringToEdit()`, `bringAllToEdit()` |
| 데모 시드 | `seedDemoCompletedStudent()` |
| 시나리오 토글 | `applyScenario(scenario)` |
| 릴리스 토글 | `applyRelease(release)` |
