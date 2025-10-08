import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Gem, ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import ThemeToggle from "../components/ui/ThemeToggle";
import { ToastContainer } from "../components/ui/Toast";
import useToast from "../hooks/useToast";
import { loginUser } from "../utils/api";
import { loginStart, loginSuccess, loginFailure } from "../store/slices/authSlice";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { toasts, error, success, removeToast } = useToast();
  const { isLoading } = useAuth();
  
  // Get the page they tried to visit before being redirected to login
  const from = location.state?.from?.pathname || "/dashboard";
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validate on change
  });

  // Debug: Watch form values
  const watchedValues = watch();
  console.log("Form values:", watchedValues);
  console.log("Form errors:", errors);

  const onSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    
    // Dispatch login start action
    dispatch(loginStart());

    try {
      // Simple API call using utility function
      const result = await loginUser({
        email: data.email,
        password: data.password,
      });
      console.log("Login result:", result);

      // Check if login was successful (has token) or failed (has message)
      if (result.token) {
        // Success - dispatch login success action with all data
        dispatch(loginSuccess({
          token: result.token,
          user: result.user,
          expiresAt: result.expiresAt
        }));
        
        // Store data in localStorage for persistence
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        localStorage.setItem("tokenExpiry", result.expiresAt);
        
        success("Login successful");
        setTimeout(() => {
           // Redirect to the page they tried to visit or dashboard
           navigate(from, { replace: true });
        }, 1000);
      } else {
        // Handle login failure
        dispatch(loginFailure(result.message || "Login failed"));
        error(result.message || "Login failed");
      }
    } catch (err) {
      console.log(err.message);
      dispatch(loginFailure(err.message));
      error(err.message); 
      // Handle different types of errors
    } 
  };

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

      {/* Two-column layout for large screens */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Jewelry Image (hidden on mobile) */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-8">
          <div className="relative w-full h-full max-w-lg">
            {/* Enhanced animated background elements for light mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-primary-900 dark:to-gold-900 rounded-3xl transform rotate-3 animate-pulse-slow shadow-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-100 via-yellow-50 to-orange-100 dark:from-gold-800 dark:to-amber-800 rounded-3xl transform -rotate-2 animate-float shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:to-cyan-900 rounded-3xl transform rotate-1 animate-pulse-slow opacity-60 shadow-md"></div>
            
            {/* Enhanced floating decorative elements */}
            <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 dark:from-primary-700 dark:to-indigo-800 rounded-full animate-bounce-gentle opacity-70 shadow-lg"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-gold-600 dark:to-amber-700 rounded-full animate-bounce-gentle opacity-80 shadow-lg" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-accent-600 dark:to-pink-700 rounded-full animate-bounce-gentle opacity-60 shadow-lg" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 right-8 w-5 h-5 bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-600 dark:to-teal-700 rounded-full animate-bounce-gentle opacity-50 shadow-md" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Enhanced main card with better light mode contrast */}
            <div className="relative bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-white/40 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10">
              <div className="text-center">
                {/* Enhanced animated gem icon */}
                <div className="relative mb-6">
                  <div className="relative">
                    <Gem className="w-24 h-24 text-primary-600 dark:text-primary-400 mx-auto drop-shadow-2xl" />
                    <div className="absolute inset-0 w-24 h-24 mx-auto">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-200 to-blue-200 dark:from-primary-800 dark:to-blue-800 animate-ping opacity-30"></div>
                    </div>
                    <div className="absolute inset-0 w-24 h-24 mx-auto">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent mb-4 animate-fade-in-up">
                  Premium Jewelry Management
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 animate-fade-in-up text-lg" style={{ animationDelay: '0.2s' }}>
                  Streamline your jewelry business with our advanced RFID tracking system
                </p>
                
                {/* Enhanced animated feature list */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-700 dark:text-gray-300 animate-fade-in-up bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm" style={{ animationDelay: '0.4s' }}>
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                    <span className="font-medium">Inventory Tracking</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 animate-fade-in-up bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm" style={{ animationDelay: '0.5s' }}>
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                    <span className="font-medium">Sales Analytics</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 animate-fade-in-up bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm" style={{ animationDelay: '0.6s' }}>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                    <span className="font-medium">Customer Management</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 animate-fade-in-up bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm" style={{ animationDelay: '0.7s' }}>
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mr-3 animate-pulse shadow-sm"></div>
                    <span className="font-medium">Reports & Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <Gem className="w-10 h-10 text-primary-600 dark:text-primary-400 drop-shadow-lg" />
              <div className="absolute inset-0 w-10 h-10">
                <div className="w-full h-full rounded-full bg-primary-200 dark:bg-primary-800 animate-ping opacity-20"></div>
              </div>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 dark:from-primary-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-elegant">
              JewelRFID
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Sign in to your jewelry management account
          </p>
        </div>

        {/* Enhanced Login Form */}
        <Card className="shadow-2xl border-2 border-white/20 dark:border-gray-700/50 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is invalid",
                },
              }}
              render={({ field }) => (
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                      icon={Mail}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
              render={({ field }) => (
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  error={errors.password?.message}
                      icon={Lock}
                  {...field}
                />
              )}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/onboarding"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Get started
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

export default LoginPage;
