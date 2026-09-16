import { useState } from 'react';
import Mascot from '../Mascot';
import brandLogo from '../imports/su-chill-logo-transparent.png';
import type { UserAccount, AuthMode } from './types';
import { DEFAULT_NEW_USER_PROGRESS } from './types';
import {
  getUsers,
  saveUsers,
  setCurrentUser,
  isUsernameTaken,
  resetPassword,
} from './authStorage';

interface AuthScreenProps {
  onSuccess: (user: UserAccount, isNewRegistration: boolean) => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Xử lý Đăng nhập
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
      return;
    }

    const users = getUsers();
    const found = users.find(
      u => u.username.trim().toLowerCase() === cleanUsername.toLowerCase()
    );

    if (!found) {
      setError('Tài khoản không tồn tại. Vui lòng kiểm tra lại hoặc Đăng ký mới!');
      return;
    }

    if (found.password !== password) {
      setError('Mật khẩu không chính xác. Vui lòng thử lại!');
      return;
    }

    // Đăng nhập thành công
    setCurrentUser(found);
    const isNew = !found.displayName;
    onSuccess(found, isNew);
  };

  // Xử lý Đăng ký
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setError('Vui lòng điền đầy đủ thông tin tài khoản và mật khẩu.');
      return;
    }

    if (cleanUsername.length < 3) {
      setError('Tên tài khoản phải có ít nhất 3 ký tự.');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu phải có ít nhất 4 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp. Vui lòng nhập lại.');
      return;
    }

    // Kiểm tra tên tài khoản đã tồn tại chưa (không cho người khác đăng ký trùng)
    if (isUsernameTaken(cleanUsername)) {
      setError('Tài khoản này đã được đăng ký! Vui lòng chọn tên khác hoặc đăng nhập.');
      return;
    }

    const newUser: UserAccount = {
      id: 'user_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      username: cleanUsername,
      password: password,
      // displayName để trống để chuyển sang màn hình Đặt Tên
      displayName: undefined,
      createdAt: Date.now(),
      progress: {
        ...DEFAULT_NEW_USER_PROGRESS,
      },
    };

    const users = getUsers();
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    // Chuyển ngay sang bước Đặt Tên (isNewRegistration = true)
    onSuccess(newUser, true);
  };

  // Xử lý Quên mật khẩu
  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setError('Vui lòng nhập tài khoản / email cần khôi phục.');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (password.length < 4) {
      setError('Mật khẩu mới phải có ít nhất 4 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    if (!isUsernameTaken(cleanUsername)) {
      setError('Không tìm thấy tài khoản này trong hệ thống.');
      return;
    }

    const ok = resetPassword(cleanUsername, password);
    if (ok) {
      setSuccessMessage('Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMode('login');
        setSuccessMessage(null);
      }, 1500);
    } else {
      setError('Có lỗi xảy ra khi khôi phục mật khẩu. Vui lòng thử lại.');
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

        {/* Content container */}
        <div className="relative z-10 flex flex-col flex-1 px-6 py-8 justify-between overflow-y-auto">
          {/* ── Header: Logo & Mascot ── */}
          <div className="flex flex-col items-center text-center mt-2">
            {/* Mascot Avatar Circle (Inspired by Facebook circle logo, styled with Sử Chill mascot) */}
            <div className="relative mb-3">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #8B1A1A 0%, #C4341A 100%)',
                  border: '3px solid #E8D5BA',
                  boxShadow: '0 6px 18px rgba(139,26,26,0.3)',
                }}
              >
                {/* Mascot Chill */}
                <Mascot emotion="happy" size={82} animate={true} />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow"
                style={{ background: '#FBF4E8', border: '1.5px solid #C8A882' }}
              >
                <img
                  src={brandLogo}
                  alt="Logo nhỏ"
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>

            <h1
              className="font-serif font-bold text-2xl tracking-wide"
              style={{ color: '#3D1A00' }}
            >
              Sử chill
            </h1>
            <p
              className="font-hand text-base mt-0.5"
              style={{ color: '#7A4020' }}
            >
              Học sử không khó vì đã có Chill!
            </p>
          </div>

          {/* ── Main Form Area ── */}
          <div className="w-full my-auto py-4">
            {/* Form Title */}
            <div className="text-center mb-5">
              <span
                className="font-serif font-bold text-base uppercase tracking-wider px-3 py-1 rounded-full text-xs"
                style={{
                  background: 'rgba(139,26,26,0.08)',
                  color: '#8B1A1A',
                  border: '1px solid rgba(139,26,26,0.15)',
                }}
              >
                {mode === 'login' && 'Đăng nhập tài khoản'}
                {mode === 'register' && 'Tạo tài khoản mới'}
                {mode === 'forgot' && 'Khôi phục mật khẩu'}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="mb-4 p-2.5 rounded-xl text-xs font-sans flex items-center gap-2 animate-shake"
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

            {/* Success Message */}
            {successMessage && (
              <div
                className="mb-4 p-2.5 rounded-xl text-xs font-sans flex items-center gap-2"
                style={{
                  background: '#DEF7EC',
                  color: '#03543F',
                  border: '1px solid #BCF0DA',
                }}
              >
                <span className="text-sm">✓</span>
                <span className="flex-1 leading-snug">{successMessage}</span>
              </div>
            )}

            {/* Form Body */}
            <form
              onSubmit={
                mode === 'login'
                  ? handleLogin
                  : mode === 'register'
                  ? handleRegister
                  : handleForgot
              }
              className="space-y-3"
            >
              {/* Input 1: Tài khoản / Email / Số điện thoại */}
              <div>
                <div
                  className="flex items-center px-3.5 py-3 rounded-xl transition-all"
                  style={{
                    background: '#FBF4E8',
                    border: '1.5px solid #C8A882',
                    boxShadow: 'inset 0 1px 2px rgba(61,26,0,0.05)',
                  }}
                >
                  <span className="text-base mr-2.5 opacity-60">👤</span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder={
                      mode === 'forgot'
                        ? 'Nhập tài khoản hoặc email cần khôi phục'
                        : 'Số di động, email hoặc tài khoản'
                    }
                    className="w-full bg-transparent font-sans text-sm outline-none"
                    style={{ color: '#2A1500' }}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Input 2: Mật khẩu */}
              <div>
                <div
                  className="flex items-center px-3.5 py-3 rounded-xl transition-all"
                  style={{
                    background: '#FBF4E8',
                    border: '1.5px solid #C8A882',
                    boxShadow: 'inset 0 1px 2px rgba(61,26,0,0.05)',
                  }}
                >
                  <span className="text-base mr-2.5 opacity-60">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={
                      mode === 'forgot' ? 'Mật khẩu mới' : 'Mật khẩu'
                    }
                    className="w-full bg-transparent font-sans text-sm outline-none"
                    style={{ color: '#2A1500' }}
                    autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs px-1 text-gray-500 hover:text-gray-800 transition-colors"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Input 3: Xác nhận mật khẩu (cho Đăng ký và Quên mật khẩu) */}
              {(mode === 'register' || mode === 'forgot') && (
                <div>
                  <div
                    className="flex items-center px-3.5 py-3 rounded-xl transition-all"
                    style={{
                      background: '#FBF4E8',
                      border: '1.5px solid #C8A882',
                      boxShadow: 'inset 0 1px 2px rgba(61,26,0,0.05)',
                    }}
                  >
                    <span className="text-base mr-2.5 opacity-60">🔐</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full bg-transparent font-sans text-sm outline-none"
                      style={{ color: '#2A1500' }}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              )}

              {/* Primary Action Button (Login / Register / Reset) */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-serif font-bold text-base transition-all active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 mt-2"
                style={{
                  background: 'linear-gradient(135deg, #8B1A1A 0%, #C4341A 100%)',
                  color: '#FBF4E8',
                  border: '1.5px solid rgba(245,230,208,0.3)',
                  boxShadow: '0 4px 12px rgba(139,26,26,0.35)',
                }}
              >
                {mode === 'login' && 'Đăng nhập'}
                {mode === 'register' && 'Đăng ký tài khoản'}
                {mode === 'forgot' && 'Cập nhật mật khẩu mới'}
              </button>
            </form>

            {/* Sub-links */}
            <div className="mt-4 flex flex-col items-center gap-2 text-xs font-sans">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError(null);
                  }}
                  className="font-medium hover:underline cursor-pointer"
                  style={{ color: '#7A4020' }}
                >
                  Quên mật khẩu?
                </button>
              )}

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-medium hover:underline cursor-pointer"
                  style={{ color: '#8B1A1A' }}
                >
                  ← Quay lại Đăng nhập
                </button>
              )}
            </div>
          </div>

          {/* ── Footer / Switch Mode Button ── */}
          <div className="w-full pt-4 border-t border-[#C8A882]/40 text-center">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="w-full py-2.5 rounded-xl font-sans font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'transparent',
                  color: '#8B1A1A',
                  border: '1.5px solid #8B1A1A',
                }}
              >
                Chưa có tài khoản? Tạo tài khoản mới
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="w-full py-2.5 rounded-xl font-sans font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'transparent',
                  color: '#7A4020',
                  border: '1.5px solid #C8A882',
                }}
              >
                Đã có tài khoản? Đăng nhập ngay
              </button>
            )}

            <div className="text-[10px] font-sans mt-3 text-[#A0622A]/80">
              Sử Chill © 2026 • Khám phá dòng chảy lịch sử Việt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
