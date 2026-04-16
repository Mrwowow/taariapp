'use client';

import { useEffect, useState } from 'react';

interface RejectSubmissionModalProps {
  open: boolean;
  submitterName: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}

export default function RejectSubmissionModal({
  open,
  submitterName,
  onClose,
  onConfirm,
}: RejectSubmissionModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Please provide a reason. The submitter will see this note.');
      return;
    }
    setSubmitting(true);
    try {
      await onConfirm(trimmed);
    } catch {
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-xl font-bold text-[#1A1A1A] mb-1"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Reject submission
        </h2>
        <p className="text-sm text-[#6B6B6B] mb-4">
          {submitterName ? `Tell ${submitterName} ` : 'Tell the submitter '}
          why this story isn&apos;t a fit. They&apos;ll receive this note by email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. The submission is strong but outside our city coverage. We'd love to see a piece focused on your home city."
            rows={5}
            maxLength={2000}
            disabled={submitting}
            className="w-full text-sm text-[#1A1A1A] border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#C8956C] resize-none"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B6B6B]">{reason.length} / 2000</span>
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="text-sm px-4 py-1.5 border border-gray-200 text-[#6B6B6B] rounded hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="text-sm px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium disabled:opacity-60"
            >
              {submitting ? 'Rejecting…' : 'Reject & notify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
