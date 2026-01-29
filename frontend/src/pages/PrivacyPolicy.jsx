import Sidebar from "../components/Sidebar";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
      <Sidebar items={["Data Collection", "Instagram API", "Encryption", "User Rights"]} />
      <section>
        <span className="inline-block mb-4 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">LAST UPDATED: OCT 2026</span>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-10">This policy explains how PrePost Analytics collects, uses, and protects your data.</p>

        <div className="bg-white rounded-2xl p-8 border space-y-10">
          <div>
            <h2 className="font-semibold text-lg mb-2">Data Collection</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Instagram profile metrics</li>
              <li>Post performance analytics</li>
              <li>Engagement timing signals</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Instagram API Usage</h2>
            <p className="text-gray-600">We use official Meta APIs with read-only access. No passwords are stored.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border">
              <h3 className="font-medium">At Rest</h3>
              <p className="text-sm text-gray-600">AES-256 encrypted storage</p>
            </div>
            <div className="p-4 rounded-xl border">
              <h3 className="font-medium">In Transit</h3>
              <p className="text-sm text-gray-600">TLS 1.3 secured connections</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">User Rights</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Request data deletion</li>
              <li>Export your data</li>
              <li>Revoke access at any time</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
