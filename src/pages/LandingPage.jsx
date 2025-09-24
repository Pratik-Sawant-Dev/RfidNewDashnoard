import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gem, 
  Shield, 
  Zap, 
  BarChart3, 
  Smartphone, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Play
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ui/ThemeToggle';

const LandingPage = () => {
  const features = [
    {
      icon: Gem,
      title: 'RFID Jewelry Tracking',
      description: 'Advanced RFID technology for real-time jewelry inventory management and anti-theft protection.',
    },
    {
      icon: Zap,
      title: 'Instant Inventory',
      description: 'Real-time stock updates and automated inventory management with RFID scanning.',
    },
    {
      icon: BarChart3,
      title: 'Smart Analytics',
      description: 'Comprehensive reports and analytics to optimize your jewelry business operations.',
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Multi-layer security with RFID tags and comprehensive audit trails.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Access your jewelry management system from any device, anywhere.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Complete customer relationship management with purchase history and preferences.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, Diamond Dreams',
      content: 'RFID Jewelry Management has revolutionized our inventory tracking. We can now track every piece in real-time.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Manager, Golden Treasures',
      content: 'The analytics and reporting features have helped us increase sales by 30% in just 3 months.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'CEO, Precious Stones Co.',
      content: 'The RFID security features give us peace of mind. No more inventory shrinkage.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-primary shadow-primary">
              <Gem className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient font-elegant">
              JewelRFID
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-gradient-primary shadow-primary hover:shadow-secondary transform hover:scale-105 transition-all duration-200">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:px-8 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-secondary-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gold-200 to-accent-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-accent rounded-full text-sm font-medium text-gray-700 mb-6 shadow-lg">
              <Zap className="w-4 h-4 mr-2 text-gold-600" />
              New: AI-Powered Inventory Management
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-elegant leading-tight">
              Revolutionize Your
              <span className="block text-gradient-gold mt-2">Jewelry Empire</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your jewelry business with cutting-edge RFID technology. 
              Track, secure, and optimize every precious piece with intelligent automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/onboarding">
                <Button size="xl" className="bg-gradient-primary shadow-primary hover:shadow-secondary transform hover:scale-105 transition-all duration-300">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group">
                <div className="p-3 rounded-full bg-white shadow-lg group-hover:shadow-primary transition-all duration-300">
                  <Play className="w-5 h-5 text-primary-600" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">10k+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Items Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-600">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 lg:px-8 bg-white dark:bg-gray-800 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('#3674B5').slice(1)}' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-accent rounded-full text-sm font-medium text-gray-700 mb-4">
              <Shield className="w-4 h-4 mr-2 text-primary-600" />
              Enterprise-Grade Security
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              Powerful Features for Modern Jewelers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage, track, and grow your jewelry business efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const gradients = [
                'from-primary-500 to-secondary-500',
                'from-secondary-500 to-primary-600',
                'from-gold-500 to-gold-600',
                'from-accent-400 to-accent-600',
                'from-primary-400 to-primary-600',
                'from-secondary-400 to-secondary-600'
              ];
              
              return (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 lg:px-8 bg-gradient-to-br from-accent-50 via-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-gold-300 to-gold-500 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-tr from-primary-300 to-secondary-400 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-gold rounded-full text-sm font-medium text-gray-800 mb-4 shadow-gold">
              <Star className="w-4 h-4 mr-2 text-gray-800" />
              5-Star Rated Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              Trusted by Jewelry Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers say about JewelRFID
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-center leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="text-center border-t pt-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 lg:px-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/5 rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            30-Day Free Trial • No Credit Card Required
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-elegant text-white">
            Ready to Transform Your Jewelry Business?
          </h2>
          
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of jewelry professionals who trust JewelRFID for their business management. 
            Start your journey to smarter inventory management today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/onboarding">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Security
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              99.9% Uptime
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 lg:px-8 bg-gray-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-xl bg-gradient-primary shadow-primary">
                  <Gem className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold font-elegant">JewelRFID</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Revolutionizing jewelry business management with advanced RFID technology and intelligent automation.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 JewelRFID. All rights reserved. Made with ❤️ for jewelry professionals.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
