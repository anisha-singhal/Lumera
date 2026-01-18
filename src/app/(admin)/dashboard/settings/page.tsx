import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your store settings.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-[#1e3a5f]" />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Store settings and configuration options will be available here soon.
        </p>
      </div>
    </div>
  )
}
