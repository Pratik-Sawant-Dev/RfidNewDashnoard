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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Gem className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-gradient font-elegant">
              JewelRFID
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="accent">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-elegant">
              Revolutionize Your
              <span className="block text-gradient">Jewelry Business</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Advanced RFID technology for complete jewelry inventory management, 
              security, and business optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/onboarding">
                <Button size="xl" variant="accent" className="shadow-blue">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              Powerful Features for Modern Jewelers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to manage, track, and grow your jewelry business efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 lg:px-8 bg-gradient-to-r from-blue-50 to-primary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              Trusted by Jewelry Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers say about JewelRFID
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
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
      <section className="px-4 py-20 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-primary text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-elegant">
              Ready to Transform Your Jewelry Business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of jewelry professionals who trust JewelRFID for their business management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Sign In to Existing Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Gem className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-bold font-elegant">JewelRFID</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 JewelRFID. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
