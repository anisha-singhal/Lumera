'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Trash2, 
  Save, 
  Loader2, 
  Undo, 
  Layers,
  Palette
} from 'lucide-react'
import Link from 'next/link'
import { fabric } from 'fabric'

const LUMERA_COLORS = [
  { name: 'Burgundy', value: '#800020' },
  { name: 'Gold', value: '#C9A24D' },
  { name: 'Cream', value: '#FDFCF8' },
  { name: 'Deep Blue', value: '#1e3a5f' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
]

export default function CreativeStudioPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = params.id as string
  const imageId = searchParams.get('image')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadPhase, setLoadPhase] = useState('Initializing...')
  const [saving, setSaving] = useState(false)
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  // 1. MASTER SAFETY TIMEOUT
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => {
      console.warn('Creative Studio: Master safety timeout triggered.')
      setLoading(false)
      setLoadPhase('Ready')
    }, 12000)
    return () => clearTimeout(timer)
  }, [loading])

  // 2. INITIALIZATION
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    async function init() {
      if (!canvasRef.current) return
      setLoadPhase('Setting up canvas...')

      try {
        if (fabricCanvasRef.current) fabricCanvasRef.current.dispose()

        const canvas = new fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 600,
          backgroundColor: '#f3f4f6',
        })
        fabricCanvasRef.current = canvas

        canvas.on('selection:created', (e: fabric.IEvent) => setActiveObject(e.selected?.[0] || null))
        canvas.on('selection:updated', (e: fabric.IEvent) => setActiveObject(e.selected?.[0] || null))
        canvas.on('selection:cleared', () => setActiveObject(null))

        if (imageId) {
          await fetchAndRenderImage(imageId, canvas)
        } else {
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Creative Studio: Init failed', err)
        setErrorMsg(err.message)
        setLoading(false)
      }
    }

    init()

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose()
        fabricCanvasRef.current = null
      }
    }
  }, [imageId])

  async function fetchAndRenderImage(id: string, canvas: fabric.Canvas) {
    try {
      setLoadPhase('Fetching image info...')
      const resp = await fetch(`/api/media/${id}`)
      if (!resp.ok) throw new Error(`Metadata fetch failed (${resp.status})`)
      
      const media = await resp.json()
      if (!media.url) throw new Error('No image URL found')
      
      setLoadPhase('Downloading image...')
      const loadImage = () => new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        const timeout = setTimeout(() => reject(new Error('Download timeout')), 8000)
        img.onload = () => { clearTimeout(timeout); resolve(img) }
        img.onerror = () => { clearTimeout(timeout); reject(new Error('Download failed')) }
        img.src = media.url
      })

      const rawImg = await loadImage()
      
      setLoadPhase('Rendering design...')
      const fabricImg = new fabric.Image(rawImg)
      const cW = canvas.getWidth()
      const cH = canvas.getHeight()
      const scale = Math.min(cW / (rawImg.width || 1), cH / (rawImg.height || 1))

      fabricImg.set({
        scaleX: scale,
        scaleY: scale,
        left: (cW - (rawImg.width || 0) * scale) / 2,
        top: (cH - (rawImg.height || 0) * scale) / 2,
        selectable: false,
        evented: false,
      })

      canvas.setBackgroundImage(fabricImg, () => {
        canvas.renderAll()
        setLoading(false)
        setLoadPhase('Done')
      })

      // Final fallback if callback doesn't fire
      setTimeout(() => setLoading(false), 2000)

    } catch (err: any) {
      console.warn('Creative Studio: Image skip', err.message)
      setLoading(false)
    }
  }

  // Toolbar Actions
  const addText = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const text = new fabric.IText('LUMERA', {
      left: 100,
      top: 100,
      fontFamily: 'Inter',
      fontSize: 40,
      fontWeight: 'bold',
      fill: '#800020',
    })
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const addRect = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      fill: '#C9A24D',
      width: 150,
      height: 100,
      rx: 10,
      ry: 10,
    })
    canvas.add(rect)
    canvas.setActiveObject(rect)
  }

  const addCircle = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      fill: 'rgba(128, 0, 32, 0.1)',
      stroke: '#800020',
      strokeWidth: 2,
      radius: 60,
    })
    canvas.add(circle)
    canvas.setActiveObject(circle)
  }

  const deleteObject = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas || !activeObject) return
    canvas.remove(activeObject)
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  const changeColor = (color: string) => {
    if (!activeObject) return
    activeObject.set('fill', color)
    fabricCanvasRef.current?.renderAll()
  }

  const handleSave = async () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    setSaving(true)

    try {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `design-${Date.now()}.png`, { type: 'image/png' })

      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        const newMediaId = uploadData.id

        const prodRes = await fetch(`/api/products/${productId}`)
        const product = await prodRes.json()

        const updatedImages = [
          ...product.images.map((img: any) => ({
            image: img.image?.id || img.image,
            isPrimary: img.isPrimary,
          })),
          { image: newMediaId, isPrimary: false }
        ]

        await fetch(`/api/products/${productId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: updatedImages }),
        })

        router.push(`/dashboard/products/${productId}/edit`)
      }
    } catch (err) {
      console.error('Failed to save design:', err)
      alert('Failed to save design. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading && imageId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-sm">
          <div className="relative mb-6">
            <Loader2 className="w-12 h-12 animate-spin text-[#1e3a5f] mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-[#1e3a5f] rounded-full" />
            </div>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Preparing Creative Studio</h2>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="w-2 h-2 bg-[#C9A24D] rounded-full animate-pulse" />
            <p className="text-sm text-gray-500 font-medium">
              {loadPhase}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
              Note: {errorMsg}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setLoading(false)}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              Start with Blank Canvas
            </button>
            <Link
              href={`/dashboard/products/${productId}/edit`}
              className="text-xs text-gray-400 hover:text-[#1e3a5f] underline transition-colors"
            >
              Cancel and go back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/products/${productId}/edit`}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Lumera Creative Studio</h1>
            <p className="text-xs text-gray-400">Design unique product visuals</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const canvas = fabricCanvasRef.current
              if (canvas) {
                canvas.clear()
                if (imageId) fetchAndRenderImage(imageId, canvas)
              }
            }}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <Undo className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#2a4d7a] transition-all shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Design
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-8 gap-6 z-10 shadow-sm">
          <button onClick={addText} className="tool-btn group" title="Add Text">
            <Type className="w-6 h-6" />
            <span className="tool-tip">Add Text</span>
          </button>
          <button onClick={addRect} className="tool-btn group" title="Add Rectangle">
            <Square className="w-6 h-6" />
            <span className="tool-tip">Rectangle</span>
          </button>
          <button onClick={addCircle} className="tool-btn group" title="Add Circle">
            <CircleIcon className="w-6 h-6" />
            <span className="tool-tip">Circle</span>
          </button>
          <div className="w-8 h-px bg-gray-100 my-2" />
          <button
            disabled={!activeObject}
            onClick={deleteObject}
            className={`p-3 rounded-xl transition-all ${activeObject ? 'text-red-500 hover:bg-red-50' : 'text-gray-200 cursor-not-allowed'}`}
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>

        {/* Canvas Workspace */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-12 bg-gray-100/50">
          <div className="bg-white p-4 shadow-2xl rounded-xl border border-gray-200/50">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-72 bg-white border-l border-gray-200 p-6 z-10 shadow-sm overflow-y-auto">
          {activeObject ? (
            <div className="space-y-8">
              <div>
                <h3 className="prop-title">
                  <Palette className="w-3 h-3" />
                  Colors
                </h3>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {LUMERA_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => changeColor(color.value)}
                      className="w-10 h-10 rounded-full border border-gray-100 shadow-sm hover:scale-110 transition-transform active:scale-95"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {activeObject.get('fill') === color.value && (
                        <div className="w-2 h-2 rounded-full bg-white mix-blend-difference mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="prop-title">
                  <Layers className="w-3 h-3" />
                  Arrangement
                </h3>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    onClick={() => fabricCanvasRef.current?.bringToFront(activeObject)}
                    className="layer-btn"
                  >
                    Bring Front
                  </button>
                  <button
                    onClick={() => fabricCanvasRef.current?.sendToBack(activeObject)}
                    className="layer-btn"
                  >
                    Send Back
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-gray-200" />
              </div>
              <p className="text-sm font-medium text-gray-900">Editor Panel</p>
              <p className="text-xs text-gray-400 mt-1 px-4">Select an element to customize its properties</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tool-btn {
          @apply p-3 text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/5 rounded-xl transition-all relative;
        }
        .tool-tip {
          @apply absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50;
        }
        .prop-title {
          @apply text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2;
        }
        .layer-btn {
          @apply py-2 text-[11px] font-semibold border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 shadow-sm;
        }
      `}</style>
    </div>
  )
}
