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
    <div className="space-y-6">
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
    <div className="space-y-6">
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Account Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Please review your information before completing registration
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="border-t pt-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Administrator Account - Full Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Two-column layout for large screens */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Jewelry Image (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-8">
          <div className="relative w-full h-full max-w-lg">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-primary-900 dark:to-gold-900 rounded-3xl transform rotate-3 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 via-pink-50 to-purple-100 dark:from-gold-800 dark:to-amber-800 rounded-3xl transform -rotate-2 animate-float"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-6 right-6 w-10 h-10 bg-emerald-200 dark:bg-emerald-700 rounded-full animate-bounce-gentle opacity-60"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 bg-rose-300 dark:bg-rose-600 rounded-full animate-bounce-gentle opacity-70" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/3 right-8 w-6 h-6 bg-purple-300 dark:bg-purple-600 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute bottom-1/3 left-12 w-4 h-4 bg-cyan-300 dark:bg-cyan-600 rounded-full animate-bounce-gentle opacity-60" style={{ animationDelay: '2.2s' }}></div>
            
            {/* Main card */}
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="text-center">
                {/* Animated gem icon */}
                <div className="relative mb-6">
                  <Gem className="w-24 h-24 text-primary-500 mx-auto drop-shadow-lg" />
                  <div className="absolute inset-0 w-24 h-24 mx-auto">
                    <div className="w-full h-full rounded-full bg-primary-200 dark:bg-primary-800 animate-ping opacity-20"></div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in-up">
                  Start Your Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Join thousands of jewelry businesses already using JewelRFID
                </p>
                
                {/* Animated feature list */}
                <div className="grid grid-cols-1 gap-4 text-sm">
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

        {/* Right side - Onboarding Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
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
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full ${
                        currentStep >= step.number
                          ? "bg-primary-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-1 mx-2 ${
                          currentStep > step.number
                            ? "bg-primary-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
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
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
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
