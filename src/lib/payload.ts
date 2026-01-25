import { getPayload } from 'payload'
import config from '@/payload.config'

// Define a type for the cached payload
interface CachedPayload {
    client: any | null
    promise: Promise<any> | null
}

// Attach to global scope to persist across hot reloads in development
let cached = (global as any).payload as CachedPayload

if (!cached) {
    cached = (global as any).payload = { client: null, promise: null }
}

export const getPayloadClient = async () => {
    if (cached.client) {
        return cached.client
    }

    if (!cached.promise) {
        cached.promise = getPayload({ config })
    }

    try {
        cached.client = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.client
}
