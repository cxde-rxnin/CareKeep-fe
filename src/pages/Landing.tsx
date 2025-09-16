import { Shield, Database, Cloud, ArrowRight, CheckCircle, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import dashboardImage from '../assets/carekeep.png'

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              CareKeep
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/signup" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 500+ Healthcare Providers
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
                Secure Hospital
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Data Backups
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade backup solutions designed for healthcare. 
              Keep patient data safe, compliant, and instantly accessible with military-grade encryption.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/signup" 
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                NDPR Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
              <Database className="w-4 h-4 mr-2" />
              Dashboard
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Manage Healthcare Like a </span>
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Pro</span> 💪
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              CareKeep streamlines your data management by providing a powerful, all-in-one solution.
            </p>
          </div>
          
          {/* Dashboard Image with Modern Design */}
          <div className="max-w-6xl mx-auto relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-emerald-500/20 blur-3xl rounded-3xl"></div>
            
            {/* Dashboard container with border and shadow */}
            <div className="relative bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-3xl p-4 shadow-2xl">
              <img 
                src={dashboardImage} 
                alt="CareKeep Dashboard Preview"
                className="w-full h-auto rounded-2xl shadow-2xl"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
              />
              
              {/* Subtle overlay gradient for better text visibility */}
              <div className="absolute inset-4 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
            </div>
            
            {/* Floating elements for visual appeal */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-emerald-500 rounded-full blur-lg opacity-60"></div>
            <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-emerald-400 rounded-full blur-xl opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Built for Healthcare
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every feature designed with healthcare compliance and security in mind
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-gradient-to-b from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-300">Field-Level Encryption</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Advanced encryption ensures PHI remains private and secure, even in backup files. 
                Zero-knowledge architecture means only you can access your data.
              </p>
              <div className="text-emerald-400 font-medium">AES-256 Encryption →</div>
            </div>
            
            <div className="group bg-gradient-to-b from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-300">Smart Snapshots</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Create versioned snapshots with incremental backups. 
                Restore to any point in time with zero data loss and minimal downtime.
              </p>
              <div className="text-emerald-400 font-medium">Point-in-Time Recovery →</div>
            </div>
            
            <div className="group bg-gradient-to-b from-gray-900/50 to-gray-900/20 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all">
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-emerald-300">Compliance Auditing</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Immutable audit logs track every access and change. 
                Built-in compliance reporting for NDPR, SOC 2, and other healthcare standards.
              </p>
              <div className="text-emerald-400 font-medium">Automated Reports →</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Ready to Secure Your Data?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join hundreds of healthcare providers who trust CareKeep with their most sensitive data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25"
              >
                Start Secure Backup Now
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-gray-900/50 border border-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-800/70 transition-all duration-300 backdrop-blur-sm"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            
            <div className="text-sm text-gray-400">
              © 2025 CareKeep. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
