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
            <span>Last Updated: February 12, 2026</span>
            <span className="h-4 w-px bg-gray-300"></span>
            <span className="font-medium">Version 1.0</span>
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
                By accessing or using PrePost Analytics, you agree to these Terms of Service. PrePost Analytics is a free tool that helps YouTube creators predict video performance using machine learning models trained on 51,888 real YouTube videos. The platform provides predictions for views, engagement, and performance insights. If you do not agree with these terms, please do not use the service.
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
                You are responsible for maintaining the confidentiality of your account credentials. You agree to use PrePost Analytics only for lawful purposes and in accordance with YouTube's Terms of Service and API policies. You must not attempt to reverse engineer our machine learning models, abuse the API, or use the service to violate any laws or regulations. Guest users are limited to 5 predictions per day; registered users get unlimited predictions.
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
                The machine learning models, algorithms, user interface, and all content on PrePost Analytics are owned by PrePost Analytics and protected by copyright laws. You retain full ownership of your YouTube channel data and content. The predictions and insights generated by our platform are provided for your personal use and may not be resold or redistributed without permission.
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
                  "PREDICTIONS ARE ESTIMATES, NOT GUARANTEES"
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                PrePost Analytics provides statistical predictions based on machine learning models with 95.6% accuracy (R² score). However, actual video performance may vary significantly due to factors beyond our control, including YouTube algorithm changes, trending topics, audience behavior, and content quality. We do not guarantee specific view counts, engagement rates, or revenue results. The service is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the predictions or the platform.
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