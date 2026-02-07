import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="animate-bounce mb-4">
        {/* You can replace this with your actual Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
           <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
             C
           </span>
        </div>
      </div>
      <h1 className="text-3xl font-bold tracking-wider animate-pulse">Connectly</h1>
      <p className="text-blue-100 mt-2 text-sm font-medium tracking-widest uppercase">Connecting People</p>
      
      {/* Loading bar */}
      <div className="mt-8 w-48 h-1 bg-blue-400/30 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-loading-bar w-1/2 rounded-full"></div>
      </div>
    </div>
  );
};

export default SplashScreen;
