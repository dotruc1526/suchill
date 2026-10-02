// Tier labels and thresholds follow the user's original Đấu Trí layout.
export function trialRank(rp: number) {
  const names = ["Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Đế Vương", "Thách Đấu"];
  const tier = Math.min(6, Math.floor(Math.max(0, rp) / 1000));
  if (tier === 6) return { name: names[tier], progress: 100, remaining: 0, next: names[tier] };
  const sub = Math.floor((rp % 1000) / 200);
  const labels = ["V", "IV", "III", "II", "I"];
  return { name: `${names[tier]} ${labels[sub]}`, progress: (rp % 200) / 2,
    remaining: 200 - rp % 200, next: sub === 4 ? `${names[tier + 1]} V` : `${names[tier]} ${labels[sub + 1]}` };
}
