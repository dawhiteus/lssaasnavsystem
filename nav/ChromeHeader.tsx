import React, { useState } from 'react';
import { Icon } from './icons';
import type { Profile } from './nav-data';

// Design-system token palette (mirrors colors_and_type.css)
const T = {
  ls500: '#005b94',
  ls600: '#004d7d',
  ls50:  '#e6f1f8',
  text:  '#374151',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  page:   '#f8f9fa',
  danger: '#dc3545',
} as const;

// ── AT&T placeholder mark ─────────────────────────────────────────────

function AttMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-label="AT&T">
      <circle cx="15" cy="15" r="13" fill="none" stroke="#00a8e0" strokeWidth="1.4" />
      <text
        x="15" y="19"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="9"
        fontWeight="700"
        fill={T.ls500}
        letterSpacing="-0.04em"
      >AT&amp;T</text>
    </svg>
  );
}

// ── LiquidSpace lockup ────────────────────────────────────────────────

function LiquidSpaceMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-label="LiquidSpace">
      <rect x="4" y="6" width="20" height="16" rx="6" fill="none" stroke={T.ls500} strokeWidth="1.6" />
      <path
        d="M9 14 Q14 10 19 14 T29 14"
        fill="none"
        stroke={T.ls500}
        strokeWidth="1.6"
        strokeLinecap="round"
        transform="translate(-5 0)"
      />
    </svg>
  );
}

function CoBrand({ showCustomer }: { showCustomer: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {showCustomer && (
        <>
          <AttMark />
          <div style={{ width: 1, height: 28, background: T.border }} />
        </>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <LiquidSpaceMark />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          {showCustomer && (
            <div style={{
              fontSize: 7,
              color: T.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 600,
              lineHeight: 1,
              marginBottom: 3,
            }}>
              Powered by
            </div>
          )}
          <div style={{ fontSize: 18, fontWeight: 700, color: T.ls500, letterSpacing: '-0.01em', lineHeight: 1 }}>
            Liquid<span style={{ fontWeight: 400 }}>Space</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icon button (search / bell / settings) ────────────────────────────

interface IconBtnProps {
  iconName: string;
  title: string;
  badge?: number;
}

function ChromeIconBtn({ iconName, title, badge }: IconBtnProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: hover ? T.page : 'transparent',
        color: T.text,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 100ms ease',
        flexShrink: 0,
      }}
    >
      <Icon name={iconName} size={18} />
      {badge != null && badge > 0 && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: T.danger,
          color: '#fff',
          borderRadius: 9999,
          fontSize: 9,
          fontWeight: 700,
          minWidth: 14,
          height: 14,
          lineHeight: '14px',
          padding: '0 4px',
          textAlign: 'center',
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── User pill ─────────────────────────────────────────────────────────

function UserPill({ profile }: { profile: Profile }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      aria-label={`Account: ${profile.name}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 38,
        padding: '0 10px 0 4px',
        background: '#fff',
        border: `1.5px solid ${hover ? T.ls600 : T.ls500}`,
        borderRadius: 9999,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'border-color 100ms ease',
        flexShrink: 0,
      }}
    >
      <span style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: T.ls500,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        flexShrink: 0,
      }}>
        {profile.initials}
      </span>
      <Icon name="menu" size={16} color={T.ls500} />
    </button>
  );
}

// ── Chrome header ─────────────────────────────────────────────────────

interface ChromeHeaderProps {
  profile: Profile;
  showCoBrand: boolean;
}

export function ChromeHeader({ profile, showCoBrand }: ChromeHeaderProps) {
  return (
    <div style={{
      height: 64,
      flexShrink: 0,
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#fff',
      borderBottom: `1px solid ${T.border}`,
      position: 'relative',
      zIndex: 20,
    }}>
      <CoBrand showCustomer={showCoBrand && profile.orgLogo !== null} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ChromeIconBtn iconName="search" title="Search (⌘K)" />
        <ChromeIconBtn iconName="bell" title="Notifications" badge={profile.notificationCount} />
        <ChromeIconBtn iconName="settings" title="Settings" />
        <div style={{ width: 8 }} />
        <UserPill profile={profile} />
      </div>
    </div>
  );
}
