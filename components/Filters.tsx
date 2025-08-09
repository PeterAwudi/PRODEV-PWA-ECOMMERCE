import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCategories, fetchProducts, reset } from '../store/productsSlice'

export default function Filters() {
  const dispatch = useAppDispatch()
  const categories = useAppSelector(s => s.products.categories)
  const [category, setCategory] = useState<string>('')
  const [query, setQuery] = useState('')

  useEffect(() => { dispatch(fetchCategories()) }, [dispatch])

  function apply() {
    dispatch(reset())
    dispatch(fetchProducts({ limit: 12, skip: 0, category: category || undefined, q: query || undefined }))
  }

  return (
    <div className="p-3 bg-white rounded-md shadow-sm">
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" className="w-full p-2 border rounded mb-2" />
      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded mb-2">
        <option value="">All categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button onClick={apply} className="w-full py-2 bg-indigo-600 text-white rounded">Apply</button>
    </div>
  )
}
