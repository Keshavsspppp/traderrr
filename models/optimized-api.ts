// lib/middleware/optimized-api.ts
import { NextRequest, NextResponse } from 'next/server'

export function withOptimizations(handler: Function, options?: {
  cache?: boolean
  cacheTTL?: number
  rateLimit?: { max: number; window: string }
}) {
  return async (req: NextRequest, context: any) => {
    // Rate limiting
    if (options?.rateLimit) {
      const ip = req.headers.get('x-forwarded-for') || 'unknown'
      const { success } = await rateLimiter.limit(`ratelimit:${ip}`)
      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }
    
    // Cache handling
    if (options?.cache && req.method === 'GET') {
      const cacheKey = `cache:${req.url}`
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': `public, max-age=${options.cacheTTL || 60}`
          }
        })
      }
    }
    
    // Execute handler
    const response = await handler(req, context)
    
    // Cache response
    if (options?.cache && response.ok) {
      const data = await response.json()
      await redis.set(
        `cache:${req.url}`,
        data,
        { ex: options.cacheTTL || 60 }
      )
    }
    
    return response
  }
}