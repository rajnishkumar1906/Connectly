import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white">
      <div className="animate-bounce mb-4">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-black">C</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Connectly</h1>
      <div className="mt-6 w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-pulse w-1/2 rounded-full"></div>
      </div>
    </div>
  );
};

export default SplashScreen;