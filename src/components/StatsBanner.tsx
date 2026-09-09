import React from "react";
import { User, Building, Landmark, Users, Globe } from "lucide-react";

const StatsBanner = () => {
  return (
    <section className="w-full bg-white border-b py-6 hidden md:block relative z-20 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center text-brand-blue divide-x divide-gray-200">
          
          <div className="flex items-center gap-3 px-4 flex-1 justify-center">
            <User size={24} className="text-gray-400" />
            <div>
              <span className="font-bold text-xl block">60 Years</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Trust</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 flex-1 justify-center">
            <Building size={24} className="text-gray-400" />
            <div>
              <span className="font-bold text-xl block">120 Companies</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 flex-1 justify-center">
            <Landmark size={24} className="text-gray-400" />
            <div>
              <span className="font-bold text-xl block">30 Brands</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 flex-1 justify-center">
            <Users size={24} className="text-gray-400" />
            <div>
              <span className="font-bold text-xl block">5000 Employees</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 flex-1 justify-center">
            <Globe size={24} className="text-gray-400" />
            <div>
              <span className="font-bold text-xl block">25 Countries</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
