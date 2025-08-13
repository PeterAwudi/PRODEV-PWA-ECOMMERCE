import { useEffect, useRef, useCallback } from 'react'
import ProductCard from './ProductCard'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts } from '../store/productsSlice'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

export default function ProductList() {
  const dispatch = useAppDispatch()
  const { items, status, total, limit, skip } = useAppSelector(s => s.products)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(() => {
    if (items.length >= total) return
    dispatch(fetchProducts({ limit, skip }))
  }, [dispatch, items.length, total, limit, skip])

  useEffect(() => {
    if (items.length === 0) dispatch(fetchProducts({ limit: 12, skip: 0 }))
  }, [dispatch, items.length])

  useInfiniteScroll(sentinelRef, loadMore, true)

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {status === 'loading' && <p className="text-center p-4">Loading...</p>}

      <div ref={sentinelRef} className="h-6" />
      <p className="text-sm text-center text-gray-500 mt-2">Showing {items.length} of {total}</p>
    </section>
  )
}