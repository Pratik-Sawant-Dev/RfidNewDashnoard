import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Radio, Shield } from "lucide-react";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { ToastContainer } from "../../components/ui/Toast";
import useToast from "../../hooks/useToast";

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
    <div className="min-h-screen bg-gradient-to-br from-[#E6F2FF] via-white to-[#FFE6E6] dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Premium Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#0077D4]/10 dark:bg-[#0077D4]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-[#D60000]/10 dark:bg-[#D60000]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-[500px] sm:h-[500px] bg-gradient-to-r from-[#0077D4]/5 via-[#8B3D8B]/5 to-[#D60000]/5 dark:from-[#0077D4]/3 dark:via-[#8B3D8B]/3 dark:to-[#D60000]/3 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Container with Glass Effect */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Single Premium Glass Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            {/* Header Section */}
            <div className="text-center mb-6 sm:mb-8">
              {/* Gradient Shield Icon */}
              <div className="relative mb-6 inline-flex">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#0077D4] to-[#D60000] rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#0077D4] to-[#D60000] opacity-20 animate-ping"></div>
              </div>
              
              {/* Secure Account Recovery Tag */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#0077D4]/10 to-[#D60000]/10 dark:from-[#0077D4]/20 dark:to-[#D60000]/20 rounded-full text-xs sm:text-sm font-semibold text-black dark:text-white mb-4 border border-[#0077D4]/20 dark:border-[#0077D4]/30">
                <Radio className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#0077D4]" />
                Secure Account Recovery
              </div>
              
              {/* Main Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white mb-3 sm:mb-4">
                {emailSent ? "Check Your Email" : "We'll Help You Recover"}
              </h1>
              
              {/* Description */}
              <p className="text-sm sm:text-base text-black/70 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">
                {emailSent 
                  ? "We've sent password reset instructions to your email address"
                  : "We'll help you regain access to your jewelry management account safely and securely"
                }
              </p>

              {/* Feature List - Only show when not email sent */}
              {!emailSent && (
                <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="flex items-center justify-center text-sm sm:text-base text-black/70 dark:text-gray-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#0077D4] to-[#0099FF] rounded-full mr-3"></div>
                    Secure Password Reset
                  </div>
                  <div className="flex items-center justify-center text-sm sm:text-base text-black/70 dark:text-gray-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#D60000] to-[#FF3333] rounded-full mr-3"></div>
                    Email Verification
                  </div>
                  <div className="flex items-center justify-center text-sm sm:text-base text-black/70 dark:text-gray-300">
                    <div className="w-2 h-2 bg-gradient-to-r from-[#0077D4] to-[#D60000] rounded-full mr-3"></div>
                    Account Protection
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-[#0077D4]" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 text-sm sm:text-base border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 text-black dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#0077D4] dark:focus:border-[#0077D4] focus:ring-2 focus:ring-[#0077D4]/20 dark:focus:ring-[#0077D4]/30 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-lg font-medium text-sm sm:text-base text-white bg-gradient-to-r from-[#0077D4] to-[#D60000] hover:from-[#0055AA] hover:to-[#AA0000] focus:outline-none focus:ring-2 focus:ring-[#0077D4]/30 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </form>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0077D4] to-[#D60000] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-2">
                    Email Sent Successfully
                  </h3>
                  <p className="text-sm sm:text-base text-black/70 dark:text-gray-300 mb-4">
                    We've sent password reset instructions to:
                  </p>
                  <p className="text-[#0077D4] dark:text-[#0077D4] font-medium text-sm sm:text-base break-all">
                    {email}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-lg font-medium text-sm sm:text-base border-2 border-[#0077D4] text-[#0077D4] hover:bg-[#0077D4]/10 dark:border-[#0077D4] dark:text-[#0077D4] dark:hover:bg-[#0077D4]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Resending..." : "Resend Email"}
                  </button>
                  
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="w-full py-3 sm:py-3.5 px-4 rounded-lg font-medium text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Use Different Email
                  </button>
                </div>
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="text-center">
                <p className="text-sm text-black/70 dark:text-gray-300">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-[#0077D4] hover:text-[#0055AA] dark:text-[#0077D4] dark:hover:text-[#0099FF] font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
              
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm text-black/60 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Toggle - bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ForgotPasswordPage;