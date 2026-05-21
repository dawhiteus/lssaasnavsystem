import React from 'react';
import { Icon } from './icons';
import type { PageMeta } from './nav-data';

const T = {
  ls500: '#005b94',
} as const;

interface PageHeaderBandProps {
  pageMeta: PageMeta | null;
}

export function PageHeaderBand({ pageMeta }: PageHeaderBandProps) {
  return (
    <div style={{
      background: T.ls500,
      color: '#fff',
      padding: '18px 28px',
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
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
    </div>
  );
}
