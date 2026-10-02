export default function PrimaryButton({ children, onClick }: { children: string; onClick: () => void }) {
  return <button onClick={onClick} className="w-full min-h-14 mt-6 rounded-lg font-sans font-bold text-sm" style={{ background: "#A84D3F", color: "#FFF9EC", boxShadow: "0 3px 0 #7F382E", letterSpacing: "0.06em" }}>{children}</button>
}
