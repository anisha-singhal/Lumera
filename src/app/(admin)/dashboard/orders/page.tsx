'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronDown, Loader2, X, MapPin, Phone, Mail, Package } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  customer: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  shippingAddress?: {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    country?: string
  }
  items?: Array<{
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
    fragrance?: string
    isCustomCandle?: boolean
    customOptions?: {
      vessel?: string
      fragranceFamily?: string
      fragranceMode?: string
      primaryScent?: string
      secondaryScent?: string
      waxType?: string
      waxColor?: string
      wickType?: string
      labelText?: string
      foilFinish?: string
      packaging?: string
      finishingTouches?: string[]
    }
  }>
  pricing: {
    total: number
    subtotal?: number
    shipping?: {
      cost: number
    }
    discount?: {
      amount: number
      code?: string
    }
  }
  payment?: {
    status: string
    method?: string
  }
  status: string
  customerNotes?: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  async function fetchOrders() {
    setLoading(true)
    try {
      let url = `/api/orders?status=${statusFilter}`
      if (searchQuery) url += `&q=${searchQuery}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.docs || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and track all customer orders.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-colors"
            />
          </form>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white cursor-pointer transition-colors"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f] mx-auto mb-4" />
              <p className="text-sm text-gray-500">Fetching orders...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[#1e3a5f]">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{order.pricing.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            order.payment?.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.payment?.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-sm text-[#1e3a5f] hover:text-[#2a4d7a] font-medium transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {orders.length} orders
          </p>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {selectedOrder.customer.email}
                  </div>
                  {selectedOrder.customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {selectedOrder.customer.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedOrder.shippingAddress ? (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p>{selectedOrder.shippingAddress.addressLine1}</p>
                        {selectedOrder.shippingAddress.addressLine2 && (
                          <p>{selectedOrder.shippingAddress.addressLine2}</p>
                        )}
                        <p>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country || 'India'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping address available</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {item.productName}
                                {item.isCustomCandle && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    Custom
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unitPrice}</p>

                              {/* Fragrance for regular candles */}
                              {item.fragrance && !item.isCustomCandle && (
                                <p className="text-xs text-amber-700 mt-1">
                                  🕯️ Fragrance: {item.fragrance}
                                </p>
                              )}

                              {/* Custom Candle Details */}
                              {item.isCustomCandle && item.customOptions && (
                                <div className="mt-2 text-xs text-gray-600 space-y-1 bg-purple-50 rounded p-2">
                                  {item.customOptions.vessel && (
                                    <p><span className="font-medium">Vessel:</span> {item.customOptions.vessel}</p>
                                  )}
                                  {(item.customOptions.primaryScent || item.customOptions.secondaryScent) && (
                                    <p>
                                      <span className="font-medium">Scent:</span>{' '}
                                      {item.customOptions.primaryScent}
                                      {item.customOptions.secondaryScent && ` + ${item.customOptions.secondaryScent}`}
                                    </p>
                                  )}
                                  {item.customOptions.fragranceFamily && (
                                    <p><span className="font-medium">Family:</span> {item.customOptions.fragranceFamily}</p>
                                  )}
                                  {item.customOptions.waxType && (
                                    <p><span className="font-medium">Wax:</span> {item.customOptions.waxType}</p>
                                  )}
                                  {item.customOptions.waxColor && (
                                    <p><span className="font-medium">Wax Color:</span> {item.customOptions.waxColor}</p>
                                  )}
                                  {item.customOptions.wickType && (
                                    <p><span className="font-medium">Wick:</span> {item.customOptions.wickType}</p>
                                  )}
                                  {item.customOptions.labelText && (
                                    <p><span className="font-medium">Label:</span> "{item.customOptions.labelText}"</p>
                                  )}
                                  {item.customOptions.foilFinish && (
                                    <p><span className="font-medium">Foil:</span> {item.customOptions.foilFinish}</p>
                                  )}
                                  {item.customOptions.packaging && (
                                    <p><span className="font-medium">Packaging:</span> {item.customOptions.packaging}</p>
                                  )}
                                  {item.customOptions.finishingTouches && item.customOptions.finishingTouches.length > 0 && (
                                    <p><span className="font-medium">Finishing:</span> {item.customOptions.finishingTouches.join(', ')}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">₹{item.totalPrice}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {selectedOrder.pricing.subtotal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">₹{selectedOrder.pricing.subtotal}</span>
                    </div>
                  )}
                  {selectedOrder.pricing.shipping && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">₹{selectedOrder.pricing.shipping.cost}</span>
                    </div>
                  )}
                  {selectedOrder.pricing.discount && selectedOrder.pricing.discount.amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Discount {selectedOrder.pricing.discount.code && `(${selectedOrder.pricing.discount.code})`}
                      </span>
                      <span className="text-green-600">-₹{selectedOrder.pricing.discount.amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{selectedOrder.pricing.total}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Status */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Payment</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        selectedOrder.payment?.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedOrder.payment?.status || 'Pending'}
                    </span>
                    {selectedOrder.payment?.method && (
                      <span className="text-xs text-gray-500 capitalize">
                        via {selectedOrder.payment.method}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Order Status</h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize bg-blue-100 text-blue-800">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Notes */}
              {selectedOrder.customerNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Customer Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                    {selectedOrder.customerNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2a4d7a] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
