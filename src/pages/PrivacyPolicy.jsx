import Sidebar from "../components/Sidebar";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
      <Sidebar
        items={["Data Collection", "Instagram API", "Encryption", "User Rights"]}
      />

      <section>
        {/* Badge */}
        <span className="inline-block mb-4 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
          LAST UPDATED: OCTOBER 24, 2023
        </span>

        {/* Header */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          PrePost Analytics is built for professional creators who value their
          data integrity. This policy outlines how we maintain technical
          precision while protecting your digital footprint.
        </p>

        {/* Quote */}
        <blockquote className="border-l-4 border-green-200 pl-4 italic text-gray-700 mb-10">
          "Trust is the currency of the digital age. We don't just store data;
          we safeguard your professional insights using enterprise-grade
          security protocols."
        </blockquote>

        {/* Data Collection */}
        <div className="bg-white rounded-2xl p-8 border space-y-10">
          <div>
            <h2 className="font-semibold text-xl mb-4 text-gray-900">
              Data Collection
            </h2>
            <p className="text-gray-600 mb-4">
              To provide advanced predictive analytics, we collect specific
              technical metadata from your professional Instagram presence:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>Account profile metrics (Follower growth, category, bio text)</li>
              <li>Historical post performance data (Likes, shares, saves, impressions)</li>
              <li>Temporal engagement patterns (Time of posting vs. audience activity)</li>
              <li>Media type distribution (Reels vs. Carousel vs. Static images)</li>
            </ul>

            <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-200 text-green-700 rounded">
              <strong>Technical Note:</strong> All collected data is anonymized
              and aggregated before being processed by our Machine Learning
              models to ensure individual post privacy during global trend
              training.
            </div>
          </div>

          {/* Instagram API */}
          <div>
            <h2 className="font-semibold text-xl mb-4 text-gray-900">
              Instagram API Usage
            </h2>
            <p className="text-gray-600 mb-4">
              PrePost Analytics uses the official Instagram Graph API. Our
              integration follows strict security guidelines:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>
                <strong>Zero Password Storage:</strong> We never ask for or
                store your Instagram password. All authentication is handled
                via secure OAuth tokens.
              </li>
              <li>
                <strong>Read-Only Access:</strong> By default, we only request
                "Read" permissions to analyze your content. We do not post or
                modify your account.
              </li>
              <li>
                <strong>Token Expiry:</strong> Authentication tokens are
                refreshed frequently and stored in hardware-encrypted modules.
              </li>
            </ul>
          </div>

          {/* Privacy & Encryption */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border flex flex-col items-start">
              <h3 className="font-semibold mb-2 text-gray-900">At Rest</h3>
              <p className="text-gray-600 text-sm">
                Data is encrypted using AES-256 standard with unique rotating
                keys for every database cluster.
              </p>
            </div>
            <div className="p-6 rounded-2xl border flex flex-col items-start">
              <h3 className="font-semibold mb-2 text-gray-900">In Transit</h3>
              <p className="text-gray-600 text-sm">
                All communication between your browser and our servers is
                secured via TLS 1.3 encryption.
              </p>
            </div>
          </div>

          {/* User Rights */}
          <div>
            <h2 className="font-semibold text-xl mb-4 text-gray-900">
              User Rights
            </h2>
            <p className="text-gray-600 mb-4">
              You maintain full control over your data. Under GDPR and CCPA
              guidelines, you have the following rights:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>
                <strong>Right to Deletion:</strong> You can request immediate
                and permanent deletion of all account data at any time via the
                dashboard.
              </li>
              <li>
                <strong>Data Portability:</strong> Export your historical
                performance analysis in CSV or JSON format.
              </li>
              <li>
                <strong>Revoke Access:</strong> Disconnect your Instagram
                account instantly, which will trigger a secure wipe of all
                associated tokens.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
