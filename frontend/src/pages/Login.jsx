import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Divider from "../components/ui/Divider";

/* ================= LOGIN ================= */
const Login = () => {
  const {
    login,
    signup,
    loading,
    isAuthorised,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  /* ---------- Redirect after successful auth ---------- */
  useEffect(() => {
    if (isAuthorised) {
      navigate("/", { replace: true });
    }
  }, [isAuthorised, navigate]);

  /* ---------- Input handling ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (isSignUp) {
      // ONLY send what backend expects
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
    } else {
      await login(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center">
          <img src="/connectly.svg" alt="Connectly" className="h-20 w-auto mb-6" />
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Connect with people who matter
          </h2>
          <p className="text-lg text-gray-600 max-w-md mb-10">
            Share moments, explore stories, and stay connected with your world.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">

            <h1 className="text-2xl font-bold text-center mb-1">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>

            <p className="text-gray-500 text-center mb-8">
              {isSignUp ? "Sign up to start sharing" : "Log in to continue"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <Input
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              )}

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                isLoading={loading}
              >
                {isSignUp ? "Sign up" : "Log in"}
              </Button>
            </form>

            <Divider label="OR" />

            <p className="mt-6 text-center text-gray-600">
              {isSignUp ? "Already have an account?" : "New to Connectly?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp((prev) => !prev)}
                className="text-blue-600 font-semibold hover:underline"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
