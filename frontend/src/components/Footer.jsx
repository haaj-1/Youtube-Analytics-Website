import { FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="mt-20 relative"
      style={{
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Subtle top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      }} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/20" />
              <div>
                <span className="font-bold text-white">PrePost</span>
                <span className="text-sm text-red-200"> Analytics</span>
              </div>
            </div>
            <p className="text-red-200 text-sm leading-relaxed">
              Advanced analytics and predictions for YouTube creators.
            </p>
            <div className="flex gap-4">
              {[FiTwitter, FiLinkedin, FiGithub].map((Icon, i) => (
                <a key={i} href="#" className="text-red-300 hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Company</h3>
            <ul className="space-y-2 text-sm text-red-200">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/privacy#deletion-&-contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Legal</h3>
            <ul className="space-y-2 text-sm text-red-200">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="text-red-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} PrePost Analytics. All rights reserved.
          </span>
          <div className="flex gap-6 text-sm text-red-200">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
