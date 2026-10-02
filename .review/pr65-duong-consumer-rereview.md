Dương (Member 4) — CONSUMER RE-REVIEW: ACCEPTED trên exact head b65dd2d5a97746ac137d1348d063e35f70ccdc6a (PR65).

Scope: consumer fit của handoff M3 (M3-INTEGRATION-GUIDE.md, CHAPTER-1972-PACKAGE.md, QUIZ-1972.json, LESSON-03) đối chiếu service contract hiện hành và architecture boundary. Không bao gồm historical/media/wording verdict (thuộc Trúc), architecture sign-off (thuộc Hưng), và không phải PO nghiệm thu (bước riêng).

1. Đối chiếu 6 finding trong review CHANGES_REQUESTED của Dương trên head fc811fd — cả 6 đã được sửa, xác minh độc lập trên b65dd2d:
- [P1] Schema quiz sai trong guide: RESOLVED. M3-INTEGRATION-GUIDE.md:66-96 mô tả đúng 3 tầng: Tầng 1 authoring options:{id,text}[]/correctOptionId/sourceIds khớp QUIZ-1972.json; Tầng 3 delivery options:{id,label}[] qua QuizService.getQuestionSet, tuyệt đối không gửi answer key/explanation trước submit; nộp bài qua submitPracticeAttempt/submitScoredAttempt với answers:[{questionId,selectedOptionIds}], nhận receipt từ service.
- [P1] UI đọc trực tiếp docs/content: RESOLVED. Guide:12-17 cấm UI import trực tiếp, luồng Authoring -> Adapter Mapping -> Domain Fixture/Mock Store -> LearningServices -> UI; CHAPTER-1972-PACKAGE.md:98 khẳng định UI không đọc trực tiếp, adapter ánh xạ vào domain entities/fixtures.
- [P1] Policy XP/pass phía client: RESOLVED. Mọi câu 20 XP/câu, huy hiệu client, COMPLETED 80% đã bị gỡ (grep toàn package/guide/PR-description/lesson: 0 match). Guide:18-22 và Package:110 nêu đúng: UI không tự tính điểm/pass/XP/huy hiệu; ScoredQuizReceipt chỉ {attemptId,score,total,passed,feedback}; UI dùng cờ passed từ receipt (ngưỡng 80% là rule phía service, UI chỉ tính % để hiển thị).
- [P1] SEED-DATA SQL publish khi M4 LOCKED: RESOLVED. PR diff vs origin/main còn 15 files docs-only (content/package/validators/board/cards); SEED-DATA-*.sql và PEDAGOGICAL-MASTERY-RULES.md đã bị gỡ khỏi PR (thêm ở 41dd0bb, gỡ ở 58d935a; ls-tree tại HEAD: không còn file nào).
- [P2] Sơ đồ 7 nút vs asset 5 nút: RESOLVED. Guide:53 và Package:59,62,100 đồng nhất 5 nodes; kiểm độc lập DIAGRAM-SAM2-1972.json đúng 5 node IDs khớp guide; grep 0 match "7 nút".
- [P2] CONTENT-017 DONE vẫn link active + CONTENT-019 depends on 018 REVIEW: RESOLVED một phần, phần còn lại thuộc PO. Board hiện link CONTENT-017 sang docs/tasks/done/CONTENT-017.md (đồng bộ từ main). CONTENT-019 vẫn Depends on CONTENT-018 (REVIEW): chấp nhận đóng gói chung 1 PR vì docs-only, không runtime coupling; thứ tự nghiệm thu 018 trước rồi 019 do PO quyết theo bước 3.

2. Đối chiếu contract độc lập (đọc trực tiếp source, không tin guide một chiều):
- DeliveredQuestion/QuizOption/receipts/submissions trong guide khớp từng field với src/services/next/contracts.ts:64-89 (QuizOption {id,label}; ScoredQuizReceipt {attemptId,score,total,passed,feedback}; QuestionFeedback {questionId,outcome,explanation}; submission {operationId,questionSetId,answers}).
- DocumentService.getById + LearningDocument {id,title,locale,sections,sourceIds,status} + section kinds heading/paragraph/key_points khớp src/types/v2/document.ts; guide nói đúng claim-level metadata giữ ở authoring registry (LESSON-03 không chứa markdown table nên mapping hiện tại đủ).
- VN: 8 scene IDs trong STORY JSON khớp guide:47 theo đúng thứ tự tuyến tính coordination->interference->check; sam2-v1-check có 3 knowledge_check choices với isCorrect; narrative choices không isCorrect — khớp NarrativeChoice/KnowledgeCheckChoice trong src/types/v2/content.ts. Story status vẫn draft, không ai claim published.
- Quiz: 5 questions x 4 options, correctOptionId/explanation/sourceIds đầy đủ; q04 đã tách tổng 105 lần chiếc (Hà Nội/Hải Phòng/Thái Nguyên) khỏi sự kiện Khâm Thiên; q02/q03 đã viết lại ở mức khái quát (Cabin Xe K, Cẩm nang bìa đỏ), không còn chi tiết vi mô trong đáp án.
- Lesson format 'video', LessonService.getById, MediaService.getResolvedAsset: khớp contract; text-first fallback được giữ ở mọi bài.

3. Independent verification trên exact head b65dd2d:
- validate-1972-authoring/lesson03/quiz: 3/3 PASS (8 scenes reachable, 5 nodes fallback, 5 questions phủ 4 CLO).
- git diff --check: sạch. check-client-env: 383 files / 0 unsafe.
- GitHub PR65 Quality trên head b65dd2d: 2/2 pass (runs 36991730713, 36991733778).
- PR author chosenol10 khác tài khoản review; không có runtime/src change trong diff.

4. Ghi nhận không chặn (observations):
- (a) Câu "contract hiện hành chưa cung cấp completion/reward/XP/streak API hoặc read model" (guide:22, package:110) đã stale sau khi PR88 merge CompletionService + AccountSummary; tuy vậy kết luận của guide vẫn đúng và an toàn (content handoff không định nghĩa/không luồn reward vào quiz receipt; reward display thuộc M3-06/completion track và gate riêng). Đề nghị refresh 1 dòng ở lần chạm docs tới, không yêu cầu sửa trước merge.
- (b) Đề nghị bổ sung 1 đoạn Tier-2 mapping tường minh (authoring question->domain prompt; inline options->option entities + optionIds + QuizOption; correctOptionId->fixture-local grade hook theo mẫu mockQuiz.ts, không vào delivered types; difficulty default; QuestionSet.questionIds/learningObjectiveIds/mode suy từ quiz JSON) để adapter implementer tương lai khỏi tự phát minh shape. Không chặn vì guide không còn chỉ dẫn sai nào và fixture build được hoãn rõ tới post-approval adapter work.
- (c) PR65 mang thêm file ngoài scope 018/019: CHUAN-HOA-NOI-DUNG-GIAO-DUC-MAUTHAN1968.md mới (478 dòng), PILOT-SCREENPLAY.md thêm text-first fallback, checkpoint CONTENT-004, CLM-MT68-02 hạ về NEEDS_HISTORICAL_REVIEW. M3 runtime không đọc các file này nên không ảnh hưởng consumer fit; nhưng chúng đổi bytes pilot đang hash-bound với historical state (CONTENT-004/014) — executor đã ghi nhận cần re-sync hash sau merge. Thuộc Trúc (bao phủ historical + xác nhận hash) và PO (giữ trong PR hay tách) quyết định.
- (d) Thứ tự nghiệm thu CONTENT-018 trước rồi CONTENT-019 và quyết định merge thuộc PO theo bước 3/4; review này không thay các bước đó.

Kết luận: ACCEPT trong scope consumer/M3-handoff trên exact head b65dd2d. Merge vẫn bị chặn cho tới khi Trúc re-review historical APPROVED, Hưng re-review kiến trúc APPROVED và PO sign-off 018 rồi 019 theo đúng 4 bước trong ảnh.
