import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">DETAIL'S CATALOG</Link>
        <div className="flex gap-4 items-center">
          <input placeholder="Search" className="hidden sm:inline-block border p-2 rounded" />
          <button className="px-3 py-2 rounded border">Cart</button>
        </div>
      </div>
    </header>
  )
}
