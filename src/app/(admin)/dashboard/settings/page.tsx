'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Loader2, Truck, Percent, Phone, Sliders, Ticket, Database, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shippingCost: 49,
    freeShippingThreshold: 999,
    gstRate: 18,
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [updatingCollections, setUpdatingCollections] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          shippingCost: data.shippingCost || 49,
          freeShippingThreshold: data.freeShippingThreshold || 999,
          gstRate: data.gstRate || 18,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
        })
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCollections = async () => {
    setUpdatingCollections(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/admin/update-collections', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Collection names updated successfully! Refresh the products page to see changes.' })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update collections.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while updating collections.' })
    } finally {
      setUpdatingCollections(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' })
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your store's global parameters and contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium bg-[#1e3a5f]/5 text-[#1e3a5f] rounded-lg">
            <Sliders className="w-4 h-4" />
            General
          </button>
          <Link 
            href="/dashboard/settings/coupons"
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Ticket className="w-4 h-4" />
            Coupons
          </Link>
        </div>

        {/* Form Content */}
        <div className="md:col-span-3">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
                <Truck className="w-5 h-5" />
                <h2 className="font-medium">Shipping Configuration</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Standard Shipping (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shippingCost}
                    onChange={(e) => setSettings({ ...settings, shippingCost: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
              </div>
            </div>

            {/* Taxes */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
                <Percent className="w-5 h-5" />
                <h2 className="font-medium">Taxation</h2>
              </div>
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  value={settings.gstRate}
                  onChange={(e) => setSettings({ ...settings, gstRate: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                />
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
                <Phone className="w-5 h-5" />
                <h2 className="font-medium">Support Contact</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="Info@lumeracandles.in"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Support Phone
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg hover:bg-[#2a4d7a] disabled:opacity-50 transition-all shadow-lg shadow-[#1e3a5f]/20"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Database Maintenance */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-4 text-[#1e3a5f]">
              <Database className="w-5 h-5" />
              <h2 className="font-medium">Database Maintenance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Update Collection Names</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Updates collection names to: Prestige, State of Being, Mineral & Texture
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUpdateCollections}
                  disabled={updatingCollections}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#600018] disabled:opacity-50 transition-colors"
                >
                  {updatingCollections ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
