

// =============================
// src/pages/TermsOfService.jsx
// =============================
export default function TermsOfService() {
  return (
    <div className="max-w-6xl mx-auto px-6 mt-12">
      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-500 mb-10">Last updated: October 2026</p>

      <div className="space-y-10">
        <div className="bg-white p-8 rounded-2xl border">
          <h2 className="font-semibold text-lg mb-2">Acceptance of Terms</h2>
          <p className="text-gray-600">By using PrePost Analytics, you agree to these terms.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border">
          <h2 className="font-semibold text-lg mb-2">User Obligations</h2>
          <p className="text-gray-600">You must comply with Instagram policies and applicable laws.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border">
          <h2 className="font-semibold text-lg mb-2">Intellectual Property</h2>
          <p className="text-gray-600">All analytics models and platform designs are proprietary.</p>
        </div>

        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl">
          <h2 className="font-semibold text-red-700 mb-2">Limitation of Liability</h2>
          <p className="text-gray-700 italic">Services are provided "as is" without guarantees.</p>
        </div>
      </div>
    </div>
  );
}
