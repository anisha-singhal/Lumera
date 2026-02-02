'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface StoreSettings {
  shippingCost: number
  freeShippingThreshold: number
  taxRate?: number
  storeName?: string
  storeEmail?: string
  storePhone?: string
}

interface SettingsContextType {
  settings: StoreSettings
  loading: boolean
  error: string | null
  refreshSettings: () => Promise<void>
}

const defaultSettings: StoreSettings = {
  shippingCost: 49,
  freeShippingThreshold: 999,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Cache settings in memory
let cachedSettings: StoreSettings | null = null
let cacheTimestamp: number | null = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(cachedSettings || defaultSettings)
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async (force = false) => {
    // Use cached data if available and not expired
    if (
      !force &&
      cachedSettings &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      setSettings(cachedSettings)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        const fetchedSettings: StoreSettings = {
          shippingCost: data.shippingCost || defaultSettings.shippingCost,
          freeShippingThreshold: data.freeShippingThreshold || defaultSettings.freeShippingThreshold,
          taxRate: data.taxRate,
          storeName: data.storeName,
          storeEmail: data.storeEmail,
          storePhone: data.storePhone,
        }

        // Update cache
        cachedSettings = fetchedSettings
        cacheTimestamp = Date.now()

        setSettings(fetchedSettings)
      } else {
        throw new Error('Failed to fetch settings')
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      setError('Failed to load settings')
      // Use cached data or defaults as fallback
      if (cachedSettings) {
        setSettings(cachedSettings)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const refreshSettings = useCallback(async () => {
    await fetchSettings(true)
  }, [fetchSettings])

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
