import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { theme } from "../../../theme/tokens";

export function BattleLobby({ connected, onFind, onCreate, onJoin }: {
  connected: boolean; onFind: () => void; onCreate: () => void; onJoin: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  return <div className="space-y-4">
    <Card>
      <h2 className="font-bold mb-2">Thi đấu với người chơi thật</h2>
      <p className="text-sm mb-3">Ghép ngẫu nhiên với người đang tìm trận. 10 câu hỏi, 15 giây mỗi câu. Hai bạn có thể dùng Wi-Fi hoặc mạng di động khác nhau. Chưa có đối thủ thì tiếp tục chờ.</p>
      <Button className="w-full min-h-11" disabled={!connected} onClick={onFind}>TÌM ĐỐI THỦ ONLINE</Button>
    </Card>
    <Card>
      <h2 className="font-bold mb-3">Đấu cùng bạn bè</h2>
      <Button className="w-full min-h-11 mb-3" variant="outline" disabled={!connected} onClick={onCreate}>TẠO PHÒNG</Button>
      <form className="space-y-2" onSubmit={event => { event.preventDefault(); onJoin(code.trim()); }}>
        <label htmlFor="battle-room-code" className="text-sm">Mã phòng của bạn bè</label>
        <input id="battle-room-code" autoComplete="off" maxLength={6} value={code} onChange={event => setCode(event.target.value.toUpperCase())}
          className="w-full min-h-11 rounded px-3" style={{ background: theme.colors.cardBg, border: `1px solid ${theme.colors.borderMedium}` }} />
        <Button type="submit" className="w-full min-h-11" disabled={!connected || !/^[A-F0-9]{6}$/.test(code.trim())}>VÀO PHÒNG</Button>
      </form>
    </Card>
    <Card><h2 className="font-bold mb-2">Luật tính điểm</h2><p className="text-sm">Đúng: 100 điểm + 10 × giây còn lại + 20 × chuỗi đúng trước câu này. Sai hoặc hết giờ: 0 điểm và mất chuỗi. Tổng điểm bằng nhau là hòa.</p></Card>
    <p className="text-xs" style={{ color: theme.colors.textSecondary }}>PvP khách online: chưa gắn xếp hạng hoặc phần thưởng vào hồ sơ học tập. Câu hỏi dùng ngân hàng có sẵn trên server, không tạo bằng AI.</p>
  </div>;
}
