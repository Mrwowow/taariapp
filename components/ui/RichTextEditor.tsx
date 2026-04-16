'use client';

import { useCallback, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TOOLBAR_BUTTONS: { label: string; command: string; value?: string; title: string }[] = [
  { label: 'B', command: 'bold', title: 'Bold (Ctrl+B)' },
  { label: 'I', command: 'italic', title: 'Italic (Ctrl+I)' },
  { label: 'U', command: 'underline', title: 'Underline (Ctrl+U)' },
  { label: 'H1', command: 'formatBlock', value: 'h2', title: 'Heading' },
  { label: 'H2', command: 'formatBlock', value: 'h3', title: 'Subheading' },
  { label: '¶', command: 'formatBlock', value: 'p', title: 'Paragraph' },
  { label: '“ ”', command: 'formatBlock', value: 'blockquote', title: 'Quote' },
  { label: '•', command: 'insertUnorderedList', title: 'Bulleted list' },
  { label: '1.', command: 'insertOrderedList', title: 'Numbered list' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing…',
  minHeight = '220px',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g., on reset) into the DOM without wiping cursor mid-type
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value;
    }
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = window.prompt('Enter URL');
    if (!url) return;
    exec('createLink', url);
  }, [exec]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const isEmpty = !value || value === '<br>' || value.replace(/<[^>]*>/g, '').trim() === '';

  return (
    <div className="border border-[#D4D4D0] rounded-[30px] overflow-hidden focus-within:border-dark transition-colors bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b border-border bg-[#FAFAF7]">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(btn.command, btn.value)}
            className="min-w-[32px] h-8 px-2 text-sm text-dark hover:bg-dark/5 rounded transition-colors font-medium"
          >
            {btn.command === 'bold' ? <strong>{btn.label}</strong> :
              btn.command === 'italic' ? <em>{btn.label}</em> :
              btn.command === 'underline' ? <span className="underline">{btn.label}</span> :
              btn.label}
          </button>
        ))}
        <button
          type="button"
          title="Insert link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
          className="min-w-[32px] h-8 px-2 text-sm text-dark hover:bg-dark/5 rounded transition-colors"
        >
          🔗
        </button>
        <div className="w-px h-5 bg-border mx-1" />
        <button
          type="button"
          title="Clear formatting"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('removeFormat')}
          className="h-8 px-2 text-xs text-muted hover:bg-dark/5 rounded transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Editable area */}
      <div className="relative">
        {isEmpty && (
          <div
            className="absolute top-4 left-4 text-muted text-sm pointer-events-none"
            aria-hidden="true"
          >
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          className="rich-editor prose prose-sm max-w-none px-4 py-4 text-dark text-sm leading-relaxed focus:outline-none"
          style={{ minHeight }}
        />
      </div>

      <style jsx global>{`
        .rich-editor h2 { font-size: 1.4rem; font-weight: 700; margin: 0.8rem 0 0.4rem; font-family: var(--font-serif); }
        .rich-editor h3 { font-size: 1.15rem; font-weight: 700; margin: 0.6rem 0 0.3rem; font-family: var(--font-serif); }
        .rich-editor p { margin: 0.4rem 0; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .rich-editor blockquote { border-left: 3px solid var(--color-accent); padding-left: 1rem; color: var(--color-muted); font-style: italic; margin: 0.6rem 0; }
        .rich-editor a { color: var(--color-accent); text-decoration: underline; }
        .rich-editor strong { font-weight: 700; }
        .rich-editor em { font-style: italic; }
      `}</style>
    </div>
  );
}
