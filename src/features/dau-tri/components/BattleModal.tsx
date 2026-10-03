import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "../../../components/ui/Button";
import { theme } from "../../../theme/tokens";

export function BattleModal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} aria-label={title} className="pvp-modal m-auto p-5 w-[calc(100%_-_2rem)] max-w-md max-h-[85dvh] overflow-y-auto"
    style={{ background: theme.colors.cardBg, color: theme.colors.textPrimary, border: `1.5px solid ${theme.colors.primaryBorder}`, borderRadius: theme.radius.lg, boxShadow: theme.shadows.modal }}
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <style>{`.pvp-modal::backdrop { background: ${theme.colors.overlay}; }`}</style>
    <div className="flex items-center justify-between gap-2 mb-4"><h2 className="font-bold text-base">{title}</h2><Button variant="outline" size="sm" className="min-h-11 min-w-11" aria-label="Đóng" onClick={onClose}>✕</Button></div>
    {children}
  </dialog>;
}
