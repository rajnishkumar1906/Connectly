import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login = () => {
  const { login, signup, loading = false, isAuthorised } = useContext(AppContext);
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black text-2xl font-bold">C</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {isSignUp ? "Join Connectly" : "Welcome back"}
          </h1>

          <p className="text-gray-400 text-center mb-6">
            {isSignUp ? "Create your account" : "Sign in to continue"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <Input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className='bg-white text-gray-900 placeholder-gray-400'
              />
            )}

            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className='text-black-900'
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* FIXED BUTTON */}
            <Button
              type="submit"
              className="w-full bg-white !text-black py-2 rounded-lg hover:bg-gray-200"
              disabled={loading}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white font-semibold hover:underline"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
