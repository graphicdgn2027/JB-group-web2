import React from "react";
import { ArrowRight } from "lucide-react";

const Careers = () => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-blue mb-12">Careers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80')" }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="font-bold text-lg mb-1">Life at Company</h3>
              <p className="text-sm text-gray-200">Discover our culture.</p>
            </div>
          </div>
          
          <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80')" }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="font-bold text-lg mb-1">Benefits</h3>
              <p className="text-sm text-gray-200">What we offer.</p>
            </div>
          </div>
          
          <div className="relative h-64 rounded-xl overflow-hidden group cursor-pointer md:col-span-2">
            <div className="absolute inset-0 bg-brand-blue" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center text-white">
              <div className="text-4xl font-black mb-2">1160+</div>
              <h3 className="text-xl font-bold mb-4">Open Positions</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm">
                Join our global team of innovators and make an impact. We are looking for talented individuals across all sectors.
              </p>
              <button className="bg-white text-brand-blue px-6 py-2 rounded-full font-bold text-sm self-start hover:bg-gray-200 transition">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
