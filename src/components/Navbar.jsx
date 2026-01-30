export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 rounded bg-green-600"></div>
          PrePost Analytics
        </div>
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <a>Platform</a><a>Features</a><a>Pricing</a><a>About</a>
        </nav>
        <button className="bg-green-700 text-white px-4 py-2 rounded-full text-sm">Log In</button>
      </div>
    </header>
  );
}