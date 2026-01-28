import React from 'react';
import { ROIData } from '../../types/dashboard.types';

interface ROICalculatorProps {
  data: ROIData;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ data }) => {
  const roi = ((data.results.revenue - data.campaignCosts.totalCost) / data.campaignCosts.totalCost) * 100;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">ROI Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">${data.campaignCosts.totalCost.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">${data.results.revenue.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">ROI</p>
            <p className="text-2xl font-bold text-blue-800">{roi.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
