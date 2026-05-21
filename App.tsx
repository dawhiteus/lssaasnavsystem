import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';

import { ChromeHeader } from './nav/ChromeHeader';
import { AppSidebar } from './nav/AppSidebar';
import { SidebarA } from './nav/SidebarA';
import { SidebarC } from './nav/SidebarC';
import { PageHeaderBand } from './nav/PageHeaderBand';
import { ProfilePanel, type Variant } from './nav/ProfilePanel';
import {
  PROFILES,
  findPage,
  firstAccessibleProduct,
  firstAccessiblePage,
  productAccessible,
  pageAccessible,
  type Profile,
} from './nav/nav-data';

import { AIDrawer } from './components/ai-drawer';
import { Toaster } from './components/ui/toast';

import type { AgentCard, Deal } from './components/BrokerFlow';

// ── Blank page body — keeps focus on the nav ──────────────────────────
// All destinations render a clean empty canvas so only the nav chrome
// is evaluated, without clashing component headers or sample data.

function PageBody({ pageId }: { pageId: string }) {
  const meta = findPage(pageId);
  return (
    <div style={{
      flex: 1,
      background: '#f8f9fa',
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '28px 32px',
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#9ca3af',
          marginBottom: 10,
        }}>
          Page Placeholder
        </div>
        <div style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: '#374151',
          marginBottom: 10,
        }}>
          {meta?.label ?? pageId}
        </div>
        <div style={{
          fontSize: 13,
          color: '#6b7280',
          lineHeight: 1.6,
          marginBottom: 20,
        }}>
          This destination is part of the nav IA but is not built in this prototype. Click{' '}
          <em>License Tracker</em> or <em>Requirements</em> to see fleshed-out pages.
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 20, display: 'flex', gap: 40 }}>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 4,
            }}>
              Product
            </div>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
              {meta?.productLabel ?? '—'}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#9ca3af',
              marginBottom: 4,
            }}>
              Group
            </div>
            <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>
              {meta?.groupLabel ?? '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root app ──────────────────────────────────────────────────────────

const DEFAULT_PROFILE = PROFILES.enterprise_admin;

export default function App() {
  // Prototype controls
  const [profileKey, setProfileKey] = useState<string>('enterprise_admin');
  const [showCoBrand, setShowCoBrand]   = useState(true);
  const [variant, setVariant]           = useState<Variant>('B');
  const profile: Profile = PROFILES[profileKey] ?? DEFAULT_PROFILE;

  // Nav state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productId, setProductId] = useState<string>(
    () => firstAccessibleProduct(DEFAULT_PROFILE) ?? 'ops'
  );
  const [activeId, setActiveId] = useState<string>(() => {
    if (pageAccessible(DEFAULT_PROFILE, 'ops', 'license-tracker')) return 'license-tracker';
    return firstAccessiblePage(DEFAULT_PROFILE, 'ops') ?? 'license-tracker';
  });

  // AI Drawer
  const [isAIDrawerOpen,     setIsAIDrawerOpen]     = useState(false);
  const [isAIDrawerExpanded, setIsAIDrawerExpanded] = useState(false);
  const [activeAgentCard,    setActiveAgentCard]    = useState<AgentCard | null>(null);
  const [activeDealContext,  setActiveDealContext]  = useState<Deal | null>(null);

  // Re-validate nav when profile changes
  useEffect(() => {
    if (!productAccessible(profile, productId)) {
      const next = firstAccessibleProduct(profile);
      if (next) {
        setProductId(next);
        setActiveId(firstAccessiblePage(profile, next) ?? 'license-tracker');
      }
    } else if (!pageAccessible(profile, productId, activeId)) {
      const isInternalPage = ['audit-log', 'agent-console', 'org-browser'].includes(activeId);
      if (!(profile.showInternal && isInternalPage)) {
        setActiveId(firstAccessiblePage(profile, productId) ?? 'license-tracker');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  const handleSelectProduct = (nextProductId: string, nextPageId?: string) => {
    setProductId(nextProductId);
    setActiveId(nextPageId ?? firstAccessiblePage(profile, nextProductId) ?? 'license-tracker');
  };

  const handleSelectPage = (pageId: string, overrideProductId?: string) => {
    const pid = overrideProductId ?? productId;
    const isInternalPage = ['audit-log', 'agent-console', 'org-browser'].includes(pageId);
    if (!pageAccessible(profile, pid, pageId) && !(profile.showInternal && isInternalPage)) return;
    if (overrideProductId && overrideProductId !== productId) setProductId(overrideProductId);
    setActiveId(pageId);
  };

  const handleAgentCardOpen = (card: AgentCard, deal: Deal) => {
    setActiveAgentCard(card);
    setActiveDealContext(deal);
    setIsAIDrawerOpen(true);
    setIsAIDrawerExpanded(false);
  };

  const handleAIDrawerClose = () => {
    setIsAIDrawerOpen(false);
    setIsAIDrawerExpanded(false);
    setTimeout(() => {
      setActiveAgentCard(null);
      setActiveDealContext(null);
    }, 400);
  };

  const pageMeta = useMemo(() => findPage(activeId), [activeId]);

  // Sidebar width for margin calculation (only matters for B which has a collapsible sidebar)
  const sidebarWidth = variant === 'B'
    ? (sidebarCollapsed ? 72 : 264)
    : variant === 'A' ? 244
    : 60 + 220; // rail + secondary

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#374151',
      background: '#fff',
      overflow: 'hidden',
    }}>
      {/* Chrome header */}
      <ChromeHeader profile={profile} showCoBrand={showCoBrand} />

      {/* Body row: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

        {/* ── Sidebar — swaps based on variant ── */}
        {variant === 'A' && (
          <SidebarA
            profile={profile}
            productId={productId}
            activeId={activeId}
            onSelectPage={handleSelectPage}
          />
        )}
        {variant === 'B' && (
          <AppSidebar
            profile={profile}
            productId={productId}
            activeId={activeId}
            collapsed={sidebarCollapsed}
            onSelectProduct={handleSelectProduct}
            onSelectPage={handleSelectPage}
            onToggleCollapsed={() => setSidebarCollapsed(c => !c)}
          />
        )}
        {variant === 'C' && (
          <SidebarC
            profile={profile}
            productId={productId}
            activeId={activeId}
            onSelectProduct={handleSelectProduct}
            onSelectPage={handleSelectPage}
          />
        )}

        {/* ── Content column ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          paddingRight: isAIDrawerOpen ? 424 : 0,
          transition: 'padding-right 350ms cubic-bezier(0.23,1,0.32,1)',
        }}>
          <PageHeaderBand
            pageMeta={pageMeta}
          />
          <div style={{ flex: 1, overflowY: 'auto', background: '#f8f9fa' }}>
            <PageBody
              pageId={activeId}
              onAIAssistantOpen={handleAgentCardOpen}
              isAIDrawerOpen={isAIDrawerOpen}
            />
          </div>
        </div>
      </div>

      {/* AI Drawer */}
      <AnimatePresence mode="wait">
        {isAIDrawerOpen && (
          <AIDrawer
            isOpen={isAIDrawerOpen}
            onClose={handleAIDrawerClose}
            isExpanded={isAIDrawerExpanded}
            onToggleExpand={() => setIsAIDrawerExpanded(e => !e)}
            agentCard={activeAgentCard}
            dealContext={activeDealContext}
          />
        )}
      </AnimatePresence>

      {/* Prototype controls */}
      <ProfilePanel
        profile={profile}
        showCoBrand={showCoBrand}
        variant={variant}
        onProfileChange={setProfileKey}
        onCoBrandChange={setShowCoBrand}
        onVariantChange={setVariant}
      />

      <Toaster />
    </div>
  );
}
