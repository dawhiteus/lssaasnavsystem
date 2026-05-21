// Variation C — Vertical Rail + Stacked Sidebar (Linear-style)
// Dark navy icon rail for product switching. Secondary white sidebar shows
// the active product's groups. Densest, most modern pattern.

import React, { useState, useMemo } from 'react';
import { Icon } from './icons';
import {
  IA,
  visibleGroups,
  type Profile,
  type NavGroup,
  type NavItemDef,
} from './nav-data';

const T = {
  ls500:        '#005b94',
  ls900:        '#002238',
  teal:         '#00b8c4',
  text:         '#374151',
  textMuted:    '#6b7280',
  textDisabled: '#9ca3af',
  border:       '#e5e7eb',
  page:         '#f8f9fa',
  danger:       '#dc3545',
  purple:       '#7c3aed',
} as const;

// ── Rail icon button ──────────────────────────────────────────────────

interface RailIconProps {
  iconName: string;
  label: string;
  active?: boolean;
  muted?: boolean;
  accent?: boolean;
  badge?: number;
  onClick?: () => void;
}

function RailIcon({ iconName, label, active, muted, accent, badge, onClick }: RailIconProps) {
  const [hover, setHover] = useState(false);
  const bg = active
    ? 'rgba(255,255,255,.18)'
    : hover ? 'rgba(255,255,255,.08)' : 'transparent';
  const color = muted
    ? 'rgba(255,255,255,.35)'
    : accent ? '#fff'
    : active || hover ? '#fff' : 'rgba(255,255,255,.72)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        border: accent ? '1px solid rgba(255,255,255,.3)' : 'none',
        transition: 'background 100ms ease',
        flexShrink: 0,
      }}
    >
      <Icon name={iconName} size={18} color={color} />

      {/* Active indicator — white bar on the left */}
      {active && (
        <div style={{
          position: 'absolute',
          left: -10,
          top: 8,
          bottom: 8,
          width: 3,
          borderRadius: 3,
          background: '#fff',
        }} />
      )}

      {/* Badge */}
      {badge != null && badge > 0 && (
        <span style={{
          position: 'absolute',
          top: 4,
          right: 4,
          background: T.danger,
          color: '#fff',
          borderRadius: 9999,
          fontSize: 8,
          fontWeight: 700,
          padding: '1px 4px',
          lineHeight: 1.2,
        }}>
          {badge}
        </span>
      )}

      {/* Hover tooltip */}
      {hover && (
        <div style={{
          position: 'absolute',
          left: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#1f2937',
          color: '#fff',
          fontSize: 11,
          fontWeight: 500,
          padding: '4px 9px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,.16)',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ── Nav item in secondary sidebar ─────────────────────────────────────

function NavItemC({ item, active, onClick }: { item: NavItemDef; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const locked = !!item.locked;
  const bg = active ? T.ls500 : hover && !locked ? T.page : 'transparent';
  const color = active ? '#fff' : locked ? T.textDisabled : T.text;
  const iconColor = active ? '#fff' : locked ? T.textDisabled : T.textMuted;

  return (
    <div
      onClick={locked ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '6px 12px',
        borderRadius: 12,
        background: bg,
        color,
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        cursor: locked ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'background 100ms ease',
      }}
    >
      <Icon name={item.icon} size={15} color={iconColor} />
      <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.label}
      </span>
      {locked && <Icon name="lock" size={11} color={T.textDisabled} />}
      {!locked && item.badge != null && (
        typeof item.badge === 'number' ? (
          <span style={{
            background: active ? 'rgba(255,255,255,.22)' : T.danger,
            color: '#fff', borderRadius: 9999, fontSize: 10, fontWeight: 600, padding: '1px 7px',
          }}>{item.badge}</span>
        ) : (
          <span style={{
            background: active ? 'rgba(255,255,255,.22)' : T.teal,
            color: '#fff', borderRadius: 9999, fontSize: 9, fontWeight: 700, padding: '2px 6px',
          }}>{item.badge}</span>
        )
      )}
    </div>
  );
}

// ── Group in secondary sidebar ────────────────────────────────────────

function GroupC({
  group,
  activeId,
  expanded,
  onToggle,
  onSelectPage,
}: {
  group: NavGroup;
  activeId: string;
  expanded: boolean;
  onToggle: () => void;
  onSelectPage: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 2 }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          appearance: 'none',
          background: 'transparent',
          border: 'none',
          padding: '10px 12px 6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: T.textMuted,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span>{group.label}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {group.internalOnly && (
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.06em',
              color: T.purple, background: T.purple + '18',
              padding: '1px 6px', borderRadius: 9999, textTransform: 'uppercase',
            }}>LS ONLY</span>
          )}
          <Icon
            name="chevron-right"
            size={11}
            color={T.textDisabled}
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 150ms ease' }}
          />
        </span>
      </button>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {group.items.map(it => (
            <NavItemC
              key={it.id}
              item={it}
              active={activeId === it.id}
              onClick={() => onSelectPage(it.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar C ─────────────────────────────────────────────────────────

export interface SidebarCProps {
  profile: Profile;
  productId: string;
  activeId: string;
  onSelectProduct: (productId: string, pageId?: string) => void;
  onSelectPage: (pageId: string) => void;
}

export function SidebarC({ profile, productId, activeId, onSelectProduct, onSelectPage }: SidebarCProps) {
  const groups = useMemo(() => visibleGroups(profile, productId), [profile, productId]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const toggleGroup = (gid: string) =>
    setExpandedGroups(prev => ({ ...prev, [gid]: prev[gid] === false ? true : !(prev[gid] ?? true) }));
  const groupExpanded = (gid: string) => expandedGroups[gid] !== false;

  const product = IA[productId];

  return (
    <div style={{ display: 'flex', flexShrink: 0, height: '100%' }}>
      {/* ── Dark rail ── */}
      <div style={{
        width: 60,
        flexShrink: 0,
        background: T.ls900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        gap: 4,
        overflowY: 'auto',
      }}>
        {Object.values(IA).map(p => {
          const accessible = !!(profile.products[p.id]?.unlocked);
          return (
            <RailIcon
              key={p.id}
              iconName={p.icon}
              label={p.label}
              active={productId === p.id}
              muted={!accessible}
              onClick={accessible ? () => onSelectProduct(p.id) : undefined}
            />
          );
        })}

        <div style={{ flexGrow: 1 }} />

        <RailIcon
          iconName="zap"
          label="LiquidAI"
          accent
        />
        <RailIcon
          iconName="bell"
          label="Notifications"
          badge={profile.notificationCount}
        />
      </div>

      {/* ── Secondary sidebar ── */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: '#fff',
        borderRight: `1px solid ${T.border}`,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Product header */}
        <div style={{
          padding: '16px 16px 14px',
          borderBottom: `1px solid ${T.border}`,
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: 10,
            color: T.textMuted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 4,
          }}>
            Product
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: T.text }}>
            {product.label}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
            {product.groups.map(g => g.label).join(' · ')}
          </div>
        </div>

        {/* Groups */}
        <div style={{ flex: 1, padding: '6px 8px 14px', overflowY: 'auto' }}>
          {groups.map(g => (
            <GroupC
              key={g.id}
              group={g}
              activeId={activeId}
              expanded={groupExpanded(g.id)}
              onToggle={() => toggleGroup(g.id)}
              onSelectPage={onSelectPage}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 14px',
          borderTop: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: T.textMuted,
          fontSize: 11,
          flexShrink: 0,
        }}>
          <Icon name="settings" size={13} color={T.textMuted} />
          Settings &amp; permissions
        </div>
      </aside>
    </div>
  );
}
