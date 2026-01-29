export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <span>© 2026 PrePost Analytics</span>
        <div className="flex gap-6">
          <a>Privacy Policy</a>
          <a>Terms of Service</a>
          <a>Contact</a>
        </div>
      </div>
    </footer>
  );
}