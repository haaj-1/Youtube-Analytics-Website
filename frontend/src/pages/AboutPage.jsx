// src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { FaChartLine, FaBrain, FaShieldAlt, FaRocket, FaUsers, FaLightbulb } from 'react-icons/fa';
import { FiArrowRight, FiCheck, FiTrendingUp } from 'react-icons/fi';

export default function AboutPage() {
  const features = [
    {
      icon: <FaBrain className="w-6 h-6" />,
      title: "AI-Powered Predictions",
      description: "XGBoost + BERT + CNN models predict video performance with 95.6% accuracy.",
      stat: "95.6%",
      statLabel: "Model Accuracy (R²)"
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Global Model",
      description: "Trained on 51,888 real YouTube videos for accurate predictions across all channels.",
      stat: "51.9K",
      statLabel: "Training Videos"
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Analyze your 100 most recent videos to discover optimal posting patterns.",
      stat: "100",
      statLabel: "Videos Analyzed"
    },
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Personalized Models",
      description: "Train custom models on your channel's 40 most recent videos for tailored predictions.",
      stat: "40",
      statLabel: "Videos for Training"
    }
  ];

  const values = [
    {
      title: "Data-Driven Insights",
      description: "Every prediction backed by 51,888 real YouTube videos and rigorous ML training.",
      color: "bg-blue-500/20",
      textColor: "text-blue-600"
    },
    {
      title: "Creator Focused",
      description: "Tools designed for YouTube creators who want to optimize before publishing.",
      color: "bg-purple-500/20",
      textColor: "text-purple-600"
    },
    {
      title: "Always Free",
      description: "No credit card required. Unlimited predictions for registered users.",
      color: "bg-green-500/20",
      textColor: "text-green-600"
    },
    {
      title: "Transparent AI",
      description: "See exactly how predictions work with model transparency dashboard.",
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
    <main className="flex-1 w-full bg-black">
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-24">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/30 bg-red-500/10 backdrop-blur-sm mb-6 font-mono text-xs text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>v1.0.0 // PRODUCTION</span>
              </div>
              
              <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="block text-gray-600 text-2xl font-mono mb-2">{'<predict>'}</span>
                YouTube Performance
                <span className="block bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  with AI
                </span>
                <span className="block text-gray-600 text-2xl font-mono mt-2">{'</predict>'}</span>
              </h1>
              
              <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 mb-8 font-mono text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600">//</span>
                  <span className="text-gray-500">Training Dataset</span>
                </div>
                <div className="text-blue-400">
                  <span className="text-red-400">const</span> videos = <span className="text-green-400">51888</span>;
                </div>
                <div className="text-blue-400">
                  <span className="text-red-400">const</span> accuracy = <span className="text-green-400">0.956</span>;
                </div>
                <div className="text-blue-400">
                  <span className="text-red-400">const</span> models = [<span className="text-orange-400">'BERT'</span>, <span className="text-orange-400">'CNN'</span>, <span className="text-orange-400">'XGBoost'</span>];
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link
                  to="/post-performance"
                  className="group h-12 px-6 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded font-bold text-sm hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center gap-2 text-white"
                >
                  <span>GET STARTED</span>
                  <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signup"
                  className="h-12 px-6 border border-gray-700 rounded font-bold text-sm hover:bg-gray-900 hover:border-red-500/50 transition-all flex items-center gap-2 text-gray-300"
                >
                  <span>SIGN UP</span>
                </Link>
              </div>
            </div>
            
            {/* Right YouTube Metrics Display */}
            <div className="relative">
              {/* YouTube Analytics Panel */}
              <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 border border-red-500/20 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
                {/* Panel Header with Glow */}
                <div className="relative bg-gradient-to-r from-gray-900/90 via-red-900/20 to-gray-900/90 px-4 py-3 flex items-center justify-between border-b border-red-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/50">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <div className="absolute inset-0 rounded-lg bg-red-500/30 blur-md animate-pulse"></div>
                    </div>
                    <div>
                      <span className="text-white text-sm font-bold block">Performance Analytics</span>
                      <span className="text-gray-400 text-xs font-mono">Real-time Prediction</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
                    <span className="text-red-400 text-xs font-mono font-bold">LIVE</span>
                  </div>
                </div>
                
                {/* Metrics Content */}
                <div className="p-6 space-y-6">
                  {/* Animated Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Views', value: '12.8K', icon: '▶', color: 'from-blue-500 via-blue-600 to-cyan-500', delay: '0s', glow: 'shadow-blue-500/50' },
                      { label: 'Likes', value: '847', icon: '▲', color: 'from-green-500 via-emerald-600 to-teal-500', delay: '0.15s', glow: 'shadow-green-500/50' },
                      { label: 'Comments', value: '124', icon: '◆', color: 'from-purple-500 via-violet-600 to-fuchsia-500', delay: '0.3s', glow: 'shadow-purple-500/50' },
                      { label: 'Shares', value: '89', icon: '◉', color: 'from-red-500 via-rose-600 to-pink-500', delay: '0.45s', glow: 'shadow-red-500/50' }
                    ].map((metric, idx) => (
                      <div 
                        key={idx} 
                        className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-4 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 overflow-hidden"
                        style={{ animation: `fadeInUp 0.6s ease-out ${metric.delay} both` }}
                      >
                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        {/* Corner Accent */}
                        <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-br ${metric.color} opacity-20 blur-xl`}></div>
                        
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">{metric.label}</span>
                            <div className={`w-6 h-6 rounded bg-gradient-to-br ${metric.color} flex items-center justify-center text-white text-xs font-bold shadow-lg ${metric.glow}`}>
                              {metric.icon}
                            </div>
                          </div>
                          <div className={`text-3xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent font-mono`}>
                            {metric.value}
                          </div>
                          {/* Animated Bar */}
                          <div className="mt-2 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                              style={{ 
                                width: `${70 + idx * 10}%`,
                                animation: `progressBar 1.5s ease-out ${metric.delay} forwards`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* AI Confidence Display */}
                  <div className="relative p-4 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-red-500/30 overflow-hidden">
                    {/* Animated Background Grid */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                    
                    <div className="relative space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center shadow-lg shadow-red-500/50">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <span className="text-gray-300 text-sm font-mono font-bold">Prediction Confidence</span>
                      </div>
                      
                      {/* Enhanced Progress Bar */}
                      <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                        <div 
                          className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full"
                          style={{ 
                            width: '95.6%',
                            animation: 'progressBar 2s ease-out 0.5s forwards',
                            boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Model Info */}
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500">XGBoost + BERT + CNN</span>
                        <span className="text-gray-500">51,888 samples</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Stats */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-gray-900/90 to-red-900/50 border border-red-500/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-red-500/50">
                    <span className="text-white font-black text-lg">R²</span>
                    <div className="absolute inset-0 rounded-lg bg-red-500/30 blur-md animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">95.6%</div>
                    <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24">
        {/* Grid Background with Red tint */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              <span className="font-mono text-gray-600 text-xl block mb-2">// SYSTEM ARCHITECTURE</span>
              Technical{" "}
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Stack
              </span>
            </h2>
            <p className="text-gray-500 text-lg font-mono">
              {'>'} Three-layer neural pipeline for maximum accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-gray-900/80 border border-gray-800 rounded-lg p-6 hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg"></div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center border border-red-500/30 group-hover:border-red-500 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 font-mono">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-6">{feature.description}</p>
                
                {/* Stats Display */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent font-mono">
                      {feature.stat}
                    </span>
                    <span className="text-xs text-gray-500 font-mono uppercase">{feature.statLabel}</span>
                  </div>
                </div>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-blue-500/0 group-hover:from-red-500/5 group-hover:to-blue-500/5 rounded-lg transition-all pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-24">
        {/* Scanline Effect with Red tint */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.5) 2px, rgba(239, 68, 68, 0.5) 4px)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="font-mono text-red-400 text-sm mb-4">
                <span className="text-gray-600">{'>'}</span> CORE_VALUES.init()
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                <span className="block text-gray-600 font-mono text-lg mb-2">{'<system>'}</span>
                What Makes PrePost{" "}
                <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Different
                </span>
                <span className="block text-gray-600 font-mono text-lg mt-2">{'</system>'}</span>
              </h2>
              
              {/* Values List */}
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index} className="group flex items-start gap-4 p-4 rounded border border-gray-800 hover:border-red-500/50 bg-gray-900/50 transition-all backdrop-blur-sm">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-red-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 border border-red-500/30 font-mono text-red-400 text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="font-bold text-white mb-1 font-mono text-sm">{value.title}</div>
                      <div className="text-gray-400 text-sm">{value.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Data Visualization */}
            <div className="relative">
              {/* Main Stats Panel */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-lg overflow-hidden backdrop-blur-sm">
                {/* Header */}
                <div className="bg-gray-800/80 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-gray-400 font-mono text-xs">MODEL_METRICS.json</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Main Stat */}
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
                    <div className="w-16 h-16 rounded bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center">
                      <FiTrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-4xl font-black text-white font-mono">51,888</div>
                      <div className="text-gray-500 text-xs font-mono">TRAINING_SAMPLES</div>
                    </div>
                  </div>
                  
                  {/* Metrics */}
                  <div className="space-y-4">
                    {[
                      { label: 'R² Score', value: 95.6, max: 100, color: 'from-red-500 to-red-600' },
                      { label: 'BERT Dims', value: 768, max: 1000, color: 'from-purple-500 to-purple-600' },
                      { label: 'CNN Dims', value: 512, max: 1000, color: 'from-blue-500 to-blue-600' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs mb-2 font-mono">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-bold">{item.value}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-out`}
                            style={{ width: `${(item.value / item.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-500">STACK: XGBoost + BERT + CNN</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-red-400">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-lg border border-red-500/30 backdrop-blur-sm flex items-center justify-center">
                <span className="text-red-400 font-mono text-xs">v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-24">
        {/* Matrix-style Background with Red */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 font-mono text-red-500 text-xs leading-tight">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="whitespace-nowrap animate-scroll" style={{ animationDelay: `${i * 0.1}s` }}>
                01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/10 to-blue-500/10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-red-500/30 bg-red-500/10 backdrop-blur-sm mb-8 font-mono text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>READY_TO_DEPLOY</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-tight">
            <span className="block text-gray-600 font-mono text-lg mb-2">{'<initialize>'}</span>
            Start Predicting Your
            <span className="block bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              YouTube Performance
            </span>
            <span className="block text-gray-600 font-mono text-lg mt-2">{'</initialize>'}</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group h-14 px-8 bg-gradient-to-r from-red-500 to-blue-500 rounded font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2 text-white"
            >
              <span>Sign Up</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/post-performance"
              className="h-14 px-8 border border-gray-700 rounded font-bold hover:bg-gray-900 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 text-gray-300"
            >
              <span>VIEW DEMO</span>
            </Link>
          </div>
          
          {/* System Status */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 font-mono text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>API: ONLINE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>MODELS: LOADED</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <span>LATENCY: {'<'}50ms</span>
            </div>
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
      </div>
    </main>
  );
}