export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        &copy; {new Date().getFullYear()} FoxReviews. All rights reserved.
      </div>
    </footer>
  )
}
