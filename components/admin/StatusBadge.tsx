'use client';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'sponsored';
}

const styles: Record<StatusBadgeProps['status'], string> = {
  pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  approved: 'bg-green-50 text-green-700 border border-green-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
  sponsored: 'bg-[#C8956C]/10 text-[#C8956C] border border-[#C8956C]/30',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
