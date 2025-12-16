import { useState } from "react"

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-500">FoxReviews</div>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-700 hover:text-orange-500">Home</a>
          <a href="#reviews" className="text-gray-700 hover:text-orange-500">Reviews</a>
          <a href="#submit" className="text-gray-700 hover:text-orange-500">Submit</a>
          <a href="#contact" className="text-gray-700 hover:text-orange-500">Contact</a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-white shadow-lg">
          <a href="#" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Home</a>
          <a href="#reviews" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Reviews</a>
          <a href="#submit" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Submit</a>
          <a href="#contact" className="block px-6 py-2 text-gray-700 hover:bg-gray-100">Contact</a>
        </nav>
      )}
    </header>
  )
}