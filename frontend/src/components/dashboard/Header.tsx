'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  /** Extra breadcrumb label shown after the logo, e.g. "Timesheets" */
  breadcrumb?: string;
}

export default function Header({ breadcrumb }: Props) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5">
      <div className="flex items-center justify-between">
        {/* Left: logo + breadcrumb */}
        <div className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="font-bold text-gray-900 text-base">
            ticktock
          </Link>
          {breadcrumb && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{breadcrumb}</span>
            </>
          )}
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button
            className="relative text-gray-500 hover:text-gray-700 transition"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition"
            >
              {/* Avatar circle */}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden sm:inline font-medium">
                {session?.user?.name ?? 'User'}
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 z-20 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
