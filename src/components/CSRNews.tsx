import React from "react";
import { ArrowRight } from "lucide-react";

const CSRNews = () => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-blue mb-12">CSR Storytelling</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Large Story */}
          <div className="md:col-span-2 group cursor-pointer">
            <div className="relative h-80 rounded-2xl overflow-hidden mb-6">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593113565694-c74b4344837a?w=1000&q=80')" }}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
            <div className="flex gap-4 items-center mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Community</span>
              <span className="text-sm text-gray-500">October 12, 2024</span>
            </div>
            <h3 className="text-2xl font-bold text-brand-blue mb-3 group-hover:text-brand-red transition">
              Empowering Local Communities through Education Initiatives
            </h3>
            <p className="text-gray-600 mb-4 max-w-2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <button className="text-sm font-bold text-brand-red flex items-center gap-2 group-hover:gap-3 transition-all">
              Read More <ArrowRight size={16} />
            </button>
          </div>

          {/* Smaller Stories Column */}
          <div className="flex flex-col gap-8">
            <div className="group cursor-pointer">
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80')" }}
                />
              </div>
              <div className="flex gap-4 items-center mb-2">
                <span className="text-xs text-gray-500">September 28, 2024</span>
              </div>
              <h4 className="text-lg font-bold text-brand-blue mb-2 group-hover:text-brand-red transition">
                Digital Transformation in our supply chain
              </h4>
              <button className="text-xs font-bold text-brand-red flex items-center gap-1">Read More</button>
            </div>
            
            <div className="group cursor-pointer">
              <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80')" }}
                />
              </div>
              <div className="flex gap-4 items-center mb-2">
                <span className="text-xs text-gray-500">September 15, 2024</span>
              </div>
              <h4 className="text-lg font-bold text-brand-blue mb-2 group-hover:text-brand-red transition">
                Smart Manufacturing reducing carbon footprint
              </h4>
              <button className="text-xs font-bold text-brand-red flex items-center gap-1">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CSRNews;
