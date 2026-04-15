'use client';

import BannerForm from '../BannerForm';

export default function NewBannerPage() {
  return (
    <BannerForm
      mode="new"
      initial={{
        title: '',
        subtitle: '',
        image: '',
        ctaLabel: 'Read Story',
        ctaUrl: '',
        badge: '',
        sortOrder: 0,
        active: true,
      }}
    />
  );
}
