import React from "react";
import { Download, FileText, BarChart, TrendingUp } from "lucide-react";

const InvestorRelations = () => {
  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-blue mb-12">Investor Relations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition flex flex-col items-center text-center cursor-pointer group">
            <FileText size={32} className="text-brand-red mb-4 group-hover:scale-110 transition" />
            <h3 className="font-bold text-brand-blue mb-2">Annual Reports</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">Comprehensive overview of yearly performance.</p>
            <button className="text-brand-red group-hover:text-blue-800 transition"><Download size={20} /></button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition flex flex-col items-center text-center cursor-pointer group">
            <BarChart size={32} className="text-brand-red mb-4 group-hover:scale-110 transition" />
            <h3 className="font-bold text-brand-blue mb-2">Financial Statements</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">Detailed financial data and disclosures.</p>
            <button className="text-brand-red group-hover:text-blue-800 transition"><Download size={20} /></button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition flex flex-col items-center text-center cursor-pointer group">
            <TrendingUp size={32} className="text-brand-red mb-4 group-hover:scale-110 transition" />
            <h3 className="font-bold text-brand-blue mb-2">Stock Information</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">Real-time stock data and historical charts.</p>
            <button className="text-brand-red group-hover:text-blue-800 transition"><Download size={20} /></button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition flex flex-col items-center text-center cursor-pointer group">
            <FileText size={32} className="text-brand-red mb-4 group-hover:scale-110 transition" />
            <h3 className="font-bold text-brand-blue mb-2">Quarterly Results</h3>
            <p className="text-sm text-gray-500 mb-4 flex-1">Earnings releases and presentations.</p>
            <button className="text-brand-red group-hover:text-blue-800 transition"><Download size={20} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestorRelations;
