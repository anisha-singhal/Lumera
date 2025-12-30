'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header, Footer } from '@/components/layout'
import { useAuth, useOrders } from '@/context'
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react'

type TabType = 'profile' | 'orders' | 'addresses' | 'settings'

export default function AccountPage() {
  const router = useRouter()
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateProfile,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    setIsAuthModalOpen,
    changePassword,
    deleteAccount,
  } = useAuth()
  const { orders, clearOrders } = useOrders()

  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  })

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const selectedOrder = selectedOrderId
    ? orders.find((order) => order.id === selectedOrderId) || null
    : null

  // Show login modal if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen bg-cream-100">
          <div className="section-container py-20">
            <div className="max-w-md mx-auto text-center">
              <User className="w-20 h-20 mx-auto text-burgundy-700/20 mb-6" />
              <h1 className="font-serif text-3xl text-burgundy-700 mb-4">
                Welcome to Lumera
              </h1>
              <p className="text-burgundy-700/60 font-sans mb-8">
                Sign in to access your account, view orders, manage addresses, and more.
              </p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary"
              >
                Sign In / Create Account
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleProfileUpdate = () => {
    updateProfile({
      name: profileForm.name,
      phone: profileForm.phone,
    })
    setIsEditing(false)
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    addAddress(addressForm)
    setAddressForm({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    })
    setShowAddAddress(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleOpenOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsOrderDetailsOpen(true)
  }

  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false)
    setSelectedOrderId(null)
  }

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password should be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    setIsChangingPassword(true)
    const result = await changePassword(currentPassword, newPassword)
    setIsChangingPassword(false)

    if (!result.success) {
      setPasswordError(result.error || 'Failed to change password. Please try again.')
      return
    }

    setPasswordSuccess('Password updated successfully.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleConfirmDeleteAccount = async () => {
    setDeleteError('')
    setIsDeletingAccount(true)
    try {
      clearOrders()
      await deleteAccount()
    } catch (error) {
      console.error(error)
      setDeleteError('Failed to delete account. Please try again.')
      setIsDeletingAccount(false)
    }
  }

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'addresses' as TabType, label: 'Addresses', icon: MapPin },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ]

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-cream-100">
        {/* Hero */}
        <section className="bg-cream-200/50 py-8">
          <div className="section-container">
            <div>
              <p className="text-sm font-sans tracking-wider uppercase text-burgundy-700/50 mb-1">
                My Account
              </p>
              <h1 className="font-serif text-3xl text-burgundy-700">
                Hello, {user?.name || 'Guest'}
              </h1>
            </div>
          </div>
        </section>

        <section className="section-spacing">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-burgundy-700 text-cream-100'
                          : 'text-burgundy-700 hover:bg-burgundy-700/5'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-sans">{tab.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                        activeTab === tab.id ? 'rotate-90' : ''
                      }`} />
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-burgundy-700/70 hover:text-burgundy-700 hover:bg-burgundy-700/5 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-sans">Logout</span>
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="bg-white/50 border border-burgundy-700/10 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-2xl text-burgundy-700">Profile Information</h2>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="flex items-center gap-2 text-sm font-sans text-burgundy-700/70 hover:text-burgundy-700"
                        >
                          <Edit2 className="w-4 h-4" />
                          {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                      </div>

                      {isEditing ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                          <div>
                            <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={profileForm.name}
                              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              className="w-full px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={profileForm.email}
                              disabled
                              className="w-full px-4 py-3 bg-cream-200/30 border border-burgundy-700/10 text-burgundy-700/50 font-sans cursor-not-allowed"
                            />
                            <p className="text-xs text-burgundy-700/40 mt-1">Email cannot be changed</p>
                          </div>
                          <div>
                            <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileForm.phone}
                              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                              placeholder="+91 XXXXX XXXXX"
                              className="w-full px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                          </div>
                          <button type="submit" className="btn-primary">
                            Save Changes
                          </button>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 py-3 border-b border-burgundy-700/10">
                            <span className="w-32 text-burgundy-700/60 font-sans">Name</span>
                            <span className="text-burgundy-700 font-sans">{user?.name}</span>
                          </div>
                          <div className="flex items-center gap-4 py-3 border-b border-burgundy-700/10">
                            <span className="w-32 text-burgundy-700/60 font-sans">Email</span>
                            <span className="text-burgundy-700 font-sans">{user?.email}</span>
                          </div>
                          <div className="flex items-center gap-4 py-3 border-b border-burgundy-700/10">
                            <span className="w-32 text-burgundy-700/60 font-sans">Phone</span>
                            <span className="text-burgundy-700 font-sans">{user?.phone || 'Not added'}</span>
                          </div>
                          <div className="flex items-center gap-4 py-3">
                            <span className="w-32 text-burgundy-700/60 font-sans">Member Since</span>
                            <span className="text-burgundy-700 font-sans">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }) : '-'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div className="space-y-4">
                      <h2 className="font-serif text-2xl text-burgundy-700 mb-6">Order History</h2>

                      {orders.length === 0 ? (
                        <div className="bg-white/50 border border-burgundy-700/10 p-12 text-center">
                          <Package className="w-16 h-16 mx-auto text-burgundy-700/20 mb-4" />
                          <p className="text-burgundy-700/60 font-sans mb-4">No orders yet</p>
                          <Link href="/collections" className="btn-primary">
                            Start Shopping
                          </Link>
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-white/50 border border-burgundy-700/10 p-6"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                              <div>
                                <p className="font-serif text-lg text-burgundy-700">{order.id}</p>
                                <p className="text-sm text-burgundy-700/60 font-sans">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-xs font-sans tracking-wider uppercase ${
                                  order.status.toLowerCase().includes('delivered')
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-champagne-100 text-champagne-700'
                                }`}>
                                  {order.status}
                                </span>
                                <span className="font-sans font-medium text-burgundy-700">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                            </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-burgundy-700/60 font-sans">
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                                <button
                                  onClick={() => handleOpenOrderDetails(order.id)}
                                  className="text-sm font-sans text-burgundy-700 hover:underline"
                                >
                                  View Details
                                </button>
                              </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Addresses Tab */}
                  {activeTab === 'addresses' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-2xl text-burgundy-700">Saved Addresses</h2>
                        <button
                          onClick={() => setShowAddAddress(!showAddAddress)}
                          className="flex items-center gap-2 btn-secondary"
                        >
                          <Plus className="w-4 h-4" />
                          Add New
                        </button>
                      </div>

                      {showAddAddress && (
                        <form onSubmit={handleAddAddress} className="bg-white/50 border border-burgundy-700/10 p-6 mb-6">
                          <h3 className="font-serif text-lg text-burgundy-700 mb-4">Add New Address</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Full Name"
                              value={addressForm.name}
                              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                              required
                              className="px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              required
                              className="px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="text"
                              placeholder="Address Line 1"
                              value={addressForm.addressLine1}
                              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                              required
                              className="md:col-span-2 px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="text"
                              placeholder="Address Line 2 (Optional)"
                              value={addressForm.addressLine2}
                              onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                              className="md:col-span-2 px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="text"
                              placeholder="City"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              required
                              className="px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="text"
                              placeholder="State"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              required
                              className="px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <input
                              type="text"
                              placeholder="Pincode"
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              required
                              pattern="[0-9]{6}"
                              className="px-4 py-3 bg-cream-200/50 border border-burgundy-700/10 text-burgundy-700 placeholder:text-burgundy-700/40 font-sans focus:outline-none focus:border-burgundy-700/30"
                            />
                            <label className="flex items-center gap-2 text-burgundy-700/70 font-sans">
                              <input
                                type="checkbox"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                className="w-4 h-4"
                              />
                              Set as default address
                            </label>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <button type="submit" className="btn-primary">
                              Save Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddAddress(false)}
                              className="btn-ghost"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}

                      {(!user?.addresses || user.addresses.length === 0) && !showAddAddress ? (
                        <div className="bg-white/50 border border-burgundy-700/10 p-12 text-center">
                          <MapPin className="w-16 h-16 mx-auto text-burgundy-700/20 mb-4" />
                          <p className="text-burgundy-700/60 font-sans mb-4">No addresses saved</p>
                          <button
                            onClick={() => setShowAddAddress(true)}
                            className="btn-primary"
                          >
                            Add Address
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {user?.addresses?.map((address) => (
                            <div
                              key={address.id}
                              className={`bg-white/50 border p-6 ${
                                address.isDefault
                                  ? 'border-burgundy-700'
                                  : 'border-burgundy-700/10'
                              }`}
                            >
                              {address.isDefault && (
                                <span className="inline-block px-2 py-1 bg-burgundy-700 text-cream-100 text-xs font-sans tracking-wider uppercase mb-3">
                                  Default
                                </span>
                              )}
                              <p className="font-sans font-medium text-burgundy-700">{address.name}</p>
                              <p className="text-sm text-burgundy-700/70 font-sans mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && <>, {address.addressLine2}</>}
                              </p>
                              <p className="text-sm text-burgundy-700/70 font-sans">
                                {address.city}, {address.state} - {address.pincode}
                              </p>
                              <p className="text-sm text-burgundy-700/70 font-sans mt-1">
                                Phone: {address.phone}
                              </p>
                              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-burgundy-700/10">
                                {!address.isDefault && (
                                  <button
                                    onClick={() => setDefaultAddress(address.id)}
                                    className="text-sm font-sans text-burgundy-700/70 hover:text-burgundy-700"
                                  >
                                    Set as Default
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteAddress(address.id)}
                                  className="text-sm font-sans text-red-600 hover:text-red-700 flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Settings Tab */}
                  {activeTab === 'settings' && (
                    <div className="space-y-6">
                      <h2 className="font-serif text-2xl text-burgundy-700 mb-6">Account Settings</h2>

                      <div className="bg-white/50 border border-burgundy-700/10 p-6">
                        <h3 className="font-serif text-lg text-burgundy-700 mb-4">Notifications</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between">
                            <div>
                              <p className="font-sans text-burgundy-700">Order Updates</p>
                              <p className="text-sm text-burgundy-700/60 font-sans">
                                Receive updates about your orders
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-5 h-5"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <div>
                              <p className="font-sans text-burgundy-700">Promotions</p>
                              <p className="text-sm text-burgundy-700/60 font-sans">
                                Receive offers and promotions
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="w-5 h-5"
                            />
                          </label>
                          <label className="flex items-center justify-between">
                            <div>
                              <p className="font-sans text-burgundy-700">Newsletter</p>
                              <p className="text-sm text-burgundy-700/60 font-sans">
                                Weekly newsletter with tips and new arrivals
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              className="w-5 h-5"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="bg-white/50 border border-burgundy-700/10 p-6">
                        <h3 className="font-serif text-lg text-burgundy-700 mb-4">Security</h3>
                        <button
                          onClick={() => {
                            setIsChangePasswordOpen(true)
                            setPasswordError('')
                            setPasswordSuccess('')
                          }}
                          className="btn-secondary"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="bg-red-50 border border-red-200 p-6">
                        <h3 className="font-serif text-lg text-red-700 mb-2">Danger Zone</h3>
                        <p className="text-sm text-red-600/70 font-sans mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button
                          onClick={() => {
                            setDeleteError('')
                            setIsDeleteConfirmOpen(true)
                          }}
                          className="px-4 py-2 border border-red-600 text-red-600 font-sans text-sm hover:bg-red-600 hover:text-white transition-colors"
                       >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Order Details Modal */}
      {isOrderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white max-w-2xl w-full mx-4 p-6 relative"
          >
            <button
              onClick={handleCloseOrderDetails}
              className="absolute top-4 right-4 text-burgundy-700/60 hover:text-burgundy-700"
              aria-label="Close order details"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-burgundy-700 mb-2">
              Order {selectedOrder.id}
            </h3>
            <p className="text-sm font-sans text-burgundy-700/60 mb-4">
              Placed on{' '}
              {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-serif text-lg text-burgundy-700 mb-2">Items</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm font-sans">
                      <div className="mr-4">
                        <p className="text-burgundy-700">{item.name}</p>
                        <p className="text-burgundy-700/60">
                          Qty {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-burgundy-700 font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif text-lg text-burgundy-700 mb-2">Shipping Address</h4>
                <p className="text-sm font-sans text-burgundy-700/80">
                  {selectedOrder.shippingAddress.fullName}
                  <br />
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <>
                      <br />
                      {selectedOrder.shippingAddress.addressLine2}
                    </>
                  )}
                  <br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                  {selectedOrder.shippingAddress.pincode}
                  <br />
                  Phone: {selectedOrder.shippingAddress.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-burgundy-700/10 pt-4 mt-2">
              <div>
                <p className="text-sm font-sans text-burgundy-700/60">Status</p>
                <p className="text-sm font-sans text-burgundy-700">
                  {selectedOrder.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-sans text-burgundy-700/60">Total</p>
                <p className="font-serif text-xl text-burgundy-700">
                  {formatPrice(selectedOrder.total)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white max-w-md w-full mx-4 p-6 relative"
          >
            <button
              onClick={() => setIsChangePasswordOpen(false)}
              className="absolute top-4 right-4 text-burgundy-700/60 hover:text-burgundy-700"
              aria-label="Close change password"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-burgundy-700 mb-4">Change Password</h3>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-cream-100 border border-burgundy-700/10 text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-cream-100 border border-burgundy-700/10 text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-burgundy-700/70 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-cream-100 border border-burgundy-700/10 text-burgundy-700 font-sans focus:outline-none focus:border-burgundy-700/30"
                  required
                />
              </div>

              {passwordError && (
                <p className="text-sm font-sans text-red-600">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm font-sans text-green-600">{passwordSuccess}</p>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-primary"
                >
                  {isChangingPassword ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Account Confirm Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white max-w-md w-full mx-4 p-6 relative"
          >
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute top-4 right-4 text-burgundy-700/60 hover:text-burgundy-700"
              aria-label="Close delete account confirmation"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl text-red-700 mb-4">Delete Account</h3>
            <p className="text-sm font-sans text-burgundy-700/80 mb-4">
              This will delete your account data from this browser and sign you out.
              Order history stored locally will also be cleared. This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-sm font-sans text-red-600 mb-2">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn-ghost"
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={isDeletingAccount}
                className="px-4 py-2 border border-red-600 text-red-600 font-sans text-sm hover:bg-red-600 hover:text-white transition-colors"
              >
                {isDeletingAccount ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  )
}
