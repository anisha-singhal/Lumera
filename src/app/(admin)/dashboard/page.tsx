import { ShoppingBag, DollarSign, Users } from 'lucide-react'
import StatCard from '@/components/admin/StatCard'

// Dummy data - will be replaced with MongoDB data later
const stats = {
  totalOrders: 156,
  totalRevenue: 245680,
  totalCustomers: 89,
}

// Recent orders for quick view
const recentOrders = [
  { id: 'LUM2501A1', customer: 'Priya Sharma', amount: 2499, status: 'Paid' },
  { id: 'LUM2501A2', customer: 'Rahul Verma', amount: 1299, status: 'Paid' },
  { id: 'LUM2501A3', customer: 'Anita Desai', amount: 3999, status: 'Pending' },
  { id: 'LUM2501A4', customer: 'Vikram Singh', amount: 1899, status: 'Paid' },
  { id: 'LUM2501A5', customer: 'Meera Patel', amount: 4599, status: 'Pending' },
]

export default function DashboardPage() {
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
          value={stats.totalOrders.toString()}
          subtitle="All time"
          icon={ShoppingBag}
          trend={{ value: '12% from last month', isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          subtitle="All time"
          icon={DollarSign}
          trend={{ value: '8% from last month', isPositive: true }}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          subtitle="Registered users"
          icon={Users}
          trend={{ value: '5% from last month', isPositive: true }}
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
              {recentOrders.map((order) => (
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
              ))}
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
