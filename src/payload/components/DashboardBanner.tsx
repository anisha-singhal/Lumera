'use client'

import React from 'react'
import Link from 'next/link'

const styles = {
  banner: {
    padding: '24px',
    marginBottom: '24px',
  } as React.CSSProperties,
  welcomeCard: {
    background: 'linear-gradient(135deg, #fdfcfb 0%, #f9f6ee 100%)',
    border: '1px solid rgba(128, 0, 32, 0.1)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(128, 0, 32, 0.06)',
  } as React.CSSProperties,
  welcomeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(128, 0, 32, 0.1)',
  } as React.CSSProperties,
  flameIcon: {
    width: '56px',
    height: '56px',
    background: 'linear-gradient(135deg, #800020 0%, #5c0017 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties,
  welcomeTitle: {
    fontFamily: 'Georgia, serif',
    fontSize: '24px',
    fontWeight: 500,
    color: '#800020',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  welcomeSubtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  } as React.CSSProperties,
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,
  actionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
    borderRadius: '10px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    fontWeight: 500,
    fontSize: '14px',
  } as React.CSSProperties,
  actionPrimary: {
    background: 'linear-gradient(135deg, #800020 0%, #5c0017 100%)',
    color: '#fff',
  } as React.CSSProperties,
  actionSecondary: {
    background: '#fff',
    border: '1px solid rgba(128, 0, 32, 0.2)',
    color: '#800020',
  } as React.CSSProperties,
  actionTertiary: {
    background: '#fff',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: '#8B6914',
  } as React.CSSProperties,
  actionQuaternary: {
    background: '#fff',
    border: '1px solid rgba(128, 0, 32, 0.15)',
    color: '#555',
  } as React.CSSProperties,
}

export const DashboardBanner: React.FC = () => {
  return (
    <div style={styles.banner}>
      {/* Welcome Card */}
      <div style={styles.welcomeCard}>
        <div style={styles.welcomeHeader}>
          <div style={styles.flameIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z"
                fill="#D4AF37"
                opacity="0.8"
              />
              <path
                d="M12 6C12 6 10 10 10 14C10 16.5 11 19 12 19C13 19 14 16.5 14 14C14 10 12 6 12 6Z"
                fill="#fff"
              />
            </svg>
          </div>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome to Lumera Shop Manager</h2>
            <p style={styles.welcomeSubtitle}>Manage your luxury candle business with ease</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <Link href="/admin/collections/products/create" style={{ ...styles.actionCard, ...styles.actionPrimary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add New Product</span>
          </Link>

          <Link href="/admin/collections/orders" style={{ ...styles.actionCard, ...styles.actionSecondary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h6" />
            </svg>
            <span>View Orders</span>
          </Link>

          <Link href="/admin/collections/collections" style={{ ...styles.actionCard, ...styles.actionTertiary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Manage Collections</span>
          </Link>

          <Link href="/admin/collections/subscribers" style={{ ...styles.actionCard, ...styles.actionQuaternary }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span>Subscribers</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardBanner
