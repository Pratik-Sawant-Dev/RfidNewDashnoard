import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Gem,
  CheckCircle,
  Building2,
  User,
  CreditCard,
  Shield,
  Zap,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Home,
  UserCircle,
  Lock,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ToastContainer } from "../components/ui/Toast";
import useToast from "../hooks/useToast";
import { registerAdmin } from "../utils/api";

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toasts, success, error, warning, removeToast } = useToast();

  const [formData, setFormData] = useState({
    // Step 1: Organization Info
    organisationName: "",
    showroomType: "",
    email: "",
    mobileNumber: "",
    city: "",
    address: "",

    // Step 2: Personal Info
    fullName: "",
    userName: "",
    password: "",
    confirmPassword: "",

    // Step 3: User Type
    userType: "Admin",
    isAdmin: true,
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, title: "Organization Information", icon: Building2 },
    { number: 2, title: "Personal Details", icon: User },
    { number: 3, title: "Account Setup", icon: Shield },
  ];

  const showroomTypes = [
    { value: "Premium", label: "Premium" },
    { value: "Standard", label: "Standard" },
    { value: "Luxury", label: "Luxury" },
    { value: "Boutique", label: "Boutique" },
    { value: "Wholesale", label: "Wholesale" },
    { value: "Designer", label: "Designer" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.organisationName)
        newErrors.organisationName = "Organization name is required";
      if (!formData.showroomType)
        newErrors.showroomType = "Showroom type is required";
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.mobileNumber)
        newErrors.mobileNumber = "Mobile number is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.address) newErrors.address = "Address is required";
    }

    if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.userName) newErrors.userName = "Username is required";
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Prepare payload according to API structure
      const payload = {
        userName: formData.userName || formData.email,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        city: formData.city,
        address: formData.address,
        organisationName: formData.organisationName,
        showroomType: formData.showroomType,
      };

      // Simple API call using utility function
      const result = await registerAdmin(payload);

      console.log(result);

      // Handle successful response (when result contains userId, it means success)
      if (result && result.userId) {
        success("Registration successful! Welcome to JewelRFID.");

        // Store user data if needed
        if (result.userId) {
          localStorage.setItem("userId", result.userId);
          localStorage.setItem("userName", result.userName);
          localStorage.setItem("clientCode", result.clientCode);
        }

        // Navigate to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.log(err);
      error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <Input
        label="Organization Name"
        name="organisationName"
        value={formData.organisationName}
        onChange={handleChange}
        error={errors.organisationName}
        placeholder="Enter your organization name"
        icon={Building2}
      />

      <Select
        label="Showroom Type"
        name="showroomType"
        value={formData.showroomType}
        onChange={(value) => setFormData(prev => ({ ...prev, showroomType: value }))}
        options={showroomTypes}
        placeholder="Select showroom type"
        icon={Building2}
        error={errors.showroomType}
        searchable={true}
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="admin@jewelrystore.com"
        icon={Mail}
      />

      <Input
        label="Mobile Number"
        type="tel"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
        error={errors.mobileNumber}
        placeholder="+91-9876543210"
        icon={Phone}
      />

      <Input
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        error={errors.city}
        placeholder="Enter your city"
        icon={MapPin}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <div className="relative">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your complete address"
          />
          <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.address}
          </p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <Input
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        placeholder="Enter your full name"
        icon={User}
      />

      <Input
        label="Username"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        error={errors.userName}
        placeholder="Enter username (or use email)"
        icon={UserCircle}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="Enter a secure password"
        icon={Lock}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        icon={Lock}
      />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Account Summary
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please review your information before completing registration
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Organization:
            </span>
            <p className="text-gray-900 dark:text-white">
              {formData.organisationName}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Showroom Type:
            </span>
            <p className="text-gray-900 dark:text-white">
              {formData.showroomType}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email:
            </span>
            <p className="text-gray-900 dark:text-white">{formData.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Mobile:
            </span>
            <p className="text-gray-900 dark:text-white">
              {formData.mobileNumber}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Full Name:
            </span>
            <p className="text-gray-900 dark:text-white">{formData.fullName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Username:
            </span>
            <p className="text-gray-900 dark:text-white">{formData.userName}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Address:
            </span>
            <p className="text-gray-900 dark:text-white">{formData.address}</p>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-xs text-gray-600 dark:text-gray-300">
              Administrator Account - Full Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced background decoration for light mode */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-indigo-400 dark:from-blue-800 dark:to-indigo-900 rounded-full opacity-30 dark:opacity-20 animate-bounce-gentle"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-300 to-orange-400 dark:from-primary-800 dark:to-amber-900 rounded-full opacity-25 dark:opacity-20 animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        ></div>
        
        {/* Additional decorative elements for light mode */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-300 dark:from-purple-800 dark:to-pink-900 rounded-full opacity-20 dark:opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800 dark:to-teal-900 rounded-full opacity-25 dark:opacity-10 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      </div>

      {/* Two-column layout for large screens - Optimized for no scrolling */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Header Content (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-6">
          <div className="relative w-full h-full max-w-md">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-primary-900 dark:to-gold-900 rounded-3xl transform rotate-3 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 via-pink-50 to-purple-100 dark:from-gold-800 dark:to-amber-800 rounded-3xl transform -rotate-2 animate-float"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-200 dark:bg-emerald-700 rounded-full animate-bounce-gentle opacity-60"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-rose-300 dark:bg-rose-600 rounded-full animate-bounce-gentle opacity-70" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 right-6 w-5 h-5 bg-purple-300 dark:bg-purple-600 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '0.8s' }}></div>
            
            {/* Main card with header content */}
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center">
                {/* Header with logo and title */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="relative">
                    <Gem className="w-8 h-8 text-primary-600 dark:text-primary-400 drop-shadow-lg" />
                    <div className="absolute inset-0 w-8 h-8">
                      <div className="w-full h-full rounded-full bg-primary-200 dark:bg-primary-800 animate-ping opacity-20"></div>
                    </div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 dark:from-primary-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-elegant">
                    JewelRFID
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Get Started with JewelRFID
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Set up your jewelry management system in minutes
                </p>
                
                {/* Animated gem icon */}
                <div className="relative mb-4">
                  <Gem className="w-16 h-16 text-primary-500 mx-auto drop-shadow-lg" />
                  <div className="absolute inset-0 w-16 h-16 mx-auto">
                    <div className="w-full h-full rounded-full bg-primary-200 dark:bg-primary-800 animate-ping opacity-20"></div>
                  </div>
                </div>
                
                {/* Animated feature list */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                    Easy Setup Process
                  </div>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-gold-500 rounded-full mr-2 animate-pulse"></div>
                    Professional Support
                  </div>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
                    Secure & Reliable
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Onboarding Form - Compact layout */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-xl">

            {/* Compact Progress Steps */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-r from-primary-600 to-blue-600 text-white shadow-primary-200 dark:shadow-primary-800"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1.5 mx-2 rounded-full transition-all duration-300 ${
                          currentStep > step.number
                            ? "bg-gradient-to-r from-primary-600 to-blue-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Form */}
            <Card className="shadow-xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
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
                      className="bg-gradient-primary"
                      onClick={nextStep}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>

              {/* Back to Home - moved to bottom of card */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Theme Toggle - moved to bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default OnboardingPage;
