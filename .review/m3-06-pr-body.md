M3-06 chưa có contract completion/account-summary để frontend hiển thị completion, reward pending/confirmed và XP/streak trên mock. PR bổ sung task card, đề xuất contract, acceptance checklist, state matrix và thứ tự merge để Vinh/Hưng review trước runtime implementation.

Chỉ thay đổi 4 file docs trên main, không chứa code PR #81–83. Task runtime giữ BLOCKED đến khi contract được review; không mở milestone hoặc tự phê duyệt reward authority.

Review: Vinh chốt receipt/schema, evidence authority, idempotency và mock isolation; Hưng review service/feature boundaries. Dương triển khai consumer sau contract/mock adapter được chốt.

Validation: Markdown links PASS; git diff --check origin/main...HEAD PASS. Không chạy typecheck/build/runtime tests vì PR chỉ đổi docs. Không có env/migration/dependency impact.
