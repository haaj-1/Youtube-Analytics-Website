import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700"></div>
              <div>
                <span className="font-bold text-lg text-charcoal">PrePost</span>
                <span className="text-sm text-gray-500"> Analytics</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Advanced analytics and predictions for Instagram creators and businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-charcoal mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-green-600 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-charcoal mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-green-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <span className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PrePost Analytics. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/terms" className="hover:text-green-600 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-green-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-green-600 transition-colors">Cookies</a>
            <a href="#" className="hover:text-green-600 transition-colors">Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
}