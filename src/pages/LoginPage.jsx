import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const dispatch = useDispatch();
  const { toasts, error, success, removeToast } = useToast();
  const { isLoading } = useAuth();
  
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
           navigate("/dashboard");
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-primary-900 dark:to-gold-900 rounded-3xl transform rotate-3 animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-100 via-amber-50 to-yellow-100 dark:from-gold-800 dark:to-amber-800 rounded-3xl transform -rotate-2 animate-float"></div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-primary-200 dark:bg-primary-700 rounded-full animate-bounce-gentle opacity-60"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-gold-300 dark:bg-gold-600 rounded-full animate-bounce-gentle opacity-70" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-4 w-4 h-4 bg-accent-300 dark:bg-accent-600 rounded-full animate-bounce-gentle opacity-50" style={{ animationDelay: '2s' }}></div>
            
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
                  Premium Jewelry Management
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Streamline your jewelry business with our advanced RFID tracking system
                </p>
                
                {/* Animated feature list */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></div>
                    Inventory Tracking
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    <div className="w-2 h-2 bg-gold-500 rounded-full mr-2 animate-pulse"></div>
                    Sales Analytics
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-accent-500 rounded-full mr-2 animate-pulse"></div>
                    Customer Management
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    <div className="w-2 h-2 bg-secondary-500 rounded-full mr-2 animate-pulse"></div>
                    Reports & Insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
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
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to your jewelry management account
          </p>
        </div>

        {/* Login Form */}
        <Card>
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
