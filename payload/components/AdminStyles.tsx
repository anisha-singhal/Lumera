'use client'

import React from 'react'

/**
 * AdminStyles component
 * Injects custom Lumera brand styles into the Payload admin panel
 */
export const AdminStyles: React.FC = () => {
  return (
    <style jsx global>{`
      /* Lumera Admin Brand Styles */
      
      /* Custom accent colors for buttons */
      .btn.btn--style-primary {
        background-color: #800020 !important;
        border-color: #800020 !important;
      }
      
      .btn.btn--style-primary:hover {
        background-color: #5c0017 !important;
        border-color: #5c0017 !important;
      }
      
      /* Custom selection color */
      ::selection {
        background-color: rgba(128, 0, 32, 0.2);
        color: #800020;
      }
      
      /* Dashboard welcome styling */
      .dashboard-banner {
        background: linear-gradient(135deg, #F6F1EB 0%, #E7DED4 100%);
        border: 1px solid rgba(128, 0, 32, 0.1);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 24px;
      }
      
      .dashboard-banner h2 {
        color: #800020;
        font-weight: 600;
      }
    `}</style>
  )
}

export default AdminStyles

