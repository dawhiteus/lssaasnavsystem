import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from './icons';
import {
  IA,
  RECENTS,
  visibleGroups,
  productAccessible,
  pageAccessible,
  type Profile,
  type NavGroup,
  type NavItemDef,
  type Product,
} from './nav-data';

const T = {
  ls50:         '#e6f1f8',
  ls300:        '#66aad5',
  ls500:        '#005b94',
  ls600:        '#004d7d',
  text:         '#374151',
  textMuted:    '#6b7280',
  textDisabled: '#9ca3af',
  border:       '#e5e7eb',
  page:         '#f8f9fa',
  danger:       '#dc3545',
  teal:         '#00b8c4',
  purple:       '#7c3aed',
} as const;

// ── Product icon chip ─────────────────────────────────────────────────

function ProductIcon({ product, size = 32 }: { product: Product; size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.25),
      background: product.color,
      color: '#fff',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon name={product.icon} size={Math.round(size * 0.5)} color="#fff" />
    </div>
  );
}

// ── Product switcher dropdown ─────────────────────────────────────────

interface SwitcherMenuProps {
  profile: Profile;
  productId: string;
  onSelect: (productId: string, pageId?: string) => void;
  onClose: () => void;
}

function SwitcherMenu({ profile, productId, onSelect, onClose }: SwitcherMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        background: '#fff',
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        boxShadow: '0 16px 40px rgba(15,23,42,.18), 0 2px 6px rgba(15,23,42,.06)',
        padding: 6,
        zIndex: 30,
        minWidth: 280,
      }}
    >
      <SectionLabel label="Products" />

      {Object.values(IA).map(p => {
        const accessible = productAccessible(profile, p.id);
        const isActive = p.id === productId;
        const lockReason = !accessible
          ? (profile.products[p.id] as { unlocked: false; reason: string })?.reason
          : undefined;
        return (
          <ProductRow
            key={p.id}
            product={p}
            active={isActive}
            locked={!accessible}
            lockReason={lockReason}
            onClick={() => {
              if (accessible) {
                onSelect(p.id);
                onClose();
              }
            }}
          />
        );
      })}

      <div style={{ height: 1, background: T.border, margin: '6px 4px' }} />
      <SectionLabel label="Recent" />

      {RECENTS.map(r => {
        const accessible = pageAccessible(profile, r.product, r.id);
        return (
          <button
            key={r.id}
            onClick={() => {
              if (accessible) {
                onSelect(r.product, r.id);
                onClose();
              }
            }}
            disabled={!accessible}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              border: 'none',
              cursor: accessible ? 'pointer' : 'not-allowed',
              opacity: accessible ? 1 : 0.5,
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background 100ms ease',
            }}
            onMouseEnter={e => { if (accessible) (e.currentTarget as HTMLElement).style.background = T.page; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Icon name={r.icon} size={13} color={T.textMuted} />
            <span style={{ flex: 1, fontSize: 12, color: T.text }}>{r.label}</span>
            <span style={{ fontSize: 10, color: T.textMuted }}>{IA[r.product].label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      color: T.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '10px 10px 6px',
    }}>
      {label}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  active: boolean;
  locked: boolean;
  lockReason?: string;
  onClick: () => void;
}

function ProductRow({ product, active, locked, lockReason, onClick }: ProductRowProps) {
  const [hover, setHover] = useState(false);
  const bg = active ? T.ls50 : hover && !locked ? T.page : 'transparent';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 10,
        borderRadius: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        background: bg,
        cursor: locked ? 'not-allowed' : 'pointer',
        opacity: locked ? 0.6 : 1,
        transition: 'background 100ms ease',
      }}
    >
      <ProductIcon product={product} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: '-0.005em' }}>
            {product.label}
          </span>
          {locked && <Icon name="lock" size={11} color={T.textMuted} />}
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, lineHeight: 1.4 }}>
          {locked && lockReason ? lockReason : product.description}
        </div>
      </div>
      {active && (
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: T.ls500,
          background: T.ls50,
          padding: '2px 7px',
          borderRadius: 9999,
          alignSelf: 'center',
          flexShrink: 0,
        }}>
          Current
        </span>
      )}
    </div>
  );
}

// ── Product switcher button ───────────────────────────────────────────

interface ProductSwitcherProps {
  profile: Profile;
  productId: string;
  onSelect: (productId: string, pageId?: string) => void;
}

function ProductSwitcher({ profile, productId, onSelect }: ProductSwitcherProps) {
  const [open, setOpen] = useState(false);
  const product = IA[productId];

  const close = () => setOpen(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          height: 52,
          padding: '0 12px',
          background: '#fff',
          cursor: 'pointer',
          fontFamily: 'inherit',
          border: `1px solid ${open ? T.ls500 : T.border}`,
          borderRadius: 12,
          boxShadow: open ? '0 0 0 3px rgba(0,91,148,.12)' : '0 1px 0 rgba(0,0,0,.02)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      >
        <ProductIcon product={product} size={32} />
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{
            fontSize: 9,
            color: T.textMuted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            lineHeight: 1,
            marginBottom: 3,
          }}>
            Product
          </div>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: T.text,
            letterSpacing: '-0.005em',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {product.label}
          </div>
        </div>
        <Icon name="chevrons-up-down" size={14} color={T.textMuted} />
      </button>

      {open && (
        <SwitcherMenu
          profile={profile}
          productId={productId}
          onSelect={onSelect}
          onClose={close}
        />
      )}
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItemDef;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavItem({ item, active, collapsed, onClick }: NavItemProps) {
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
      title={collapsed ? item.label + (locked ? ' · locked' : '') : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: collapsed ? '8px' : '7px 12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderRadius: 14,
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
      {!collapsed && (
        <>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.label}
          </span>
          {locked && <Icon name="lock" size={11} color={T.textDisabled} />}
          {!locked && item.badge != null && (
            typeof item.badge === 'number' ? (
              <span style={{
                background: active ? 'rgba(255,255,255,.22)' : T.danger,
                color: '#fff',
                borderRadius: 9999,
                fontSize: 10,
                fontWeight: 600,
                padding: '1px 7px',
                minWidth: 18,
                textAlign: 'center',
              }}>
                {item.badge}
              </span>
            ) : (
              <span style={{
                background: active ? 'rgba(255,255,255,.22)' : T.teal,
                color: '#fff',
                borderRadius: 9999,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: '0.04em',
                padding: '2px 6px',
              }}>
                {item.badge}
              </span>
            )
          )}
        </>
      )}
    </div>
  );
}

// ── Group header ──────────────────────────────────────────────────────

interface GroupHeaderProps {
  group: NavGroup;
  expanded: boolean;
  onToggle: () => void;
}

function GroupHeader({ group, expanded, onToggle }: GroupHeaderProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '100%',
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        padding: '14px 12px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: T.textMuted,
      }}
    >
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'left',
      }}>
        {group.label}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {group.internalOnly && (
          <span style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: T.purple,
            background: T.purple + '18',
            padding: '1px 6px',
            borderRadius: 9999,
            textTransform: 'uppercase',
          }}>
            LS ONLY
          </span>
        )}
        <Icon
          name="chevron-right"
          size={12}
          color={T.textDisabled}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </span>
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────

export interface AppSidebarProps {
  profile: Profile;
  productId: string;
  activeId: string;
  collapsed: boolean;
  onSelectProduct: (productId: string, pageId?: string) => void;
  onSelectPage: (pageId: string) => void;
  onToggleCollapsed: () => void;
}

export function AppSidebar({
  profile,
  productId,
  activeId,
  collapsed,
  onSelectProduct,
  onSelectPage,
  onToggleCollapsed,
}: AppSidebarProps) {
  const groups = useMemo(() => visibleGroups(profile, productId), [profile, productId]);
  const width = collapsed ? 72 : 264;

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map(g => [g.id, true]))
  );

  useEffect(() => {
    setExpandedGroups(prev => {
      const next = { ...prev };
      let changed = false;
      for (const g of groups) {
        if (!(g.id in next)) { next[g.id] = true; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [productId, groups.length]);

  const toggleGroup = (gid: string) =>
    setExpandedGroups(e => ({ ...e, [gid]: !e[gid] }));

  return (
    <aside style={{
      width,
      flexShrink: 0,
      background: '#fff',
      borderRight: `1px solid ${T.border}`,
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 200ms cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
    }}>

      {/* ── Switcher slot ── */}
      <div style={{
        padding: collapsed ? '12px 10px' : '14px 12px',
        borderBottom: `1px solid ${T.border}`,
        flexShrink: 0,
      }}>
        {collapsed ? (
          <button
            onClick={onToggleCollapsed}
            title={`${IA[productId].label} · expand`}
            style={{
              width: '100%',
              height: 44,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProductIcon product={IA[productId]} size={28} />
          </button>
        ) : (
          <ProductSwitcher
            profile={profile}
            productId={productId}
            onSelect={onSelectProduct}
          />
        )}
      </div>

      {/* ── Groups ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '6px 10px 12px' : '4px 10px 12px',
      }}>
        {groups.map((g, idx) => {
          const isOpen = expandedGroups[g.id] !== false;
          return (
            <div key={g.id} style={{ marginBottom: 2 }}>
              {!collapsed ? (
                <GroupHeader group={g} expanded={isOpen} onToggle={() => toggleGroup(g.id)} />
              ) : (
                idx > 0 && (
                  <div style={{ height: 1, background: T.border, margin: '8px 4px' }} />
                )
              )}

              {(collapsed || isOpen) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {g.items.map(it => (
                    <NavItem
                      key={it.id}
                      item={it}
                      active={activeId === it.id}
                      collapsed={collapsed}
                      onClick={() => onSelectPage(it.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div style={{
        borderTop: `1px solid ${T.border}`,
        padding: collapsed ? '8px 10px' : '10px 12px',
        flexShrink: 0,
      }}>
        {collapsed ? (
          <button
            onClick={onToggleCollapsed}
            title="Expand sidebar"
            style={{
              width: '100%',
              height: 32,
              border: 'none',
              background: 'transparent',
              borderRadius: 8,
              cursor: 'pointer',
              color: T.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="chevrons-right" size={16} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              flexShrink: 0,
              background: profile.orgLogo ? '#fff' : T.ls500,
              border: profile.orgLogo ? `1px solid ${T.border}` : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              fontWeight: 700,
              color: profile.orgLogo ? T.ls500 : '#fff',
            }}>
              {profile.orgLogo === 'att' ? 'AT&T' : 'LS'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.text, lineHeight: 1.2 }}>
                {profile.org}
              </div>
              <div style={{ fontSize: 10, color: T.textMuted, lineHeight: 1.2, marginTop: 1 }}>
                {profile.role}
              </div>
            </div>
            <button
              onClick={onToggleCollapsed}
              title="Collapse sidebar"
              style={{
                width: 24,
                height: 24,
                border: 'none',
                background: 'transparent',
                borderRadius: 6,
                cursor: 'pointer',
                color: T.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="chevrons-left" size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
