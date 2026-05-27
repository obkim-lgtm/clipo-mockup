# 창의적 체험활동 (창체) 목업 — 작업 인수인계

> 새 채팅 시작 시 이 문서 내용을 같이 첨부하면 즉시 컨텍스트 복원 가능
> 마지막 갱신: 2026-05-26

## 1. 위치 / 환경
- **로컬 경로**: `F:\내 드라이브\Claude\clipo_mockup\` (Google Drive 동기화)
- **Repo**: `https://github.com/obkim-lgtm/clipo-mockup` (master 브랜치)
- **GitHub Pages 배포**: `https://obkim-lgtm.github.io/clipo-mockup/output/<파일명>`
- **미리보기**: `preview_start('clipo-mockup')` → `localhost:3457`
- **최근 커밋**: `07e1a17 재분석 후 3단계 기록 stale 표시 복구`

## 2. 작업 대상 파일
| 파일 | 역할 | 비고 |
|------|------|------|
| `output/creative_activity_list_v6_260507.html` | 활동 리스트 / 카드 / 모달 | 최근 카드 메뉴 분기·동아리명 수정 모달·학생 변경 모달 추가 |
| `output/creative_activity_input_v1_260507.html` | **3단계 메인 페이지** (자료 입력 → 분석 → 기록) | 가장 큰 파일, 작업 80%가 여기 |
| `output/creative_activity_survey_upload_v1_260508.html` | 설문 응답 일괄 등록 | Figma 매칭 완료 |
| `output/creative_activity_pdf_upload_v1_260526.html` | 활동지·보고서 PDF 일괄 등록 | 신규 |
| `output/creative_activity_keyword_upload_v1_260526.html` | 학생 활동 내용 EXCEL 일괄 등록 | 신규 |
| `output/dong_register_v4_260507.html` | 동아리 학생 등록 페이지 | Figma 매칭으로 전체 재작성 |

## 3. 입력 페이지 핵심 구조 (input_v1)
**3단계 워크플로우**
1. **학생 자료 입력** — 학생별 자료/활동 내용 입력 (드로어로 학생 상세 편집)
2. **AI 자료 분석** — 학생 사이드바 + 분석 결과 메인
3. **기록 확인 및 수정** — 표 (학번/이름/AI 기록/가져오기/선생님 작성/글자수)

**핵심 상태 플래그**
- `s.dirty` — 자료가 stale (3단계 점 노출 기준)
- `s._dirtyLevel` — `'file'` / `'kw'` / `'items'` (안내 메시지 분기)
  - `'items'`는 재분석 직후 "기록만 stale" 상태
- `s._editChanged` — 드로어 세션 내 변경 추적 (저장 시 dirty=true로 승격)
- `s.s2.status` — `'idle'` / `'analyzing'` / `'done'`
- `s.s3.aiText`, `s.s3.editText` — AI 기록 / 선생님 작성 기록
- `s._dataChangedSinceGen` — 기록 재생성 시 모드 분기용

**dirty 점·안내 조건 (중요)**
| 케이스 | s.dirty | _dirtyLevel | 2단계 점 | 2단계 안내 | 3단계 점 |
|--------|---------|-------------|--------|----------|--------|
| 평시 | false | null | ❌ | ❌ | ❌ |
| 1단계 자료 수정 후 저장 | true | 'file' | ✅ | ✅ "이전 분석" | ✅ |
| 2단계 재분석 후 | true | **'items'** | ❌ | ❌ | ✅ |
| 3단계 재생성 후 | false | null | ❌ | ❌ | ❌ |

2단계의 점/안내는 `s.dirty && s._dirtyLevel !== 'items'` 일 때만 노출 — `'items'` 케이스는 재분석 직후라 2단계는 fresh.

## 4. 데모 시드 (1번 STUDENTS 배열)
- `seedDemoCompletedStudent()` 함수가 페이지 로드 + 'data' 시나리오 토글 시 실행
- **자료 있는 모든 학생**을 `s2.done + s3.aiText` 상태로 시드 (1/2/3단계 상태 일관화)
- `demoSkipAutoAnalyze: true` 플래그 있는 학생은 시드 제외 → '분석 필요' 케이스 노출
  - 현재: **최유진 (id:4)**, 정우진 (id:5)

## 5. 최근에 작업한 것들 (이번 세션 묶음)
1. **드로어 Figma 4946-11602 매칭**: sid+이름 타이틀, 섹션별 카운트, dashed 드롭존, 자료 없음 안내 박스, "참여 정도" 라벨
2. **자료 삭제 확인 모달** (Figma 5188-17811): X 버튼 → "자료를 삭제하시겠습니까?" 모달
3. **2단계 본문 UI 정비** (Figma 4908-179476): 회색 요약 박스 제거, 파일 chip 가로 배치, 활동 내용 별도 카드
4. **2단계 헤더 액션 분리**: idle=본문 [개별 분석 시작], done=헤더 [재분석] (둘 다 파랑)
5. **3단계 [전체 AI 기록 옮기기]** 버튼 + 덮어쓰기 확인 모달
6. **3단계 글자수 별도 컬럼** (선생님 작성 영역 기준, 중앙 정렬)
7. **3단계 표 헤더 중앙 정렬** / **스텝바 아이콘 제거** (1·2·3 숫자만)
8. **dirty 시드 제거** + 1/2/3단계 상태 일관화 + 자료 변경됨 안내문 + 점 표시 시스템 정리
9. **리스트 페이지**: 카드 메뉴 분기 (자율/진로=[학생 추가][활동 삭제] / 동아리=[동아리명 수정][학생 변경][활동 삭제]), 학생 추가·변경 모달 신규, 동아리명 수정 전용 모달 (Figma 4965-46878), 활동 추가 모달 Figma 4962-12466 매칭, 사용자 추가 카드 localStorage 영속화 (`clipo_custom_cards`)
10. **푸터 제거** (5개 mockup 파일에서)

## 6. 디자인 토큰 / 규칙
- **Primary**: `#416bff`, hover `#365eef`
- **Stale/warning 톤** (주황): `#f97316` (icon), `#fff7ed` (bg), `#c2410c` (text), `#9a3412` (notice text)
- **Error**: `#f2525f`
- **버튼 정책**: 액션 버튼은 일관된 파랑. 강조는 점·안내문으로 (버튼 색은 안 바꿈)
- **버튼 라벨**: 모달 CTA = "저장" (활동 추가/수정 모달 통일)
- **타이포**: 본문 16px, 라벨 14px 이상 (사용자 작성 영역은 무조건 16px+)
- **모달 너비**: 활동 추가 512, 학생 추가 480, 학생 변경/학생 목록 560

## 7. 시나리오 토글 (목업 우하단)
- **자료 있음** (`data`) — 자료/내용/수준 모두 풀
- **활동 내용만** (`keywords-only`) — 키워드만
- **빈 화면** (`empty`) — 다 비움
- 토글 변경 시 `applyScenario()` 실행 → s2/s3 리셋 후 `seedDemoCompletedStudent()` 재호출 (data만)

## 8. 배포 흐름
```bash
cd "F:/내 드라이브/Claude/clipo_mockup"
git add output/<변경파일>
git -c user.name="obkim-lgtm" -c user.email="ob.kim@datadriven.kr" commit -m "메시지"
git push origin master
# 1~2분 후 GitHub Pages 반영
```
사용자가 "배포" 한 마디만 해도 위 명령어로 즉시 푸시.

## 9. 다음에 손볼 만한 것 (대기 상태)
- 현재 명시적 pending 작업 없음
- 사용자가 Figma 노드 링크 주면 그 디자인 매칭하는 흐름이 반복됨
- `window.currentRelease` 로 6/4 vs 후속 동작 분기 가능 (현재 기본 '604')

## 10. 사용자 / 호칭
- 사용자: **올립** (Olivia, 김옥빈, CLIPO PM) — "옥빈" 금지
- 톤: 요체 ("~돼요/해요"), 단어형 버튼 라벨 (추가/저장/삭제, "~하기" 금지)
- 영업·CS 공동 열람 문서는 단순하게, 인용 블록(>) 금지

## 11. 자주 쓰는 Figma file key
`u64nCDkeJkJoN1aSkSViLG` (2026 CLIPO Design)

Figma 노드 받을 때 처리:
1. `mcp__d17fa23b...__get_screenshot` 으로 fetch (maxDimension 2000~2400)
2. `curl -s -o /tmp/figma_shots/이름.png "URL"` 로 다운로드
3. `Read C:\Users\user\AppData\Local\Temp\figma_shots\이름.png` 로 확인 (Windows /tmp는 `C:\Users\user\AppData\Local\Temp`)
