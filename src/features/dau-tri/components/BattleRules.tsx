import { Button } from "../../../components/ui/Button";
import { theme } from "../../../theme/tokens";
import { BattleModal } from "./BattleModal";

export function BattleRules({ onClose }: { onClose: () => void }) {
  return <BattleModal title="LUẬT THI ĐẤU" onClose={onClose}>
    <div className="space-y-3 text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
      <p>⚔️ Hai người cùng trả lời <strong>10 câu hỏi</strong>, tối đa <strong>15 giây/câu</strong>. Đối thủ được ghép ngẫu nhiên từ người đang tìm trận, hoặc vào bằng mã phòng.</p>
      <p>⏳ Đúng: <strong>100 điểm + 10 × giây còn lại + 20 × chuỗi đúng trước câu</strong>. Sai hoặc hết giờ: 0 điểm, chuỗi đúng về 0. Đáp án đã chọn được khóa.</p>
      <p>🏆 Tổng điểm cao hơn thắng; bằng điểm là hòa. Mất mạng có 30 giây để trở lại. Bỏ cuộc hoặc quá hạn thì đối thủ thắng.</p>
      <p>🥉 Hạng thử nghiệm: thắng +50 RP, thua −5 RP (tối thiểu 0), hòa giữ RP. Chuỗi thắng từ 3 trận thưởng thêm 10 RP, từ 5 trận thêm 20 RP.</p>
      <p>Bảng hạng chỉ tính trận thật trong phiên thử nghiệm. Đổi phiên hoặc máy chủ khởi động lại có thể mất thống kê. EXP trong trận chưa cộng vào hồ sơ học tập.</p>
    </div>
    <Button className="w-full mt-5" onClick={onClose}>ĐÃ HIỂU</Button>
  </BattleModal>;
}
