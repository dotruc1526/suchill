import { useState } from "react"
import Mascot from "./Mascot"

const plans = [
  {
    id: "free",
    name: "Miễn Phí",
    icon: "📜",
    tagline: "Bắt đầu hành trình khám phá lịch sử",
    price: 0,
    priceLabel: "0đ",
    color: "#3A5A2A",
    colorLight: "#E8F5E2",
    features: [
      "Mở khóa toàn bộ chương học",
      "Quiz kiểm tra kiến thức",
      "Luyện tập hàng ngày (giới hạn 5 câu/ngày)",
      "Theo dõi streak & XP",
      "Hệ thống danh hiệu cơ bản",
    ],
    cta: "ĐANG SỬ DỤNG",
    current: true,
  },
  {
    id: "plus",
    name: "Plus",
    icon: "⭐",
    tagline: "Luyện tập thả ga, đấu trí cùng bạn bè",
    price: 29000,
    priceLabel: "29.000đ",
    color: "#1E2D5A",
    colorLight: "#E4E9F5",
    features: [
      "Tất cả tính năng Miễn Phí",
      "Luyện tập không giới hạn",
      "Chế độ Đấu Trí Online ⚔️",
      "AI Người Dẫn Chuyện không giới hạn 🤖",
      "Ôn tập thông minh (AI gợi ý)",
      "Không có quảng cáo",
    ],
    cta: "NÂNG CẤP",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    icon: "💎",
    tagline: "Trải nghiệm học tập toàn diện",
    price: 49000,
    priceLabel: "49.000đ",
    color: "#8B1A1A",
    colorLight: "#FDE8E4",
    features: [
      "Tất cả tính năng Plus",
      "Bài học audio (nghe kể chuyện) 🎧",
      "Tải nội dung offline",
      "Thống kê chi tiết tiến độ",
      "Huy hiệu & khung avatar đặc biệt",
      "Truy cập sớm tính năng mới",
    ],
    cta: "NÂNG CẤP",
    popular: false,
  },
]

export default function PricingScreen({ onBack }: { onBack: () => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const discount = billingCycle === "yearly" ? 0.7 : 1 // 30% off yearly

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: "#F5E6D0" }}
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-5 shrink-0"
        style={{ background: "#8B1A1A" }}
      >
        <button
          onClick={onBack}
          className="font-sans text-xs mb-3 flex items-center gap-1"
          style={{ color: "rgba(245,230,208,0.8)" }}
        >
          ‹ QUAY LẠI
        </button>
        <div className="flex items-center gap-3">
          <Mascot emotion="excited" size={56} />
          <div>
            <div
              className="font-serif font-bold text-xl"
              style={{ color: "#FBF4E8" }}
            >
              BẢNG GIÁ
            </div>
            <div
              className="font-hand text-sm"
              style={{ color: "rgba(245,230,208,0.8)" }}
            >
              Giá siêu rẻ cho HSSV & học sinh 🎓
            </div>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setBillingCycle("monthly")}
            className="px-4 py-1.5 rounded-full font-sans font-bold text-xs transition-all"
            style={{
              background:
                billingCycle === "monthly"
                  ? "#FBF4E8"
                  : "rgba(245,230,208,0.2)",
              color: billingCycle === "monthly" ? "#8B1A1A" : "#FBF4E8",
            }}
          >
            THÁNG
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className="px-4 py-1.5 rounded-full font-sans font-bold text-xs transition-all flex items-center gap-1.5"
            style={{
              background:
                billingCycle === "yearly"
                  ? "#FBF4E8"
                  : "rgba(245,230,208,0.2)",
              color: billingCycle === "yearly" ? "#8B1A1A" : "#FBF4E8",
            }}
          >
            NĂM
            <span
              className="px-1.5 py-0.5 rounded-sm font-sans font-bold"
              style={{
                fontSize: 9,
                background:
                  billingCycle === "yearly" ? "#3A5A2A" : "rgba(58,90,42,0.8)",
                color: "#FBF4E8",
              }}
            >
              -30%
            </span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id
          const displayPrice =
            plan.price === 0
              ? "0đ"
              : billingCycle === "yearly"
                ? `${Math.round((plan.price * 12 * discount) / 1000).toLocaleString("vi-VN")}.000đ`
                : plan.priceLabel

          return (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className="w-full text-left transition-all active:scale-[0.98]"
            >
              <div
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: isSelected ? plan.colorLight : "#FBF4E8",
                  border: `2px solid ${isSelected ? plan.color : "rgba(61,26,0,0.12)"}`,
                  boxShadow: isSelected
                    ? `0 4px 12px ${plan.color}25`
                    : "2px 3px 0px rgba(61,26,0,0.06)",
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    className="absolute top-0 right-0 px-3 py-1 rounded-bl-lg font-sans font-bold"
                    style={{
                      fontSize: 9,
                      background: plan.color,
                      color: "#FBF4E8",
                      letterSpacing: "0.05em",
                    }}
                  >
                    PHỔ BIẾN NHẤT 🔥
                  </div>
                )}

                {/* Plan header */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0"
                    style={{
                      background: `${plan.color}18`,
                      border: `1.5px solid ${plan.color}30`,
                    }}
                  >
                    {plan.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-serif font-bold text-base"
                        style={{ color: plan.color }}
                      >
                        {plan.name}
                      </span>
                    </div>
                    <div
                      className="font-hand text-xs"
                      style={{ color: "#7A4020" }}
                    >
                      {plan.tagline}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {plan.price === 0 ? (
                      <div
                        className="font-serif font-bold text-lg"
                        style={{ color: plan.color }}
                      >
                        Miễn phí
                      </div>
                    ) : (
                      <>
                        <div
                          className="font-serif font-bold text-lg leading-none"
                          style={{ color: plan.color }}
                        >
                          {displayPrice}
                        </div>
                        <div
                          className="font-hand text-xs"
                          style={{ color: "#A0622A" }}
                        >
                          /{billingCycle === "yearly" ? "năm" : "tháng"}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Features - shown when selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 space-y-1.5 animate-bubble-in"
                    style={{ borderTop: `1px solid ${plan.color}20` }}
                  >
                    <div
                      className="font-sans font-bold text-xs mb-2"
                      style={{ color: plan.color }}
                    >
                      Tính năng chính:
                    </div>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className="text-xs shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        >
                          ✓
                        </span>
                        <span
                          className="font-sans text-xs leading-relaxed"
                          style={{ color: "#3D1A00" }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}

                    {/* CTA */}
                    {!plan.current && (
                      <div
                        className="mt-3 w-full py-2.5 rounded-lg font-sans font-bold text-xs text-center"
                        style={{
                          background: plan.color,
                          color: "#FBF4E8",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {plan.cta} ›
                      </div>
                    )}
                    {plan.current && (
                      <div
                        className="mt-3 w-full py-2.5 rounded-lg font-sans font-bold text-xs text-center"
                        style={{
                          background: "transparent",
                          color: plan.color,
                          border: `1.5px solid ${plan.color}`,
                          letterSpacing: "0.08em",
                        }}
                      >
                        ✓ {plan.cta}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </button>
          )
        })}

        {/* Value proposition */}
        <div
          className="paper-card rounded-xl p-4 mt-2"
          style={{ borderTop: "3px solid #8B1A1A" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎓</span>
            <div
              className="font-serif font-bold text-sm"
              style={{ color: "#3D1A00" }}
            >
              Tại sao chọn Sử Chill?
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📖", label: "Học qua câu chuyện", desc: "Dễ nhớ, dễ hiểu" },
              { icon: "🤖", label: "AI hỗ trợ", desc: "Giải đáp 24/7" },
              { icon: "⚔️", label: "Đấu trí vui", desc: "Thi đấu bạn bè" },
              { icon: "💰", label: "Giá sinh viên", desc: "Chỉ từ 29K/tháng" },
            ].map((v, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-base shrink-0">{v.icon}</span>
                <div>
                  <div
                    className="font-sans font-bold"
                    style={{ fontSize: 10, color: "#3D1A00" }}
                  >
                    {v.label}
                  </div>
                  <div
                    className="font-hand text-xs"
                    style={{ color: "#A0622A" }}
                  >
                    {v.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison hint */}
        <div className="text-center py-2">
          <div
            className="font-hand text-xs"
            style={{ color: "#A0622A" }}
          >
            Bấm vào từng gói để xem chi tiết tính năng ✨
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  )
}
