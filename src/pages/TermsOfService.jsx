import { useState } from 'react';

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', number: '01', title: 'Acceptance' },
    { id: 'obligations', number: '02', title: 'Obligations' },
    { id: 'property', number: '03', title: 'Property Rights' },
    { id: 'liability', number: '04', title: 'Liability' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-[260px_1fr] gap-10">
      {/* Sidebar */}
      <aside className="block w-64 flex-shrink-0">
        <div className="sticky top-24 flex flex-col items-start">
          <h4 className="text-xs font-semibold text-gray-500 mb-6 uppercase tracking-wider">
            ON THIS PAGE
          </h4>
          <nav className="space-y-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.id);
                  const element = document.getElementById(section.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all block ${
                  activeSection === section.id
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{section.number}</span>
                  <span className="font-medium">{section.title}</span>
                </div>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <section>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            Terms of Service
          </h1>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Last Updated: January 26, 2023</span>
            <span className="h-4 w-px bg-gray-300"></span>
            <span className="font-medium">Version 2.0</span>
          </div>
        </div>

        <div className="h-px bg-gray-200 mb-12"></div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Acceptance Section */}
          <section id="acceptance" className="scroll-mt-24">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full mb-3">
                ACCEPTANCE REQUIRED FOR ACCESS
              </span>
              <h2 className="font-bold text-2xl text-gray-900">
                Acceptance of Terms
              </h2>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed">
                By accessing or using the PrePost Analytics platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. Our technical analytics and ML tools are designed specifically to provide data-driven insights for Instagram creators, and your use constitutes acceptance of our specialized data processing methods and algorithm-based reporting.
              </p>
            </div>
          </section>

          {/* Obligations Section */}
          <section id="obligations" className="scroll-mt-24">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-3">
                GUIDELINES
              </span>
              <h2 className="font-bold text-2xl text-gray-900">
                User Obligations
              </h2>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed">
                Users are responsible for maintaining the confidentiality of their account and for all activities that occur under their account credentials. You agree to use the platform only for lawful purposes and in strict accordance with Instagram's Community Guidelines and API usage policies. You must not attempt to reverse engineer our proprietary ML models, scrape data in an unauthorized manner, or use automated systems to manipulate analytics outcomes.
              </p>
            </div>
          </section>

          {/* Property Rights Section */}
          <section id="property" className="scroll-mt-24">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full mb-3">
                OWNERSHIP
              </span>
              <h2 className="font-bold text-2xl text-gray-900">
                Intellectual Property
              </h2>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed">
                All technical infrastructure, machine learning models, UI/UX designs, and generated analytical report structures are the exclusive property of PrePost Analytics. While you retain ownership of your raw Instagram content data, the derivative insights, trend predictions, and visual representations generated by our platform are protected by copyright and trade secret laws.
              </p>
            </div>
          </section>

          {/* Liability Section */}
          <section id="liability" className="scroll-mt-24">
            <div className="mb-8">
              <span className="inline-block px-4 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full mb-3">
                IMPORTANT LEGAL NOTICE
              </span>
              <h2 className="font-bold text-2xl text-gray-900">
                Limitation of Liability
              </h2>
            </div>
            
            <div className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-8">
              <div className="mb-6">
                <p className="text-red-800 font-bold text-xl italic">
                  "THE SERVICES ARE PROVIDED 'AS IS' WITHOUT ANY WARRANTIES."
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                PrePost Analytics provides statistical predictions based on historical trends. We do not guarantee specific growth metrics, engagement rates, or income results. We shall not be held liable for any indirect, incidental, or consequential damages resulting from platform downtime or algorithm changes by external platforms.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-16 mt-12 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 md:mb-0">
                © 2026 PrePost Analytics. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="/privacy" className="text-gray-600 hover:text-green-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="/contact" className="text-gray-600 hover:text-green-600 transition-colors">
                  Contact
                </a>
                <a href="/support" className="text-gray-600 hover:text-green-600 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}