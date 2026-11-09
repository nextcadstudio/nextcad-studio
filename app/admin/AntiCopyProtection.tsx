"use client";

import { useEffect } from "react";

export default function AdminCopyProtection() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const preventCopy = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    const preventShortcuts = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && ["c", "x", "a", "u", "s", "p"].includes(key)) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("copy", preventCopy);
    document.addEventListener("cut", preventCopy);
    document.addEventListener("keydown", preventShortcuts);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("cut", preventCopy);
      document.removeEventListener("keydown", preventShortcuts);
    };
  }, []);

  return (
    <style jsx global>{`
      .admin-protected,
      .admin-protected * {
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      .admin-protected input,
      .admin-protected textarea,
      .admin-protected [contenteditable="true"] {
        -webkit-user-select: text;
        user-select: text;
      }
    `}</style>
  );
}