import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";

const Login = () => {
  const { login, signup, loading, error } = useContext(AppContext);

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await signup(formData);
        setIsSignUp(false);
      } else {
        await login(formData.email, formData.password);
      }
    } catch (err) {
      console.error(err);
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
            Share moments, explore stories, and stay connected with your world — all in one place.
          </p>

          <div className="space-y-6">
            <Feature icon="📸" title="Share Moments" desc="Post photos and videos instantly" />
            <Feature icon="💬" title="Real-time Chat" desc="Message friends without delays" />
            <Feature icon="✨" title="Discover Content" desc="See what’s trending today" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-10">

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
              {isSignUp ? "Create account" : "Welcome back"}
            </h1>

            <p className="text-gray-500 text-center mb-8">
              {isSignUp
                ? "Sign up to start sharing moments"
                : "Log in to continue to Connectly"}
            </p>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                  <Input name="firstname" placeholder="First name" value={formData.firstname} onChange={handleChange} />
                  <Input name="lastname" placeholder="Last name" value={formData.lastname} onChange={handleChange} />
                </>
              )}

              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
              </button>
            </form>

            <Divider />

            <p className="mt-6 text-center text-gray-600">
              {isSignUp ? "Already have an account?" : "New to Connectly?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
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

const Input = (props) => (
  <input
    {...props}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
    required
  />
);

const Feature = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  </div>
);

const Divider = () => (
  <div className="my-6 relative">
    <div className="border-t border-gray-300"></div>
    <span className="absolute inset-x-0 -top-3 mx-auto w-12 bg-white text-center text-xs text-gray-500">
      OR
    </span>
  </div>
);

export default Login;
