import { useCallback, useEffect, useRef } from "react";

export function useTextareaResize(value: string, minRows: number = 1) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = "auto";

    // Calculate single row height
    const style = window.getComputedStyle(textarea);
    const lineHeight = parseInt(style.lineHeight) || 20;
    const paddingTop = parseInt(style.paddingTop) || 0;
    const paddingBottom = parseInt(style.paddingBottom) || 0;
    const minHeight = lineHeight * minRows + paddingTop + paddingBottom;

    // Set to scrollHeight but respect minHeight
    textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
  }, [minRows]);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return textareaRef;
}
