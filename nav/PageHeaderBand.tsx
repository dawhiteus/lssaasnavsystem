import React, { useState } from 'react';
import { Icon } from './icons';
import type { PageMeta } from './nav-data';

const T = {
  ls500: '#005b94',
} as const;

interface PageHeaderBandProps {
  pageMeta: PageMeta | null;
}

export function PageHeaderBand({ pageMeta }: PageHeaderBandProps) {
  const [addHover, setAddHover] = useState(false);
  const showAddLicense = pageMeta?.id === 'license-tracker';

  return (
    <div style={{
      background: T.ls500,
      color: '#fff',
      padding: '18px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>
      {/* Left: icon + title + breadcrumb */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Icon name={pageMeta?.icon ?? 'file'} size={18} color="rgba(255,255,255,.8)" />
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1 }}>
            {pageMeta?.label ?? 'Page'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.82)' }}>
          {pageMeta ? `${pageMeta.productLabel} · ${pageMeta.groupLabel}` : ''}
        </div>
      </div>

      {/* Right: contextual CTA + LiquidAI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showAddLicense && (
          <button
            onMouseEnter={() => setAddHover(true)}
            onMouseLeave={() => setAddHover(false)}
            style={{
              height: 34,
              padding: '0 14px',
              background: addHover ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.14)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.28)',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 100ms ease',
            }}
          >
            <Icon name="plus" size={13} color="#fff" />
            Add License
          </button>
        )}

      </div>
    </div>
  );
}
