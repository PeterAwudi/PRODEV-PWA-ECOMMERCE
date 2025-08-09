import Head from 'next/head'
import Header from '../components/Header'
import Filters from '../components/Filters'
import ProductList from '../components/ProductList'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Head>
        <title>DETAIl'S CATALOG</title>
      </Head>
      <Header />
      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1"><Filters /></aside>
        <div className="lg:col-span-3"><ProductList /></div>
      </main>
    </div>
  )
}
