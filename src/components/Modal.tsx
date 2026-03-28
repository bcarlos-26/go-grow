import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  accentColor?: string;
  accentBg?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  accentColor = "#2C1810",
  accentBg = "#F9F3E8",
}: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: "rgba(44, 24, 16, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-2xl shadow-2xl animate-slide-up"
        style={{ background: accentBg, maxHeight: "90vh", overflowY: "auto", paddingBottom: "env(safe-area-inset-bottom, 44px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: "#D5C5A0" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #E5D9BC" }}>
          <h2 className="text-xl font-semibold" style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg leading-none"
            style={{ background: "#E5D9BC", color: "#9B7A5A" }}
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
