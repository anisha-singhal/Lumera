'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Upload, X, Plus, Loader2 } from 'lucide-react'

interface ProductForm {
  name: string
  slug: string
  tagline: string
  description: string
  price: string
  compareAtPrice: string
  productCollection: string
  status: 'draft' | 'active' | 'archived'
  featured: boolean
  bestSeller: boolean
  newArrival: boolean
  quantity: string
  waxType: string
  burnTimeMin: string
  burnTimeMax: string
  weight: string
  promoTag: string
}

interface Fragrance {
  id: string
  name: string
  slug: string
}

const initialForm: ProductForm = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  price: '',
  compareAtPrice: '',
  productCollection: '',
  status: 'draft',
  featured: false,
  bestSeller: false,
  newArrival: false,
  quantity: '0',
  waxType: 'soy-coconut',
  burnTimeMin: '',
  burnTimeMax: '',
  weight: '',
  promoTag: '',
}

export default function NewProductPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<ProductForm>(initialForm)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [collections, setCollections] = useState<Array<{ id: string; name: string }>>([])
  const [fragrances, setFragrances] = useState<Fragrance[]>([])
  const [selectedFragrances, setSelectedFragrances] = useState<string[]>([])
  const [newFragranceName, setNewFragranceName] = useState('')
  const [addingFragrance, setAddingFragrance] = useState(false)

  // Fetch collections and fragrances on mount
  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch('/api/collections')
        if (response.ok) {
          const data = await response.json()
          setCollections(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to fetch collections:', err)
      }
    }

    async function fetchFragrances() {
      try {
        const response = await fetch('/api/fragrances')
        if (response.ok) {
          const data = await response.json()
          setFragrances(data.docs || [])
        }
      } catch (err) {
        console.error('Failed to fetch fragrances:', err)
      }
    }

    fetchCollections()
    fetchFragrances()
  }, [])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setForm(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 images
    const newImages = [...images, ...files].slice(0, 5)
    setImages(newImages)

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file))
    setImagePreviews(prev => {
      // Revoke old URLs to prevent memory leaks
      prev.forEach(url => URL.revokeObjectURL(url))
      return newPreviews
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  const toggleFragrance = (fragranceId: string) => {
    setSelectedFragrances(prev =>
      prev.includes(fragranceId)
        ? prev.filter(id => id !== fragranceId)
        : [...prev, fragranceId]
    )
  }

  const addNewFragrance = async () => {
    if (!newFragranceName.trim()) return

    setAddingFragrance(true)
    try {
      const slug = newFragranceName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const response = await fetch('/api/fragrances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFragranceName.trim(), slug }),
      })

      if (response.ok) {
        const newFragrance = await response.json()
        setFragrances(prev => [...prev, newFragrance])
        setSelectedFragrances(prev => [...prev, newFragrance.id])
        setNewFragranceName('')
      }
    } catch (err) {
      console.error('Failed to add fragrance:', err)
    } finally {
      setAddingFragrance(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (images.length === 0) {
      setError('Please upload at least one product image')
      setLoading(false)
      return
    }

    if (!form.productCollection) {
      setError('Please select a collection')
      setLoading(false)
      return
    }

    if (!form.description) {
      setError('Please enter a product description')
      setLoading(false)
      return
    }

    if (!form.burnTimeMin || !form.burnTimeMax) {
      setError('Please enter both minimum and maximum burn time')
      setLoading(false)
      return
    }

    if (selectedFragrances.length === 0) {
      setError('Please select at least one fragrance option')
      setLoading(false)
      return
    }

    try {
      // First upload images
      const uploadedImageIds: string[] = []

      for (const image of images) {
        const formData = new FormData()
        formData.append('file', image)

        console.log('Uploading image:', image.name, 'type:', image.type)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const uploadData = await uploadResponse.json()
        console.log('Upload response:', uploadData)

        if (uploadResponse.ok && uploadData.id) {
          uploadedImageIds.push(uploadData.id)
        } else {
          throw new Error(uploadData.error || 'Failed to upload image')
        }
      }

      console.log('All uploaded image IDs:', uploadedImageIds)

      // Then create the product
      const productData = {
        name: form.name,
        slug: form.slug,
        tagline: form.tagline,
        promoTag: form.promoTag,
        description: form.description,
        pricing: {
          price: parseFloat(form.price) || 0,
          compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        },
        productCollection: form.productCollection,
        status: form.status,
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        inventory: {
          quantity: parseInt(form.quantity) || 0,
          trackInventory: true,
        },
        specifications: {
          waxType: form.waxType,
          burnTime: {
            minimum: parseInt(form.burnTimeMin) || 1,
            maximum: parseInt(form.burnTimeMax) || 1,
          },
          weight: {
            value: parseInt(form.weight) || 0,
            unit: 'g',
          },
        },
        availableFragrances: selectedFragrances,
        images: uploadedImageIds.map((id, index) => ({
          image: id,
          isPrimary: index === 0,
        })),
      }

      console.log('Product data being sent:', JSON.stringify(productData, null, 2))

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        router.push('/dashboard/products')
      } else {
        const data = await response.json()
        console.error('Product creation error:', data)
        setError(data.error || 'Failed to create product')
      }
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred while creating the product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new candle product for your store.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleNameChange}
                required
                placeholder="e.g., Lavender Dreams"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug
              </label>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="lavender-dreams"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="e.g., A calming embrace"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo Tag
              </label>
              <input
                type="text"
                name="promoTag"
                value={form.promoTag}
                onChange={handleChange}
                placeholder="e.g., Buy 1 Get 1 Free"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
              <p className="mt-1 text-[10px] text-gray-400">
                Optional: This will be highlighted on collection pages.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe your candle..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images *</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-[#1e3a5f] text-white px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
                >
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-xs">Upload</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              Upload at least 1 image (up to 5). Formats: JPG, PNG, WebP. <span className="text-amber-600 font-medium">HEIC not supported.</span>
            </p>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="999"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare at Price (₹)
              </label>
              <input
                type="number"
                name="compareAtPrice"
                value={form.compareAtPrice}
                onChange={handleChange}
                min="0"
                placeholder="1299"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                placeholder="10"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Organization */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Organization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection *
              </label>
              <select
                name="productCollection"
                value={form.productCollection}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="">Select a collection</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
              {collections.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No collections found. <Link href="/dashboard/collections" className="underline">Create one first</Link>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={form.bestSeller}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">Best Seller</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={form.newArrival}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                />
                <span className="text-sm text-gray-700">New Arrival</span>
              </label>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wax Type
              </label>
              <select
                name="waxType"
                value={form.waxType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] bg-white"
              >
                <option value="soy">Soy Wax</option>
                <option value="coconut">Coconut Wax</option>
                <option value="soy-coconut">Soy & Coconut Blend</option>
                <option value="beeswax">Beeswax</option>
                <option value="paraffin-free">Paraffin-Free Blend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (grams) *
              </label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                required
                min="1"
                placeholder="200"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burn Time Min (hours) *
              </label>
              <input
                type="number"
                name="burnTimeMin"
                value={form.burnTimeMin}
                onChange={handleChange}
                required
                min="1"
                placeholder="40"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Burn Time Max (hours) *
              </label>
              <input
                type="number"
                name="burnTimeMax"
                value={form.burnTimeMax}
                onChange={handleChange}
                required
                min="1"
                placeholder="50"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              />
            </div>
          </div>
        </div>

        {/* Available Fragrances */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Fragrances *</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select which fragrances customers can choose from for this candle (select 1 or more)
          </p>

          {/* Existing fragrances */}
          {fragrances.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {fragrances.map(fragrance => (
                <label
                  key={fragrance.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedFragrances.includes(fragrance.id)
                      ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFragrances.includes(fragrance.id)}
                    onChange={() => toggleFragrance(fragrance.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                  />
                  <span className="text-sm text-gray-700">{fragrance.name}</span>
                </label>
              ))}
            </div>
          )}

          {/* Add new fragrance inline */}
          <div className="flex gap-2 items-center pt-3 border-t border-gray-100">
            <input
              type="text"
              value={newFragranceName}
              onChange={(e) => setNewFragranceName(e.target.value)}
              placeholder="Enter fragrance name (e.g., Lavender Dreams)"
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addNewFragrance()
                }
              }}
            />
            <button
              type="button"
              onClick={addNewFragrance}
              disabled={addingFragrance || !newFragranceName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded-lg hover:bg-[#2a4d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addingFragrance ? 'Adding...' : '+ Add'}
            </button>
          </div>

          {selectedFragrances.length > 0 && (
            <p className="mt-3 text-xs text-gray-500">
              {selectedFragrances.length} fragrance{selectedFragrances.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2a4d7a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
