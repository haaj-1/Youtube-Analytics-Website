import Sidebar from "../components/Sidebar";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-[260px_1fr] gap-10">
      <Sidebar
        items={["Data Collection", "YouTube API", "Encryption", "User Rights"]}
      />

      <section>
        {/* Header */}
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          PrePost Analytics is built for professional creators who value their
          data integrity. This policy outlines how we maintain technical
          precision while protecting your digital footprint.
        </p>

        <div className="h-px bg-gray-200 mb-10"></div>

        {/* Quote */}
        <blockquote className="border-l-4 border-green-200 pl-6 italic text-gray-700 mb-10 text-lg">
          "Trust is the currency of the digital age. We don't just store data;
          we safeguard your professional insights using enterprise-grade
          security protocols."
        </blockquote>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Data Collection */}
          <div>
            <div id="data-collection" className="scroll-mt-24"></div>
            <h2 className="font-bold text-2xl mb-6 text-gray-900">
              Data Collection
            </h2>
            <p className="text-gray-600 mb-6">
              To provide advanced predictive analytics, we collect specific
              technical metadata from your professional YouTube presence:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Account profile metrics (Follower growth, category, bio text).
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Historical post performance data (Likes, shares, saves, impressions).
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Temporal engagement patterns (Time of posting vs. audience activity).
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Media type distribution (Reels vs. Carousel vs. Static Images).
              </li>
            </ul>

            <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <h3 className="font-semibold text-green-800 mb-2">Technical Note</h3>
              <p className="text-green-700">
                All collected data is anonymized and aggregated before being processed by our Machine Learning models to ensure individual post privacy during global trend training.
              </p>
            </div>
          </div>

          {/* YouTube API */}
          <div>
            <div id="youtube-api" className="scroll-mt-24"></div>
            <h2 className="font-bold text-2xl mb-6 text-gray-900">
              YouTube API Usage
            </h2>
            <p className="text-gray-600 mb-6">
              PrePost Analytics uses the official YouTube Data API. Our
              integration follows strict security guidelines:
            </p>
            <ul className="space-y-4 text-gray-600">
              <li>
                <strong className="text-gray-900">Zero Password Storage:</strong> We never ask for or
                store your YouTube password. All authentication is handled
                via secure OAuth tokens.
              </li>
              <li>
                <strong className="text-gray-900">Read-Only Access:</strong> By default, we only request
                "Read" permissions to analyze your content. We do not post or
                modify your account.
              </li>
              <li>
                <strong className="text-gray-900">Token Expiry:</strong> Authentication tokens are
                refreshed frequently and stored in hardware-encrypted modules.
              </li>
            </ul>
          </div>

          {/* Privacy & Encryption */}
          <div>
            <div id="encryption" className="scroll-mt-24"></div>
            <h2 className="font-bold text-2xl mb-6 text-gray-900">
              Privacy & Encryption
            </h2>
            <p className="text-gray-600 mb-6">
              We treat your data with the same level of security required by financial institutions:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gray-900">At Rest</h3>
                <p className="text-gray-600">
                  Data is encrypted using AES-256 standard with unique rotating
                  keys for every database cluster.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-gray-900">In Transit</h3>
                <p className="text-gray-600">
                  All communication between your browser and our servers is
                  secured via TLS 1.3 encryption.
                </p>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div id="user-rights" className="scroll-mt-24">
            <h2 className="font-bold text-2xl mb-6 text-gray-900">
              User Rights
            </h2>
            <p className="text-gray-600 mb-6">
              You maintain full control over your data. Under GDPR and CCPA
              guidelines, you have the following rights:
            </p>
            
            <div className="space-y-8">
              {/* Right to Deletion Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Right to Deletion</h3>
                    <p className="text-gray-600">
                      You can request immediate and permanent deletion of all account data at any time.
                    </p>
                  </div>
                </div>
                
              {/* Email Request Form */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Request Data Deletion</h4>
                
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    📧 To delete your data, you must email us at: 
                    <a href="mailto:ihaajarcher@gmail.com" className="ml-1 text-green-700 underline">
                      ihaajarcher@gmail.com
                    </a>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Include the information below in your email for faster processing.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Required Information to Include in Your Email:
                    </label>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">1.</span>
                        <span><strong>Your Account Email:</strong> The email you used to sign up</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">2.</span>
                        <span><strong>PrePost Username:</strong> Your account username</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">3.</span>
                        <span><strong>Subject Line:</strong> "Data Deletion Request"</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-600 font-bold">4.</span>
                        <span><strong>Clear Statement:</strong> "I want to permanently delete all my data from PrePost Analytics"</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email (For Reference)
                    </label>
                    <input
                      type="email"
                      id="user-email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This is for your reference only. You must email us to request deletion.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="deletion-details" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Template (Copy & Paste)
                    </label>
                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                      <p className="text-sm text-gray-700 font-medium mb-2">Copy this template to your email:</p>
                      <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm">
                        <div className="text-gray-500">To: ihaajarcher@gmail.com</div>
                        <div className="text-gray-500">Subject: Data Deletion Request</div>
                        <div className="mt-2 text-gray-800">
                          Hello,<br/>
                          I want to permanently delete all my data from PrePost Analytics.<br/><br/>
                          My account email is: [Your Email Here]<br/>
                          My username is: [Your Username Here]<br/><br/>
                          Please confirm when my data has been deleted.<br/><br/>
                          Thank you,<br/>
                          [Your Name]
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Copy the text above and paste it into your email client. Send it to <strong>ihaajarcher@gmail.com</strong>
                      </p>
                    </div>
                  </div>
                  
                  
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Send Your Request To:</strong>
                      </p>
                      <a 
                        href="mailto:ihaajarcher@gmail.com" 
                        className="text-green-700 hover:text-green-800 font-medium text-lg"
                      >
                        ihaajarcher@gmail.com
                      </a>
                      <p className="text-xs text-gray-500 mt-1">
                        Copy the email template above and send it to this address
                      </p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">What Happens After You Email Us:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>We'll email you within 48 hours to confirm receipt</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Your data will be permanently deleted within 30 days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>You'll receive a final confirmation email when deletion is complete</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            
              
              {/* Data Portability Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Data Portability</h3>
                    <p className="text-gray-600 mb-3">
                      Export your historical performance analysis in CSV or JSON format directly from your dashboard.
                    </p>
                    <button className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                      <span>Export My Data</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Revoke Access Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">Revoke Access</h3>
                    <p className="text-gray-600 mb-3">
                      Disconnect your YouTube account instantly, which will trigger a secure wipe of all associated tokens.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors">
                        Revoke YouTube Access
                      </button>
                      <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                        Manage Connected Accounts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}