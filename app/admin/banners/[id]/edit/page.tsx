'use client';

import { useEffect, useState, use } from 'react';
import BannerForm, { type BannerFormValues } from '../../BannerForm';
import type { Banner } from '@/lib/store';

export default function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initial, setInitial] = useState<BannerFormValues | null>(null);

  useEffect(() => {
    fetch(`/api/admin/banners/${id}`)
      .then((r) => r.json())
      .then((b: Banner) => {
        setInitial({
          title: b.title,
          subtitle: b.subtitle,
          image: b.image,
          ctaLabel: b.ctaLabel,
          ctaUrl: b.ctaUrl,
          badge: b.badge,
          sortOrder: b.sortOrder,
          active: b.active,
        });
      });
  }, [id]);

  if (!initial) {
    return <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>;
  }

  return <BannerForm mode="edit" bannerId={id} initial={initial} />;
}
