'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, Loader2, Star, MessageSquareQuote, CheckCircle2, EyeOff, Upload, ImageIcon, X, Video } from 'lucide-react'

interface Review {
  id: string
  author: string
  location?: string
  rating: number
  content: string
  verifiedBuyer?: boolean
  featured?: boolean
  status: 'published' | 'hidden'
  displayOrder?: number
}

interface GalleryItem {
  id: string
  url: string
  caption?: string
}

interface VideoItem {
  id: string
  videoUrl: string
  posterUrl?: string | null
  author?: string
  location?: string
}

const emptyForm = {
  author: '',
  location: '',
  rating: 5,
  content: '',
  verifiedBuyer: true,
  featured: true,
  status: 'published' as 'published' | 'hidden',
  displayOrder: 0,
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  // Gallery ("Loved in Real Life") management
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [galleryError, setGalleryError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Video reviews
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [videosLoading, setVideosLoading] = useState(true)
  const [videoUploading, setVideoUploading] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [videoAuthor, setVideoAuthor] = useState('')
  const [videoLocation, setVideoLocation] = useState('')
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchReviews()
    fetchGallery()
    fetchVideos()
  }, [])

  async function fetchVideos() {
    setVideosLoading(true)
    try {
      const res = await fetch('/api/video-reviews?all=true')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to fetch video reviews:', err)
    } finally {
      setVideosLoading(false)
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = (e.target.files || [])[0]
    if (!file) return
    setVideoUploading(true)
    setVideoError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const up = await fetch('/api/upload-video', { method: 'POST', body: fd })
      const upData = await up.json()
      if (!up.ok || !upData.id) throw new Error(upData.error || 'Failed to upload video')

      const create = await fetch('/api/video-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: upData.id,
          author: videoAuthor,
          location: videoLocation,
          displayOrder: videos.length,
        }),
      })
      if (!create.ok) {
        const d = await create.json()
        throw new Error(d.error || 'Failed to add video review')
      }
      setVideoAuthor('')
      setVideoLocation('')
      fetchVideos()
    } catch (err: any) {
      setVideoError(err.message || 'Upload failed')
    } finally {
      setVideoUploading(false)
      if (videoInputRef.current) videoInputRef.current.value = ''
    }
  }

  async function handleVideoDelete(id: string) {
    if (!confirm('Remove this video review?')) return
    try {
      const res = await fetch(`/api/video-reviews/${id}`, { method: 'DELETE' })
      if (res.ok) fetchVideos()
    } catch (err) {
      console.error('Failed to delete video review:', err)
    }
  }

  async function fetchGallery() {
    setGalleryLoading(true)
    try {
      const res = await fetch('/api/review-gallery?all=true')
      if (res.ok) {
        const data = await res.json()
        setGallery(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err)
    } finally {
      setGalleryLoading(false)
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    setGalleryError('')
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData()
        fd.append('file', files[i])
        const up = await fetch('/api/upload', { method: 'POST', body: fd })
        const upData = await up.json()
        if (!up.ok || !upData.id) throw new Error(upData.error || `Failed to upload ${files[i].name}`)
        const create = await fetch('/api/review-gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: upData.id, displayOrder: gallery.length + i }),
        })
        if (!create.ok) {
          const d = await create.json()
          throw new Error(d.error || 'Failed to add image')
        }
      }
      fetchGallery()
    } catch (err: any) {
      setGalleryError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleGalleryDelete(id: string) {
    if (!confirm('Remove this image from the gallery?')) return
    try {
      const res = await fetch(`/api/review-gallery/${id}`, { method: 'DELETE' })
      if (res.ok) fetchGallery()
    } catch (err) {
      console.error('Failed to delete gallery image:', err)
    }
  }

  async function fetchReviews() {
    setLoading(true)
    try {
      const res = await fetch('/api/reviews?all=true')
      if (res.ok) {
        const data = await res.json()
        setReviews(data.docs || [])
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews'
      const method = editingId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, rating: Number(form.rating), displayOrder: Number(form.displayOrder) }),
      })
      if (res.ok) {
        setShowForm(false)
        resetForm()
        fetchReviews()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save review')
      }
    } catch {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (r: Review) => {
    setForm({
      author: r.author,
      location: r.location || '',
      rating: r.rating,
      content: r.content,
      verifiedBuyer: r.verifiedBuyer ?? true,
      featured: r.featured ?? true,
      status: r.status,
      displayOrder: r.displayOrder ?? 0,
    })
    setEditingId(r.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) fetchReviews()
    } catch (err) {
      console.error('Failed to delete review:', err)
    }
  }

  const inputCls =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020]'

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add customer reviews — they appear on the storefront Reviews page.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#5c0017] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E7DED4] p-6 mb-8 max-w-2xl shadow-[0_2px_16px_rgba(128,0,32,0.04)]">
          <h2 className="text-lg font-medium text-gray-900 mb-4">{editingId ? 'Edit Review' : 'New Review'}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  required
                  placeholder="e.g., Priya M."
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g., Delhi"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating *</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    aria-label={`${n} stars`}
                    className="p-1"
                  >
                    <Star
                      className="w-7 h-7"
                      fill={n <= form.rating ? '#C9A24D' : 'none'}
                      stroke={n <= form.rating ? '#C9A24D' : '#cbd5e1'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">{form.rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={4}
                placeholder="What the customer said…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'hidden' })}
                  className={`${inputCls} bg-white`}
                >
                  <option value="published">Published</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 py-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.verifiedBuyer}
                  onChange={(e) => setForm({ ...form, verifiedBuyer: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm text-gray-700">Verified Buyer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#800020] focus:ring-[#800020]"
                />
                <span className="text-sm text-gray-700">Show on Reviews page</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#5c0017] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>{editingId ? 'Update' : 'Create'} Review</>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#E7DED4] overflow-hidden shadow-[0_2px_16px_rgba(128,0,32,0.04)]">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#800020] mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquareQuote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              Add your first customer review — it will appear on the storefront Reviews page.
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#5c0017]"
              >
                <Plus className="w-4 h-4" /> Add Your First Review
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{r.author}</p>
                    {r.location && <span className="text-xs text-gray-400">{r.location}</span>}
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5" fill="#C9A24D" stroke="#C9A24D" />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">{r.content}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {r.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                    {r.verifiedBuyer && (
                      <span className="text-[11px] text-[#800020]">Verified Buyer</span>
                    )}
                    {r.featured && <span className="text-[11px] text-gray-400">• On Reviews page</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(r)}
                    className="p-2 text-gray-400 hover:text-[#800020] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== Gallery manager ("Loved in Real Life") ===== */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gallery — "Loved in Real Life"</h2>
            <p className="mt-1 text-sm text-gray-500">
              These images show in the gallery grid on the Reviews page. Upload to add, hover to remove.
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#5c0017] disabled:opacity-50 transition-colors"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
          />
        </div>

        {galleryError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{galleryError}</div>
        )}

        <div className="bg-white rounded-2xl border border-[#E7DED4] p-5 shadow-[0_2px_16px_rgba(128,0,32,0.04)]">
          {galleryLoading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#800020] mx-auto" />
            </div>
          ) : gallery.length === 0 ? (
            <div className="py-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-1">No gallery images yet.</p>
              <p className="text-xs text-gray-400">
                Until you add some, the Reviews page shows a default set of images.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {gallery.map((g) => (
                <div key={g.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt={g.caption || 'Gallery image'} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleGalleryDelete(g.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Video reviews manager ===== */}
      <div className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Video Reviews</h2>
          <p className="mt-1 text-sm text-gray-500">
            Short MP4 clips shown in the "Video Reviews" section on the Reviews page. Keep each clip under 4MB (a 15–30s vertical video).
          </p>
        </div>

        {videoError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{videoError}</div>
        )}

        <div className="bg-white rounded-2xl border border-[#E7DED4] p-5 shadow-[0_2px_16px_rgba(128,0,32,0.04)]">
          {/* Upload row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end pb-5 mb-5 border-b border-gray-100">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name (optional)</label>
              <input
                type="text"
                value={videoAuthor}
                onChange={(e) => setVideoAuthor(e.target.value)}
                placeholder="e.g., Priya M."
                className={inputCls}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
              <input
                type="text"
                value={videoLocation}
                onChange={(e) => setVideoLocation(e.target.value)}
                placeholder="e.g., Delhi"
                className={inputCls}
              />
            </div>
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={videoUploading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#800020] text-white text-sm font-medium rounded-lg hover:bg-[#5c0017] disabled:opacity-50 transition-colors shrink-0"
            >
              {videoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {videoUploading ? 'Uploading...' : 'Upload MP4'}
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </div>

          {videosLoading ? (
            <div className="py-8 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[#800020] mx-auto" />
            </div>
          ) : videos.length === 0 ? (
            <div className="py-10 text-center">
              <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No video reviews yet.</p>
              <p className="text-xs text-gray-400">Add a name/location above (optional), then upload an MP4.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {videos.map((v) => (
                <div key={v.id} className="relative group">
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-black">
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video src={v.videoUrl} poster={v.posterUrl || undefined} controls preload="metadata" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleVideoDelete(v.id)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {(v.author || v.location) && (
                    <div className="mt-1.5 text-center">
                      {v.author && <p className="text-xs font-medium text-gray-800 truncate">{v.author}</p>}
                      {v.location && <p className="text-[11px] text-gray-400 truncate">{v.location}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
