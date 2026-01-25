'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag, DollarSign, Users, Loader2 } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
}

interface RecentOrder {
  id: string
  customer: string
  amount: number
  status: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentOrders(data.recentOrders)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f] mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading dashboard overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders.toString() || '0'}
          subtitle="All time"
          icon={ShoppingBag}
          trend={{ value: 'Real-time data', isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue.toLocaleString('en-IN') || '0'}`}
          subtitle="Confirmed payments"
          icon={DollarSign}
          trend={{ value: 'Real-time data', isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers.toString() || '0'}
          subtitle="Registered users"
          icon={Users}
          trend={{ value: 'Real-time data', isPositive: true }}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#1e3a5f]">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{order.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No orders found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <a
            href="/dashboard/orders"
            className="text-sm font-medium text-[#1e3a5f] hover:text-[#2a4d7a] transition-colors"
          >
            View all orders →
          </a>
        </div>
      </div>
    </div>
  )
}
