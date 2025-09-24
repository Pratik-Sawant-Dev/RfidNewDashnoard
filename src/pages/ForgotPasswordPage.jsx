import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Gem, ArrowLeft, CheckCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ToastContainer } from "../components/ui/Toast";
import useToast from "../hooks/useToast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toasts, success, error, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      success("Password reset instructions sent to your email");
    } catch (err) {
      error("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      success("Reset instructions sent again to your email");
    } catch (err) {
      error("Failed to resend email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-primary-900 dark:to-gold-900 rounded-3xl transform rotate-3 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 via-amber-50 to-yellow-100 dark:from-gold-800 dark:to-amber-800 rounded-3xl transform -rotate-2 animate-float"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-5 right-5 w-9 h-9 bg-violet-200 dark:bg-violet-700 rounded-full animate-bounce-gentle opacity-60"></div>
            <div className="absolute bottom-7 left-7 w-7 h-7 bg-orange-300 dark:bg-orange-600 rounded-full animate-bounce-gentle opacity-70" style={{ animationDelay: '1.2s' }}></div>
            <div className="absolute top-1/4 right-10 w-5 h-5 bg-blue-300 dark:bg-blue-600 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute bottom-1/4 left-10 w-6 h-6 bg-indigo-300 dark:bg-indigo-600 rounded-full animate-bounce-gentle opacity-60" style={{ animationDelay: '1.8s' }}></div>
            
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
                  Secure Account Recovery
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  We'll help you regain access to your jewelry management account safely and securely
                </p>
                
                {/* Animated feature list */}
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                    Secure Password Reset
                  </div>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-gold-500 rounded-full mr-2 animate-pulse"></div>
                    Email Verification
                  </div>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
                    Account Protection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Gem className="w-8 h-8 text-primary-500" />
                <span className="text-2xl font-bold text-gradient font-elegant">
                  JewelRFID
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {emailSent ? "Check Your Email" : "Forgot Password?"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {emailSent 
                  ? "We've sent password reset instructions to your email address"
                  : "Enter your email address and we'll send you instructions to reset your password"
                }
              </p>
            </div>

            {/* Form */}
            <Card>
              {!emailSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    icon={Mail}
                    required
                  />

                  <Button
                    type="submit"
                    variant="accent"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Email Sent Successfully
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We've sent password reset instructions to:
                    </p>
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {email}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleResendEmail}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Resending..." : "Resend Email"}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setEmailSent(false);
                        setEmail("");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Use Different Email
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

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

export default ForgotPasswordPage;
