import type { UserAccount, UserProgress } from './types';
import { DEFAULT_NEW_USER_PROGRESS } from './types';

const USERS_STORAGE_KEY = 'suchill_users';
const CURRENT_USER_KEY = 'suchill_current_user';

// Danh sách tài khoản mẫu ban đầu (nếu chưa có dữ liệu trong máy)
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_admin',
    username: 'admin',
    password: '123',
    displayName: 'Sử Gia Tập Sự',
    createdAt: Date.now() - 86400000 * 7,
    progress: {
      ...DEFAULT_NEW_USER_PROGRESS,
    },
  },
];

export function getUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const list = JSON.parse(raw);
    let hasChanges = false;
    // Migration: đảm bảo mỗi user đều có progress bắt đầu chuẩn, xóa sạch 200/240 XP mẫu cũ
    const cleanList = list.map((u: any) => {
      if (u.xp === 200 || u.xp === 240) {
        delete u.xp;
        hasChanges = true;
      }
      if (!u.progress) {
        u.progress = {
          ...DEFAULT_NEW_USER_PROGRESS,
        };
        hasChanges = true;
      } else {
        if (u.progress.xp === 200 || u.progress.xp === 240) {
          u.progress.xp = 0;
          u.progress.level = 0;
          u.progress.streak = 0;
          hasChanges = true;
        }
        if (u.progress.level === undefined) {
          u.progress.level = Math.max(0, Math.floor((u.progress.xp || 0) / 100));
          hasChanges = true;
        }
      }
      return u;
    });

    if (hasChanges) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(cleanList));
    }
    return cleanList;
  } catch (e) {
    console.error('Failed to read users from localStorage', e);
    return INITIAL_USERS;
  }
}

export function saveUsers(users: UserAccount[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users to localStorage', e);
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (u) {
      let changed = false;
      if (u.xp === 200 || u.xp === 240) {
        delete u.xp;
        changed = true;
      }
      if (!u.progress) {
        u.progress = {
          ...DEFAULT_NEW_USER_PROGRESS,
        };
        changed = true;
      } else {
        if (u.progress.xp === 200 || u.progress.xp === 240) {
          u.progress.xp = 0;
          u.progress.level = 0;
          u.progress.streak = 0;
          changed = true;
        }
        if (u.progress.level === undefined) {
          u.progress.level = Math.max(0, Math.floor((u.progress.xp || 0) / 100));
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(u));
      }
    }
    return u;
  } catch (e) {
    console.error('Failed to read currentUser from localStorage', e);
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to save currentUser to localStorage', e);
  }
}

export function resetUserProgress(userId: string): UserAccount | null {
  return updateUserProgress(userId, () => ({
    ...DEFAULT_NEW_USER_PROGRESS,
  }));
}

// Cập nhật tiến độ học tập & thi đấu của người dùng hiện tại
export function updateUserProgress(
  userId: string,
  updater: Partial<UserProgress> | ((prev: UserProgress) => UserProgress)
): UserAccount | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  const currentProg = users[index].progress || { ...DEFAULT_NEW_USER_PROGRESS };
  const newProg = typeof updater === 'function' ? updater(currentProg) : { ...currentProg, ...updater };

  users[index] = {
    ...users[index],
    progress: newProg,
  };
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedUser = users[index];
    setCurrentUser(updatedUser);
    return updatedUser;
  }

  return users[index];
}

// Kiểm tra tên tài khoản (username/email/sđt) đã được đăng ký chưa
export function isUsernameTaken(username: string): boolean {
  const cleanUsername = username.trim().toLowerCase();
  const users = getUsers();
  return users.some(u => u.username.trim().toLowerCase() === cleanUsername);
}

// Kiểm tra tên hiển thị người chơi (displayName) đã tồn tại chưa
export function isDisplayNameTaken(displayName: string, excludeUserId?: string): boolean {
  const cleanName = displayName.trim().toLowerCase();
  const users = getUsers();
  return users.some(u => {
    if (excludeUserId && u.id === excludeUserId) return false;
    return (u.displayName || '').trim().toLowerCase() === cleanName;
  });
}

// Cập nhật tên hiển thị cho người chơi
export function updateDisplayName(userId: string, displayName: string): UserAccount | null {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    displayName: displayName.trim(),
  };
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updated = users[index];
    setCurrentUser(updated);
    return updated;
  }

  return users[index];
}

// Đặt lại mật khẩu
export function resetPassword(username: string, newPassword: string): boolean {
  const cleanUsername = username.trim().toLowerCase();
  const users = getUsers();
  const index = users.findIndex(u => u.username.trim().toLowerCase() === cleanUsername);
  if (index === -1) return false;

  users[index] = {
    ...users[index],
    password: newPassword,
  };
  saveUsers(users);

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.username.trim().toLowerCase() === cleanUsername) {
    setCurrentUser(users[index]);
  }

  return true;
}

// ─── AI Historical Random Name Generator ──────────────────────────────────────
const PREFIXES = [
  'Sử Gia', 'Chiến Tướng', 'Học Giả', 'Lạc Việt', 'Đông A',
  'Lam Sơn', 'Trạng Nguyên', 'Thám Hoa', 'Cẩm Y Vệ', 'Nho Sĩ',
  'Bạch Đằng', 'Như Nguyệt', 'Chi Lăng', 'Tây Sơn', 'Đại Việt',
  'Thăng Long', 'Hoa Lư', 'Phố Hiến', 'Hùng Vương', 'Âu Lạc',
];

const SUFFIXES = [
  'Hào Kiệt', 'Dũng Sĩ', 'Thiếu Niên', 'Nghĩa Sĩ', 'Hiệp Sĩ',
  'Tướng Quân', 'Du Tử', 'Kỳ Nhân', 'Quân Sư', 'Hậu Duệ',
  'Đồng Tử', 'Hiền Sĩ', 'Hộ Vệ', 'Tập Sự', 'Tú Tài',
];

const FULL_LEGENDARY_NAMES = [
  'Đông A Hào Khí',
  'Sử Gia Thăng Long',
  'Chiến Tướng Bạch Đằng',
  'Lam Sơn Khởi Nghĩa',
  'Nho Sĩ Phố Cổ',
  'Lạc Việt Dũng Sĩ',
  'Hùng Vương Hậu Duệ',
  'Ngọc Hân Đồng Tử',
  'Như Nguyệt Tướng Quân',
  'Chi Lăng Hiệp Sĩ',
  'Tây Sơn Mãnh Hổ',
  'Cẩm Y Vệ Đại Việt',
  'Bạch Đằng Sóng Dữ',
  'Văn Miếu Thám Hoa',
  'Đại La Du Tử',
  'Phố Hiến Học Giả',
  'Âu Lạc Hào Kiệt',
  'Bình Ngô Danh Tướng',
];

export function generateAIRandomName(): string {
  const users = getUsers();
  const takenNames = new Set(users.map(u => (u.displayName || '').trim().toLowerCase()));

  // 1. Thử chọn từ danh sách tên hào hùng có sẵn
  const shuffledFull = [...FULL_LEGENDARY_NAMES].sort(() => 0.5 - Math.random());
  for (const name of shuffledFull) {
    if (!takenNames.has(name.toLowerCase())) {
      return name;
    }
  }

  // 2. Thử ghép ngẫu nhiên Prefix + Suffix
  for (let i = 0; i < 50; i++) {
    const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    const combined = `${p} ${s}`;
    if (!takenNames.has(combined.toLowerCase())) {
      return combined;
    }
  }

  // 3. Nếu vẫn trùng thì thêm số may mắn
  const fallbackP = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const randomNum = Math.floor(Math.random() * 90) + 10;
  return `${fallbackP} ${randomNum}`;
}
