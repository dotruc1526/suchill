import { useState } from 'react';
import Mascot from '../Mascot';
import type { UserAccount } from './types';
import {
  isDisplayNameTaken,
  updateDisplayName,
  generateAIRandomName,
} from './authStorage';

interface NameSetupScreenProps {
  user: UserAccount;
  onComplete: (updatedUser: UserAccount) => void;
}

export default function NameSetupScreen({ user, onComplete }: NameSetupScreenProps) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Random tên AI
  const handleRandomName = () => {
    setIsRolling(true);
    setError(null);

    // Hiệu ứng random vui nhộn
    let count = 0;
    const interval = setInterval(() => {
      const tempName = generateAIRandomName();
      setDisplayName(tempName);
      count++;
      if (count >= 5) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = displayName.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên danh xưng hoặc nhấn nút AI Gợi Ý Tên.');
      return;
    }

    if (cleanName.length < 2) {
      setError('Tên danh xưng phải có ít nhất 2 ký tự.');
      return;
    }

    if (cleanName.length > 25) {
      setError('Tên danh xưng không được vượt quá 25 ký tự.');
      return;
    }

    // Kiểm tra tên không được trùng với người khác
    if (isDisplayNameTaken(cleanName, user.id)) {
      setError(`Danh xưng "${cleanName}" đã có người sử dụng! Hãy chọn tên khác hoặc nhờ AI gợi ý.`);
      return;
    }

    // Cập nhật tên thành công
    const updated = updateDisplayName(user.id, cleanName);
    if (updated) {
      onComplete(updated);
    } else {
      setError('Không thể cập nhật tên. Vui lòng thử lại!');
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: '#C8A882' }}
    >
      <div
        className="relative flex flex-col justify-between overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100dvh',
          maxHeight: 900,
          background: '#F5E6D0',
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col flex-1 px-6 py-8 justify-between overflow-y-auto">
          {/* ── Top section: Mascot ── */}
          <div className="flex flex-col items-center text-center mt-2">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden mb-3"
              style={{
                background: 'linear-gradient(135deg, #8B1A1A 0%, #C4341A 100%)',
                border: '3px solid #E8D5BA',
              }}
            >
              <Mascot emotion="idea" size={82} animate={true} />
            </div>

            <div className="inline-block px-3 py-0.5 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] font-sans font-bold text-xs uppercase mb-1">
              Khởi tạo danh xưng
            </div>
            <h1 className="font-serif font-bold text-2xl" style={{ color: '#3D1A00' }}>
              KHẮC TÊN BẢNG VÀNG
            </h1>
            <p className="font-sans text-xs mt-1 max-w-xs text-[#7A4020] leading-relaxed">
              Mỗi nhà thám hiểm cần một danh xưng độc nhất vô nhị để khắc ghi trên bia sử và tranh tài 1v1.
            </p>
          </div>

          {/* ── Main Form: Input & AI Random ── */}
          <div className="w-full my-auto py-2">
            {/* Live Identity Badge Preview */}
            <div
              className="paper-card rounded-xl p-4 border border-[#C8A882] shadow-sm mb-5 text-center relative overflow-hidden"
              style={{ background: '#FBF4E8' }}
            >
              <div className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#A0622A] mb-1">
                THẺ ĐỒNG HÀNH SỬ CHILL
              </div>
              <div className="w-16 h-16 mx-auto rounded-full bg-[#8B1A1A] text-white flex items-center justify-center text-2xl shadow-md border-2 border-[#E8D5BA] mb-2">
                🎓
              </div>
              <div className="font-serif font-bold text-lg text-[#2A1500] truncate min-h-[28px]">
                {displayName.trim() || 'Chưa đặt tên...'}
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-[#7A4020] bg-[#E8D5BA] px-2 py-0.5 rounded-full uppercase">
                  Cấp 1
                </span>
                <span className="text-[11px] font-hand font-bold text-[#C4341A]">
                  Tân Thủ Sử Học
                </span>
              </div>
            </div>

            {/* Error notice */}
            {error && (
              <div
                className="mb-4 p-2.5 rounded-xl text-xs font-sans flex items-center gap-2"
                style={{
                  background: '#FDE8E8',
                  color: '#9B1C1C',
                  border: '1px solid #F8B4B4',
                }}
              >
                <span className="text-sm">⚠️</span>
                <span className="flex-1 leading-snug">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Input tên người chơi */}
              <div>
                <label className="block text-xs font-serif font-bold text-[#3D1A00] mb-1.5">
                  Nhập danh xưng của bạn:
                </label>
                <div
                  className="flex items-center px-3.5 py-3 rounded-xl transition-all"
                  style={{
                    background: '#FBF4E8',
                    border: '1.5px solid #C8A882',
                    boxShadow: 'inset 0 1px 2px rgba(61,26,0,0.05)',
                  }}
                >
                  <span className="text-base mr-2.5 opacity-60">✍️</span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => {
                      setDisplayName(e.target.value);
                      setError(null);
                    }}
                    placeholder="Ví dụ: Chiến Tướng Bạch Đằng"
                    className="w-full bg-transparent font-sans text-sm font-semibold outline-none"
                    style={{ color: '#2A1500' }}
                    maxLength={25}
                  />
                  {displayName && (
                    <button
                      type="button"
                      onClick={() => setDisplayName('')}
                      className="text-xs text-gray-400 hover:text-gray-600 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Ô Nút AI Random Tên */}
              <div>
                <button
                  type="button"
                  onClick={handleRandomName}
                  disabled={isRolling}
                  className="w-full py-2.5 px-4 rounded-xl font-sans text-xs font-bold transition-all active:scale-[0.98] border border-[#C8A882] shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#FBF4E8]"
                  style={{
                    background: '#E8D5BA',
                    color: '#7A4020',
                  }}
                >
                  <span className={`text-sm ${isRolling ? 'animate-spin' : ''}`}>🎲</span>
                  <span>
                    {isRolling ? 'AI đang tìm kiếm danh xưng...' : 'Nhờ AI gợi ý tên lịch sử ngẫu nhiên'}
                  </span>
                </button>
                <div className="text-[10px] font-hand text-center text-[#7A4020] mt-1">
                  💡 Gợi ý các danh xưng độc đáo từ lịch sử Việt Nam, không lo bị trùng lặp!
                </div>
              </div>

              {/* Nút Hoàn tất */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-serif font-bold text-base transition-all active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-4"
                style={{
                  background: 'linear-gradient(135deg, #8B1A1A 0%, #C4341A 100%)',
                  color: '#FBF4E8',
                  border: '1.5px solid rgba(245,230,208,0.3)',
                  boxShadow: '0 4px 12px rgba(139,26,26,0.35)',
                }}
              >
                <span>🚀</span>
                <span>XÁC NHẬN & KHỞI HÀNH</span>
              </button>
            </form>
          </div>

          {/* ── Footer ── */}
          <div className="w-full pt-3 text-center text-[11px] font-sans text-[#A0622A]">
            Tài khoản: <strong className="text-[#3D1A00]">{user.username}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
