import { useEffect, type ReactNode } from "react";
import { T } from "../constants";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "flex-end",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          background: T.surface,
          borderRadius: "22px 22px 0 0",
          maxHeight: "92vh",
          overflowY: "auto",
          paddingBottom: "env(safe-area-inset-bottom, 28px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: T.borderMd }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px 16px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 17,
              color: T.text,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: T.border,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: T.textSm,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px 20px" }}>{children}</div>
      </div>
    </div>
  );
}
