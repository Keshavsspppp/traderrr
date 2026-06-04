// lib/services/cache.service.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export class CacheService {
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await redis.get<T>(key)
    if (cached) return cached
    
    const data = await fetchFn()
    await redis.set(key, data, { ex: ttl })
    return data
  }
  
  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
}

// Usage example
export class StockService {
  async getStockPrice(symbol: string): Promise<StockPrice> {
    return CacheService.getOrSet(
      `stock:price:${symbol}`,
      async () => {
        const response = await fetch(`https://api.example.com/stocks/${symbol}`)
        return response.json()
      },
      60 // Cache for 60 seconds
    )
  }
  
  async getMarketOverview(): Promise<MarketOverview> {
    return CacheService.getOrSet(
      'market:overview',
      async () => {
        // Fetch and calculate market overview
        return data
      },
      300 // Cache for 5 minutes
    )
  }
}