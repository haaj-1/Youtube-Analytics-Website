// src/components/Footer.jsx - UPDATE THESE LINES
import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // ADD THIS IMPORT

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div> {/* CHANGE: blue-purple gradient */}
              <div>
                <span className="font-bold text-lg text-slate-900">PrePost</span> {/* CHANGE: slate-900 */}
                <span className="text-sm text-slate-500"> Analytics</span> {/* CHANGE: slate-500 */}
              </div>
            </div>
            <p className="text-slate-600 text-sm">
              Advanced analytics and predictions for Instagram creators and businesses.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"> {/* CHANGE: blue-600 */}
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"> {/* CHANGE: blue-600 */}
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors"> {/* CHANGE: blue-600 */}
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3> {/* CHANGE: slate-900 */}
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-blue-600 transition-colors">About</Link></li> {/* FIX: Use Link */}
              <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li> {/* CHANGE: blue-600 */}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Legal</h3> {/* CHANGE: slate-900 */}
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li> {/* FIX: Use Link */}
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li> {/* FIX: Use Link */}
              <li><a href="#" className="hover:text-blue-600 transition-colors">Cookie Policy</a></li> {/* CHANGE: blue-600 */}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <span className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PrePost Analytics. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link> {/* FIX: Use Link */}
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy</Link> {/* FIX: Use Link */}
            <a href="#" className="hover:text-blue-600 transition-colors">Cookies</a> {/* CHANGE: blue-600 */}
            <a href="#" className="hover:text-blue-600 transition-colors">Status</a> {/* CHANGE: blue-600 */}
          </div>
        </div>
      </div>
    </footer>
  );
}