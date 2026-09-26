'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FormField from '@/components/admin/FormField';

const inputClass =
  'border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] text-sm';

const NEW_AUTHOR = '__new__';

interface AuthorOption { id: string; name: string; slug: string }

interface AuthorSelectProps {
  name: string;
  slug: string;
  onChange: (author: { name: string; slug: string }) => void;
  /** Submitted stories are always credited to the submitter, so the author can't be changed. */
  locked?: boolean;
}

/**
 * Picks an existing author, or switches to a free-text name that the article
 * API turns into a new author on save.
 */
export default function AuthorSelect({ name, slug, onChange, locked }: AuthorSelectProps) {
  const [authors, setAuthors] = useState<AuthorOption[] | null>(null);
  const [typingNew, setTypingNew] = useState(false);

  useEffect(() => {
    fetch('/api/admin/authors').then((r) => r.json()).then(setAuthors);
  }, []);

  if (locked) {
    return (
      <FormField label="Author" htmlFor="author" hint="Submitted stories are credited to the person who submitted them.">
        <input id="author" className={`${inputClass} bg-gray-50 text-gray-600`} value={name} readOnly />
      </FormField>
    );
  }

  const matched = authors?.find((a) => a.slug === slug)
    ?? authors?.find((a) => a.name.toLowerCase() === name.trim().toLowerCase());
  const showNewInput = typingNew || (authors !== null && !matched && name.trim() !== '');
  const selectValue = showNewInput ? NEW_AUTHOR : matched?.slug ?? '';

  function handleSelect(value: string) {
    if (value === NEW_AUTHOR) {
      setTypingNew(true);
      onChange({ name: '', slug: '' });
      return;
    }
    setTypingNew(false);
    const a = authors?.find((x) => x.slug === value);
    onChange({ name: a?.name ?? '', slug: a?.slug ?? '' });
  }

  return (
    <FormField
      label="Author"
      htmlFor="author"
      hint={showNewInput ? 'A new author will be created with this name when you save.' : undefined}
    >
      <div className="flex gap-2">
        <select
          id="author"
          className={inputClass}
          value={selectValue}
          disabled={authors === null}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">{authors === null ? 'Loading authors…' : 'TAARi Staff (default)'}</option>
          {authors?.map((a) => <option key={a.id} value={a.slug}>{a.name}</option>)}
          <option value={NEW_AUTHOR}>+ New author…</option>
        </select>
        <Link
          href="/admin/authors"
          target="_blank"
          className="shrink-0 text-xs px-3 flex items-center border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition-colors"
        >
          Manage
        </Link>
      </div>
      {showNewInput && (
        <input
          aria-label="New author name"
          className={`${inputClass} mt-2`}
          value={name}
          autoFocus={typingNew}
          onChange={(e) => onChange({ name: e.target.value, slug: '' })}
          placeholder="New author's full name"
        />
      )}
    </FormField>
  );
}
