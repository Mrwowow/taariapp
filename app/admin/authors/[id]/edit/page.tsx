'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AuthorForm, { type AuthorFormValues } from '@/components/admin/AuthorForm';

export default function EditAuthorPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<AuthorFormValues | null>(null);

  useEffect(() => {
    fetch(`/api/admin/authors/${id}`)
      .then((r) => r.json())
      .then((a) => setInitial({
        name: a.name ?? '',
        slug: a.slug ?? '',
        avatar: a.avatar ?? '',
        bio: a.bio ?? '',
        socialLinks: a.socialLinks ?? [],
      }));
  }, [id]);

  if (!initial) return <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>;

  return <AuthorForm authorId={id} initial={initial} />;
}
