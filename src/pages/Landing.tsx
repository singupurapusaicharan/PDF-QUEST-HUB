import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles, Zap, Shield, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950/20 transition-colors duration-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="md" showText={true} />
            <div className="flex items-center space-x-3">
              <Link to="/signin">
                <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-0 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/50 dark:to-emerald-950/50 border border-teal-200/50 dark:border-teal-800/50 rounded-full px-5 py-2.5 backdrop-blur-sm shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-teal-700 to-emerald-700 dark:from-teal-300 dark:to-emerald-300 bg-clip-text text-transparent">
                AI-Powered Document Intelligence
              </span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent animate-gradient">
                  Transform PDFs into
                </span>
                <span className="block mt-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent animate-gradient">
                  Conversations
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                Experience the future of document analysis with AI that understands context, 
                answers instantly, and keeps your data private.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="group bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white border-0 px-10 h-14 text-lg shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>AI-powered analysis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
              Built for Performance
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features that make document analysis effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-7 h-7" />}
              title="AI-Powered Q&A"
              description="Ask questions about your PDFs and get instant, accurate answers powered by advanced language models."
              gradient="from-teal-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Shield className="w-7 h-7" />}
              title="Secure & Private"
              description="Your documents are stored securely with user-specific isolation. Only you can access your files."
              gradient="from-blue-500 to-indigo-500"
            />
            <FeatureCard
              icon={<Globe className="w-7 h-7" />}
              title="Multi-Document Support"
              description="Upload multiple PDFs, organize them easily, and switch between documents seamlessly."
              gradient="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 rounded-3xl p-16 shadow-2xl shadow-teal-500/30 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"></div>
            
            <div className="relative text-center space-y-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Ready to revolutionize your workflow?
              </h2>
              <p className="text-xl text-teal-50 max-w-2xl mx-auto">
                Start analyzing your documents with AI-powered intelligence today
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-50 h-14 px-10 text-lg shadow-xl hover:scale-105 transition-all duration-300">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-gray-200/50 dark:border-gray-800/50 py-16 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <Logo size="sm" showText={true} className="justify-center" />
            <p className="text-gray-600 dark:text-gray-400">
              © 2026 PDF Quest Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) => (
  <div className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-8 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 hover:-translate-y-2">
    <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);
