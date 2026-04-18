'use client';

import { useEffect, useState } from 'react';

interface ContactMsg {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  submittedAt: string;
}

const statusColors: Record<string, string> = {
  unread: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  read: 'bg-blue-50 text-blue-700 border-blue-200',
  replied: 'bg-green-50 text-green-700 border-green-200',
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/admin/contact-messages');
    setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: ContactMsg['status']) {
    await fetch(`/api/admin/contact-messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    await fetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1
          className="text-3xl font-bold text-[#1A1A1A]"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Contact Messages
        </h1>
        <p className="text-[#6B6B6B] text-sm mt-1">
          {messages.length} total · {messages.filter((m) => m.status === 'unread').length} unread
        </p>
      </div>

      {loading ? (
        <div className="text-[#6B6B6B] text-sm py-8 text-center">Loading…</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-[#6B6B6B] text-sm shadow-sm border border-gray-100">
          No messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl shadow-sm border p-5 transition-shadow ${
                msg.status === 'unread' ? 'border-yellow-200' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    setExpanded(expanded === msg.id ? null : msg.id);
                    if (msg.status === 'unread') updateStatus(msg.id, 'read');
                  }}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-[#1A1A1A]">{msg.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[msg.status]}`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] mt-0.5">{msg.email}</p>
                  <p className="text-sm font-medium text-[#1A1A1A] mt-1">{msg.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.submittedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  {msg.status !== 'replied' && (
                    <button
                      onClick={() => updateStatus(msg.id, 'replied')}
                      className="text-xs px-2.5 py-1 border border-green-200 text-green-600 rounded hover:bg-green-50 transition-colors"
                    >
                      Mark Replied
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="text-xs px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expanded === msg.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="inline-block mt-3 text-xs text-[#C8956C] hover:underline"
                  >
                    Reply via email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
