// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { FaChartLine, FaBrain, FaShieldAlt, FaRocket, FaUsers, FaLightbulb } from 'react-icons/fa';
import { FiArrowRight, FiCheck, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const features = [
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: "AI-Powered Analytics",
      description: "Machine learning models analyze patterns to predict engagement with 86.4% accuracy.",
      stat: "86.4%",
      statLabel: "Prediction Accuracy"
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Advanced Metrics",
      description: "Deep dive into performance analytics with interactive charts and insights.",
      stat: "2.4M",
      statLabel: "Posts Analyzed"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Privacy First",
      description: "End-to-end encryption and strict data protection policies.",
      stat: "100%",
      statLabel: "Data Security"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Growth Tools",
      description: "Optimize posting times, captions, and hashtags for maximum reach.",
      stat: "10K+",
      statLabel: "Active Creators"
    }
  ];

  const values = [
    {
      title: "Precision Driven",
      description: "Every insight is backed by data and rigorous analysis.",
      color: "bg-blue-500/20",
      textColor: "text-blue-600"
    },
    {
      title: "Creator First",
      description: "Tools designed specifically for YouTube creators' needs.",
      color: "bg-purple-500/20",
      textColor: "text-purple-600"
    },
    {
      title: "Innovation Focused",
      description: "Constantly evolving with the latest ML and AI advancements.",
      color: "bg-green-500/20",
      textColor: "text-green-600"
    },
    {
      title: "Transparent Insights",
      description: "Clear, actionable data without hidden algorithms.",
      color: "bg-orange-500/20",
      textColor: "text-orange-600"
    }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      expertise: "Ex-YouTube Growth Lead",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Sarah Chen",
      role: "Head of AI/ML",
      expertise: "PhD Computer Science",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Designer",
      expertise: "UX Research Specialist",
      color: "from-green-500 to-green-600"
    },
    {
      name: "Priya Patel",
      role: "Data Scientist",
      expertise: "ML Optimization Expert",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-24">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-10 py-16">
          <h1 className="text-slate-900 text-5xl md:text-6xl font-black leading-[1.1] tracking-[-0.03em]">
            Empowering YouTube Creators with{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Precision
            </span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-xl">
            Bridging data science and social media creativity with technical analytics and machine learning insights designed for the next generation of storytellers.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              to="/post-performance"
              className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg hover:shadow-lg transition-all flex items-center gap-3 group"
            >
              Explore the Platform
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="h-14 px-8 border-2 border-slate-200 rounded-full text-slate-700 font-bold text-lg hover:border-slate-300 transition-all flex items-center gap-3"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-slate-900 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></span>
            Our Technology
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Built for{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Technical Excellence
            </span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Advanced tools powered by cutting-edge machine learning and data science
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 flex items-center justify-center text-blue-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{feature.description}</p>
              <div className="pt-4 border-t border-slate-100">
                <div className="text-2xl font-black text-slate-900">{feature.stat}</div>
                <div className="text-sm text-slate-500">{feature.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-[32px] p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-slate-900 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="size-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></span>
              Our Values
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              More Than Just{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Analytics
              </span>
            </h2>
            <p className="text-slate-600 text-lg mb-8">
              We believe in empowering creators with transparent, actionable insights that drive real growth.
            </p>
            <ul className="space-y-4">
              {values.map((value, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full ${value.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                    <FiCheck className={`w-4 h-4 ${value.textColor}`} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{value.title}</div>
                    <div className="text-slate-600 text-sm">{value.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                  <FiTrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">+142%</div>
                  <div className="text-slate-600">Average Creator Growth</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Engagement Increase</span>
                    <span className="font-bold text-slate-900">+68%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 w-2/3"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Follower Growth</span>
                    <span className="font-bold text-slate-900">+142%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">Content Efficiency</span>
                    <span className="font-bold text-slate-900">+54%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-2 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-[32px] p-8 md:p-12 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
            <span className="size-2 rounded-full bg-white"></span>
            Ready to Grow?
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Start Optimizing Your YouTube Today
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of creators using PrePost to make data-driven decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="h-14 px-8 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-3 group"
            >
              Get Started
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center">
        <p className="text-slate-600">
          Have questions? Check out our{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline font-medium">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="text-blue-600 hover:underline font-medium">
            Terms of Service
          </Link>
        </p>
        <p className="text-sm text-slate-500 mt-4">
          © {new Date().getFullYear()} PrePost Analytics. All rights reserved.
        </p>
      </section>
    </main>
  );
}