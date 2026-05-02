import NodeCache from 'node-cache'

const DEFAULT_TTL = 300 // 5 minutes in seconds

const nodeCache = new NodeCache({ stdTTL: DEFAULT_TTL, checkperiod: 60 })

export const cache = {
  get<T>(key: string): T | undefined {
    return nodeCache.get<T>(key)
  },

  set<T>(key: string, value: T, ttl?: number): void {
    nodeCache.set(key, value, ttl ?? DEFAULT_TTL)
  },

  del(key: string | string[]): void {
    const keys = Array.isArray(key) ? key : [key]
    nodeCache.del(keys)
  },

  flush(): void {
    nodeCache.flushAll()
  },
}
