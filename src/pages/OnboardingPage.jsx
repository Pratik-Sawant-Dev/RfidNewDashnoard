import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Gem, 
  CheckCircle, 
  Building2, 
  User, 
  CreditCard,
  Shield,
  Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import ThemeToggle from '../components/ui/ThemeToggle';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Business Info
    businessName: '',
    businessType: '',
    contactEmail: '',
    phoneNumber: '',
    
    // Step 2: Personal Info
    firstName: '',
    lastName: '',
    position: '',
    
    // Step 3: Preferences
    planType: 'basic',
    features: [],
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: 'Business Information', icon: Building2 },
    { number: 2, title: 'Personal Details', icon: User },
    { number: 3, title: 'Choose Plan', icon: CreditCard },
  ];

  const businessTypes = [
    'Jewelry Store',
    'Jewelry Wholesaler',
    'Jewelry Designer',
    'Jewelry Manufacturer',
    'Jewelry Retailer',
    'Other'
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29',
      period: '/month',
      features: [
        'Up to 100 RFID tags',
        'Basic inventory management',
        'Sales tracking',
        'Email support',
      ],
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/month',
      features: [
        'Up to 500 RFID tags',
        'Advanced inventory management',
        'Customer management',
        'Analytics & reports',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      features: [
        'Unlimited RFID tags',
        'Full inventory management',
        'Multi-location support',
        'Advanced analytics',
        'API access',
        '24/7 support',
      ],
      popular: false,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.contactEmail) {
        newErrors.contactEmail = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Email is invalid';
      }
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.position) newErrors.position = 'Position is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    // Simulate API call
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <Input
        label="Business Name"
        name="businessName"
        value={formData.businessName}
        onChange={handleChange}
        error={errors.businessName}
        placeholder="Enter your business name"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Business Type
        </label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select business type</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.businessType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.businessType}</p>
        )}
      </div>

      <Input
        label="Contact Email"
        type="email"
        name="contactEmail"
        value={formData.contactEmail}
        onChange={handleChange}
        error={errors.contactEmail}
        placeholder="business@example.com"
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={errors.phoneNumber}
        placeholder="+1 (555) 123-4567"
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="Enter your first name"
        />

        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          placeholder="Enter your last name"
        />
      </div>

      <Input
        label="Position"
        name="position"
        value={formData.position}
        onChange={handleChange}
        error={errors.position}
        placeholder="e.g., Store Manager, Owner, etc."
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Choose Your Plan
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Start with a free trial, upgrade anytime
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={`relative cursor-pointer transition-all duration-200 ${
              formData.planType === plan.id
                ? 'ring-2 ring-primary-500 shadow-primary'
                : 'hover:shadow-lg'
            } ${plan.popular ? 'border-primary-500' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, planType: plan.id }))}
          >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
            
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h4>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {plan.period}
                </span>
              </div>
              
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Gem className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold text-gradient font-elegant">
              JewelRFID
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Get Started with JewelRFID
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Set up your jewelry management system in minutes
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.number
                      ? 'bg-primary-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="accent"
                  onClick={nextStep}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accent"
                >
                  Complete Setup
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Theme Toggle */}
        <div className="flex justify-center mt-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
