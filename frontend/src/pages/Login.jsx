import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const { login, signup, loading = false, isAuthorised, theme } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthorised) navigate(from, { replace: true });
  }, [isAuthorised, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      if (isSignUp) {
        await signup(formData);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'url(/login-bg-dark.jpg)' 
            : 'url(/login-bg-light.jpg)',
        }}
      />
      
      {/* Soft overlay for better contrast */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-[2px]" />

      {/* Login Container with margins */}
      <div className="relative w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white dark:text-black text-2xl font-bold">C</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
            {isSignUp ? "Sign up to join Connectly" : "Sign in to continue"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            )}

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="glass-input w-full px-4 py-3 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />

            {/* Remember me & Forgot password */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-black dark:text-white bg-transparent"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3 rounded-xl font-medium hover:opacity-90 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                isSignUp ? "Sign Up" : "Log In"
              )}
            </Button>
          </form>

          {/* Toggle between login/signup */}
          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-black dark:text-white font-semibold hover:underline"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>

        {/* Terms */}
        <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-6">
          By continuing, you agree to our{" "}
          <button className="text-gray-900 dark:text-white hover:underline">Terms</button>
          {" "}and{" "}
          <button className="text-gray-900 dark:text-white hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  );
};

export default Login;