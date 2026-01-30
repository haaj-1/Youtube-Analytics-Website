export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between text-sm text-gray-500 gap-4 md:gap-0">
        <span>© 2026 PrePost Analytics</span>
        <div className="flex gap-6">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/cookie">Cookie Policy</a>
          <a href="/status">Status</a>
        </div>
      </div>
    </footer>
  );
}
