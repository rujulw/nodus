interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class LruTtlCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>();

  constructor(
    private readonly maxSize: number,
    private readonly ttlMs: number
  ) {}

  get(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    // Touch entry for LRU ordering.
    this.store.delete(key);
    this.store.set(key, entry);

    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });

    if (this.store.size <= this.maxSize) {
      return;
    }

    const oldestKey = this.store.keys().next().value as string | undefined;
    if (oldestKey) {
      this.store.delete(oldestKey);
    }
  }

  size(): number {
    return this.store.size;
  }
}
