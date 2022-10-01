import React from 'react';
import { Outlet } from 'react-router-dom';
import Unlock from './AuthImage/unlock.svg';

export const Auth = () => {
  return (
    <section className="h-screen">
      <div className="container px-6 py-12 h-full">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
            <img src={Unlock} className="w-full" alt="Phone image" />
          </div>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Auth;
