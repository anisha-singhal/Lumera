'use client'

import React from 'react'
import Link from 'next/link'

export const DashboardBanner: React.FC = () => {
  return (
    <div className="lumera-dashboard-banner">
      {/* Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="flame-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 8 8 8 14C8 18 10 22 12 22C14 22 16 18 16 14C16 8 12 2 12 2Z"
                fill="#D4AF37"
                opacity="0.8"
              />
              <path
                d="M12 6C12 6 10 10 10 14C10 16.5 11 19 12 19C13 19 14 16.5 14 14C14 10 12 6 12 6Z"
                fill="#800020"
              />
            </svg>
          </div>
          <div className="welcome-text">
            <h2>Welcome to Lumera Shop Manager</h2>
            <p>Manage your luxury candle business with ease</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link href="/admin/collections/products/create" className="action-card action-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Add New Product</span>
          </Link>
          
          <Link href="/admin/collections/orders" className="action-card action-secondary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h6" />
            </svg>
            <span>View Orders</span>
          </Link>
          
          <Link href="/admin/collections/collections" className="action-card action-tertiary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Manage Collections</span>
          </Link>
          
          <Link href="/admin/collections/subscribers" className="action-card action-quaternary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span>Subscribers</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .lumera-dashboard-banner {
          padding: 24px;
          margin-bottom: 24px;
        }

        .welcome-card {
          background: linear-gradient(135deg, #fdfcfb 0%, #f9f6ee 100%);
          border: 1px solid rgba(128, 0, 32, 0.1);
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(128, 0, 32, 0.06);
        }

        .welcome-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(128, 0, 32, 0.1);
        }

        .flame-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #800020 0%, #5c0017 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flame-icon svg path:first-child {
          fill: #D4AF37;
        }
        .flame-icon svg path:last-child {
          fill: #fff;
        }

        .welcome-text h2 {
          font-family: Georgia, serif;
          font-size: 24px;
          font-weight: 500;
          color: #800020;
          margin: 0 0 4px 0;
        }

        .welcome-text p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .quick-actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.2s ease;
          font-weight: 500;
          font-size: 14px;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .action-card svg {
          flex-shrink: 0;
        }

        .action-primary {
          background: linear-gradient(135deg, #800020 0%, #5c0017 100%);
          color: #fff;
        }

        .action-secondary {
          background: #fff;
          border: 1px solid rgba(128, 0, 32, 0.2);
          color: #800020;
        }

        .action-tertiary {
          background: #fff;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #8B6914;
        }

        .action-quaternary {
          background: #fff;
          border: 1px solid rgba(128, 0, 32, 0.15);
          color: #555;
        }

        @media (max-width: 768px) {
          .lumera-dashboard-banner {
            padding: 16px;
          }

          .welcome-card {
            padding: 20px;
          }

          .welcome-header {
            flex-direction: column;
            text-align: center;
          }

          .welcome-text h2 {
            font-size: 20px;
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default DashboardBanner

