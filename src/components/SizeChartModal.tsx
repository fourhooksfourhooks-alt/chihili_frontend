'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SizeChartModalProps {
  onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('Size Chart');
  const [unit, setUnit] = useState('inches');

  const tabs = ['Size Chart', 'Measuring Guide', 'How to measure'];

  const sizeData = [
    { size: 'XXS', uk: '2', bust: '30', waist: '24', hip: '35' },
    { size: 'XS', uk: '4', bust: '32', waist: '26', hip: '36' },
    { size: 'S', uk: '6', bust: '34', waist: '28', hip: '38' },
    { size: 'M', uk: '8', bust: '36', waist: '30', hip: '40' },
    { size: 'L', uk: '10', bust: '38', waist: '32', hip: '42' },
    { size: 'XL', uk: '12', bust: '40', waist: '34', hip: '44' },
    { size: 'XXL', uk: '14', bust: '42', waist: '36', hip: '46' },
  ];

  const convertToCm = (inches: number) => Math.round(inches * 2.54);

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      {/* Close button outside modal */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 p-2 bg-white rounded-full shadow-lg text-gray-400 hover:text-gray-600 transition-colors z-50 border border-gray-200"
        style={{ position: 'fixed' }}
      >
        <X size={24} />
      </button>
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-5xl w-full h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking inside modal
      >
        {/* Header with tabs */}
        <div className="border-b border-gray-200 flex flex-col sm:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

  {/* ...close button moved outside modal... */}

        {/* Modal content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'Size Chart' && (
            <div className="space-y-6 h-full">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Size Chart</h2>

              {/* Unit selector */}
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value="inches"
                    checked={unit === 'inches'}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-gray-700">inches</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="unit"
                    value="cms"
                    checked={unit === 'cms'}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-gray-700">cms</span>
                </label>
              </div>

              {/* Responsive table */}
              <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Size</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">UK</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Bust</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Waist</th>
                      <th className="text-left py-2 px-4 font-medium text-gray-700">Hip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr key={row.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-4 font-medium text-gray-800">{row.size}</td>
                        <td className="py-2 px-4 text-gray-700">{row.uk}</td>
                        <td className="py-2 px-4 text-gray-700">
                          {unit === 'inches' ? row.bust : convertToCm(parseInt(row.bust))}
                        </td>
                        <td className="py-2 px-4 text-gray-700">
                          {unit === 'inches' ? row.waist : convertToCm(parseInt(row.waist))}
                        </td>
                        <td className="py-2 px-4 text-gray-700">
                          {unit === 'inches' ? row.hip : convertToCm(parseInt(row.hip))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Measuring Guide' && (
            <div className="space-y-6 h-full">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Measuring Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100%-4rem)]">
                <div className="flex flex-col">
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src="/Measuring/frontimg.jpg"
                      alt="Front view"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600 mt-2">
                    Front view measurement points
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src="/Measuring/backimg.jpg"
                      alt="Back view"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-600 mt-2">
                    Back view measurement points
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'How to measure' && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">How to Measure</h2>
              <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="How to Take Body Measurements"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeChartModal;
