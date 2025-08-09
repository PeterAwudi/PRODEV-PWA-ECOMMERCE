import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { Product } from '../types/product'

interface FetchArgs { limit?: number; skip?: number; category?: string; q?: string }

export const fetchProducts = createAsyncThunk('products/fetch', async (args: FetchArgs = { limit: 12, skip: 0 }) => {
  const { limit = 12, skip = 0, category, q } = args
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('skip', String(skip))
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  const { data } = await axios.get(`/api/products?${params.toString()}`)
  return data
})

export const fetchCategories = createAsyncThunk('products/categories', async () => {
  const { data } = await axios.get('/api/categories')
  return data
})

interface ProductsState {
  items: Product[]
  total: number
  limit: number
  skip: number
  status: 'idle' | 'loading' | 'failed'
  categories: string[]
  error?: string | null
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  limit: 12,
  skip: 0,
  status: 'idle',
  categories: [],
  error: null
}

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset(state) {
      state.items = []
      state.skip = 0
      state.total = 0
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => { state.status = 'loading' })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'idle'
        const payload = action.payload
        // our API returns { products, total, skip, limit }
        if (payload && Array.isArray(payload.products)) {
          if (payload.skip === 0) state.items = payload.products
          else state.items = [...state.items, ...payload.products]
          state.total = payload.total
          state.skip = payload.skip + payload.limit
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to fetch'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
  }
})

export const { reset, setLimit } = slice.actions
export default slice.reducer
