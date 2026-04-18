'use client';

import { Suspense } from 'react';
import NewArticleForm from './NewArticleForm';

export default function NewArticlePage() {
  return (
    <Suspense fallback={<div className="text-[#6B6B6B] text-sm py-8 text-center">Loading...</div>}>
      <NewArticleForm />
    </Suspense>
  );
}
