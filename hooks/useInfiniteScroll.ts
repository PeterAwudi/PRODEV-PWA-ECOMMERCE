import { useEffect, RefObject } from 'react'

export function useInfiniteScroll(ref: RefObject<Element | null>, cb: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) cb()
      })
    }, { root: null, rootMargin: '200px' })

    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, cb, enabled])
}
