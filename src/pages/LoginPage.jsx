import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Gem, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
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
  const [showPassword, setShowPassword] = useState(false);
  
  // Get the page they tried to visit before being redirected to login
  const from = location.state?.from?.pathname || "/dashboard";
  
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "admin@jewelrystore.com",
      password: "",
    },
    mode: "onChange",
  });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Subtle multi-color background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/15 dark:from-blue-900/10 dark:to-cyan-900/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/15 dark:from-purple-900/10 dark:to-pink-900/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100/10 via-violet-100/10 to-fuchsia-100/10 dark:from-indigo-900/5 dark:via-violet-900/5 dark:to-fuchsia-900/5 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[420px] sm:max-w-[440px]">
          {/* Login Form Card */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-xl border border-gray-200/60 dark:border-gray-700/60">
            {/* Logo inside container */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/images/Sparkle ERP Logo.svg" 
                  alt="Sparkle ERP Logo" 
                  className="h-10 sm:h-12 w-auto"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-normal">
                Sign in to your account
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-gray-400 dark:text-gray-500" />
                  </div>
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
                      <input
                        type="email"
                        className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-2.5 md:py-3 text-[13px] sm:text-sm md:text-[15px] border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                        placeholder="admin@jewelrystore.com"
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs sm:text-[12px] text-red-500 dark:text-red-400 font-normal">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-gray-400 dark:text-gray-500" />
                  </div>
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
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-2.5 md:py-3 text-[13px] sm:text-sm md:text-[15px] border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                        placeholder="••••••••"
                        {...field}
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs sm:text-[12px] text-red-500 dark:text-red-400 font-normal">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 focus:ring-offset-0 cursor-pointer transition-colors"
                  />
                  <span className="ml-2 text-xs sm:text-[13px] text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors font-normal">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs sm:text-[13px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button - Zoho style */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 md:py-3.5 px-4 rounded-lg font-medium text-xs sm:text-sm md:text-[15px] text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Get started link */}
            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 font-normal">
                Don't have an account?{" "}
                <Link
                  to="/onboarding"
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Get started
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-5 sm:mt-6 pt-5 border-t border-gray-200/80 dark:border-gray-700/80 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-xs sm:text-[13px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-normal"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Back to Home
              </Link>
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

export default LoginPage;
