import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  User,
  Shield,
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
    { number: 1, title: "Organization", icon: Building2 },
    { number: 2, title: "Personal", icon: User },
    { number: 3, title: "Review", icon: Shield },
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
    <div className="space-y-4 sm:space-y-5">
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
            className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
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
    <div className="space-y-4 sm:space-y-5">
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
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Account Summary
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Please review your information before completing registration
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl p-4 sm:p-6 space-y-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Organization
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.organisationName || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Showroom Type
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.showroomType || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Email
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.email || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Mobile
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.mobileNumber || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Full Name
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.fullName || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Username
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.userName || "—"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Address
            </span>
            <p className="text-base font-medium text-gray-900 dark:text-white mt-1">
              {formData.address || "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-center space-x-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
            <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Administrator Account - Full Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-20"></div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-2xl">
          {/* Progress Steps - Modern Design */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? "bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm font-medium hidden sm:block ${
                      currentStep >= step.number
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 w-12 sm:w-16 md:w-24 mx-2 sm:mx-4 transition-all duration-300 ${
                        currentStep > step.number
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                          : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Registration Form Card */}
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Step Indicator Text */}
              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentStep === 1 && "Organization Details"}
                  {currentStep === 2 && "Personal Information"}
                  {currentStep === 3 && "Review & Complete"}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Step {currentStep} of {steps.length}
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit}>
                <div className="min-h-[400px] sm:min-h-[450px]">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      className="border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transition-all w-full sm:w-auto font-medium"
                      onClick={nextStep}
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transition-all w-full sm:w-auto font-medium"
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

              {/* Footer Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  Already have an account? Sign in
                </Link>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Home
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default OnboardingPage;
