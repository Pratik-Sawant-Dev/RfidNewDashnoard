import React, { useState, useEffect } from 'react';
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
  Play,
  Radio,
  Lock,
  Clock,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  Code,
  Database,
  Globe,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Tag,
  Smartphone as MobileIcon,
  BarChart,
  FileText,
  Settings
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ui/ThemeToggle';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const rfidBenefits = [
    {
      icon: Radio,
      title: 'Real-Time Inventory Tracking',
      description: 'Instantly locate any jewelry piece in your store with RFID tag scanning. Know exactly where every item is at any moment, reducing search time by 90%.',
    },
    {
      icon: Shield,
      title: 'Anti-Theft Protection',
      description: 'Advanced RFID security alerts you immediately if jewelry leaves unauthorized zones. Protect your valuable inventory with automated monitoring systems.',
    },
    {
      icon: Clock,
      title: 'Time-Saving Automation',
      description: 'Complete inventory counts in minutes instead of hours. RFID technology automates stocktaking, saving your team countless hours of manual work.',
    },
    {
      icon: TrendingUp,
      title: 'Inventory Accuracy',
      description: 'Achieve 99.9% inventory accuracy with RFID scanning. Eliminate human errors in counting, pricing, and cataloging your jewelry pieces.',
    },
    {
      icon: Package,
      title: 'Automated Stock Management',
      description: 'Automatically track incoming and outgoing jewelry pieces. Get instant notifications for low stock, missing items, and inventory movements.',
    },
    {
      icon: DollarSign,
      title: 'Reduce Inventory Shrinkage',
      description: 'Prevent losses from theft, misplacement, and human error. RFID tracking helps identify issues before they become significant losses.',
    },
  ];

  const dashboardFeatures = [
    {
      icon: BarChart3,
      title: 'Sales Analytics & Reporting',
      description: 'Comprehensive sales dashboards showing daily, weekly, and monthly performance. Track revenue, profit margins, and top-selling items to make data-driven decisions.',
    },
    {
      icon: Users,
      title: 'Customer Relationship Management',
      description: 'Maintain detailed customer profiles with purchase history, preferences, and engagement metrics. Build stronger relationships with personalized service.',
    },
    {
      icon: Tag,
      title: 'Product Catalog Management',
      description: 'Organize your entire jewelry collection with detailed product information, images, pricing, and specifications. Easy search and filtering capabilities.',
    },
    {
      icon: FileText,
      title: 'Automated Invoice Generation',
      description: 'Create professional invoices instantly with RFID-scanned items. Streamline your billing process and reduce paperwork significantly.',
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts & Notifications',
      description: 'Get notified about low stock, expired warranties, customer follow-ups, and important business events. Never miss critical information.',
    },
    {
      icon: MobileIcon,
      title: 'Mobile Accessibility',
      description: 'Access your entire jewelry management system from any device. Manage inventory, process sales, and view reports on-the-go.',
    },
  ];

  const apiFeatures = [
    {
      icon: Code,
      title: 'RESTful API',
      description: 'Well-documented REST API for seamless integration with your existing POS systems, accounting software, and e-commerce platforms.',
    },
    {
      icon: Database,
      title: 'Real-Time Data Sync',
      description: 'Synchronize inventory, sales, and customer data in real-time across multiple platforms. Keep all your systems updated automatically.',
    },
    {
      icon: Settings,
      title: 'Custom Integrations',
      description: 'Flexible API endpoints allow custom integrations with CRM systems, accounting software, payment gateways, and third-party applications.',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with API keys, OAuth 2.0 support, and encrypted data transmission. Your data is always protected.',
    },
    {
      icon: Globe,
      title: 'Webhook Support',
      description: 'Receive instant notifications via webhooks when inventory changes, sales occur, or important events happen in your system.',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Fast API responses with rate limiting and caching. Handle high-volume transactions without performance degradation.',
    },
  ];

  const faqs = [
    {
      question: 'How does RFID technology help jewelry retailers?',
      answer: 'RFID technology revolutionizes jewelry retail by providing real-time inventory tracking, preventing theft, automating stock management, and significantly reducing manual counting time. Each jewelry piece gets a unique RFID tag that can be scanned instantly, giving you complete visibility into your inventory at all times.'
    },
    {
      question: 'What makes this dashboard software different from other jewelry management systems?',
      answer: 'Our software is specifically designed for jewelry retailers with RFID integration at its core. Unlike generic inventory systems, we understand the unique needs of jewelry businesses including intricate product details, pricing complexity, warranty tracking, and the high value nature of inventory requiring advanced security features.'
    },
    {
      question: 'How do I integrate this with my existing POS system?',
      answer: 'Our RESTful API allows seamless integration with most POS systems. You can synchronize inventory data, sales transactions, and customer information in real-time. Our technical team provides documentation and support to help you integrate with popular POS systems like Square, Shopify, WooCommerce, and custom solutions.'
    },
    {
      question: 'Can I use this software for multiple store locations?',
      answer: 'Yes! Our multi-location support allows you to manage inventory across multiple stores from a single dashboard. Track transfers between locations, monitor stock levels at each store, and generate location-specific reports. Perfect for jewelry retailers with multiple showrooms.'
    },
    {
      question: 'What kind of reporting and analytics does the dashboard provide?',
      answer: 'The dashboard offers comprehensive analytics including sales performance, inventory turnover, profit margins, customer analytics, top-selling items, seasonal trends, and customizable reports. All reports can be exported and scheduled for automatic delivery to help you make informed business decisions.'
    },
    {
      question: 'Is my data secure and backed up?',
      answer: 'Absolutely. We use enterprise-grade security with encrypted data transmission, regular automated backups, and compliance with industry standards. Your jewelry inventory data is stored securely with 99.9% uptime guarantee and multiple backup locations.'
    },
    {
      question: 'How quickly can I get started with the system?',
      answer: 'Getting started is quick and easy. Sign up for a free trial, complete our onboarding process which takes about 10 minutes, and start adding your inventory. Our RFID tags can be generated and printed immediately. If you need assistance, our support team is available 24/7 to help you get up and running.'
    },
    {
      question: 'What devices can I use to access the dashboard?',
      answer: 'The dashboard is fully responsive and works on all devices - desktops, laptops, tablets, and smartphones. Whether you\'re in the store, at home, or traveling, you can access your jewelry management system through any web browser. Mobile apps are also available for iOS and Android.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md' 
          : 'bg-transparent'
      }`}>
        <div className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <img 
                src="/images/Sparkle ERP Logo.svg" 
                alt="Sparkle ERP Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400">
                  Sign In
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-20 lg:py-28 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6 shadow-lg">
            <Zap className="w-4 h-4 mr-2" />
            New: AI-Powered Inventory Management
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 font-elegant leading-tight">
            Revolutionize Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-2">
              Jewelry Empire
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Transform your jewelry business with cutting-edge RFID technology. 
            Track, secure, and optimize every precious piece with intelligent automation designed specifically for retail jewelers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/onboarding">
              <Button size="xl" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group font-medium text-base sm:text-lg">
              <div className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Play className="w-5 h-5 text-blue-600" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">10k+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 font-medium">Jewelry Items Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-cyan-600 dark:text-cyan-400">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 font-medium">Inventory Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 font-medium">Retail Jewelers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How RFID Helps Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <Radio className="w-4 h-4 mr-2" />
              RFID Technology
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              How RFID Transforms Jewelry Retail
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover how RFID technology solves common challenges in jewelry retail management and helps you run a more efficient, profitable business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {rfidBenefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Benefits for Retail Jewelers */}
      <section className="px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-br from-blue-50 via-cyan-50 to-white dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              How Our Dashboard Helps Retail Jewelers
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive tools designed specifically for jewelry retailers to streamline operations, increase sales, and manage inventory efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {dashboardFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-white dark:bg-gray-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <Code className="w-4 h-4 mr-2" />
              Developer Friendly
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              API Integration for Third-Party Software
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Seamlessly integrate our RFID jewelry management system with your existing POS, accounting, e-commerce, and CRM platforms through our robust API.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {apiFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 sm:p-12 text-white text-center">
            <Code className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 opacity-90" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Ready to Integrate?
            </h3>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
              Get started with our comprehensive API documentation and developer resources. Our technical team is ready to help you integrate seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl text-base sm:text-lg px-8">
                View API Documentation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-base sm:text-lg px-8">
                Contact Developer Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-elegant">
              Everything You Need to Know
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Common questions about RFID technology, dashboard features, and integration capabilities.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-20 lg:py-24 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            30-Day Free Trial • No Credit Card Required
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-elegant text-white">
            Ready to Transform Your Jewelry Business?
          </h2>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of retail jewelers who trust our RFID-powered management system. 
            Start your journey to smarter inventory management and increased profitability today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/onboarding">
              <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-8 py-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 text-base sm:text-lg px-8 py-4">
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-white/80 text-sm sm:text-base">
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Enterprise Security
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              99.9% Uptime
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 sm:py-16 lg:px-8 bg-gray-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div className="sm:col-span-2">
              <div className="flex items-center mb-4 sm:mb-6">
                <img 
                  src="/images/Sparkle ERP Logo.svg" 
                  alt="Sparkle ERP Logo" 
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-base sm:text-lg text-gray-400 mb-6 max-w-md leading-relaxed">
                Revolutionizing jewelry business management with advanced RFID technology and intelligent automation designed specifically for retail jewelers.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 sm:mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-base">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 sm:mb-6 text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors text-base">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-base">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm sm:text-base mb-4 md:mb-0">
              © 2024 Sparkle ERP. All rights reserved. Made with ❤️ for jewelry professionals.
            </p>
            <div className="flex flex-wrap space-x-6 text-sm sm:text-base text-gray-400">
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
