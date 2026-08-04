'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CustomSizeModalProps {
  onClose: () => void;
}

const CustomSizeModal: React.FC<CustomSizeModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('I know my measurements');
  const [unit, setUnit] = useState('inches');
  const [measurements, setMeasurements] = useState({
    shoulder: '',
    bust: '',
    underBust: '',
    armhole: '',
    sleeveLength: '',
    bicep: '',
    elbow: '',
    wrist: '',
    waist: '',
    lowerWaist: '',
    topLength: '',
    bottomLength: '',
    kurtaLength: '',
    frontNeckDepth: '',
    backNeckDepth: '',
    crotchLength: '',
    thighCircumference: '',
    kneeCircumference: '',
    calfCircumference: '',
    ankleCircumference: ''
  });

  const tabs = ['I know my measurements', 'I don\'t know my measurements', 'How to measure'];

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const measurementFields = [
    { key: 'shoulder', label: 'Shoulder' },
    { key: 'bust', label: 'Bust' },
    { key: 'underBust', label: 'Under Bust' },
    { key: 'armhole', label: 'Armhole' },
    { key: 'sleeveLength', label: 'Sleeve Length' },
    { key: 'bicep', label: 'Bicep' },
    { key: 'elbow', label: 'Elbow' },
    { key: 'wrist', label: 'Wrist' },
    { key: 'waist', label: 'Waist' },
    { key: 'lowerWaist', label: 'Lower Waist' },
    { key: 'topLength', label: 'Top Length' },
    { key: 'bottomLength', label: 'Bottom Length (with heels)' },
    { key: 'kurtaLength', label: 'Kurta Length (with heels)' },
    { key: 'frontNeckDepth', label: 'Front Neck Depth' },
    { key: 'backNeckDepth', label: 'Back Neck Depth' },
    { key: 'crotchLength', label: 'Crotch Length' },
    { key: 'thighCircumference', label: 'Thigh Circumference' },
    { key: 'kneeCircumference', label: 'Knee Circumference' },
    { key: 'calfCircumference', label: 'Calf Circumference' },
    { key: 'ankleCircumference', label: 'Ankle Circumference' }
  ];

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
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
        className="relative bg-white rounded-lg shadow-2xl max-w-7xl w-full h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
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

        {/* Modal content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
          {activeTab === 'I know my measurements' && (
            <div className="space-y-6 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Enter Your Measurements</h2>
                
                {/* Unit selector */}
                <div className="flex gap-4 items-center">
                  <span className="text-gray-700 font-medium">Choose units</span>
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
                {/* Measurement inputs */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
                  {measurementFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <input
                        type="number"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        value={measurements[field.key as keyof typeof measurements]}
                        onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>

                {/* Body diagrams */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Measurement Guide</h3>
                    <div className="flex-1 space-y-4">
                      <div className="bg-white rounded-lg p-2 flex-1 flex items-center justify-center">
                        <img
                          src="/Measuring/frontimg.jpg"
                          alt="Front view measurements"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="bg-white rounded-lg p-2 flex-1 flex items-center justify-center">
                        <img
                          src="/Measuring/backimg.jpg"
                          alt="Back view measurements"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "I don't know my measurements" && (
            <div className="space-y-8 h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter Contact Details</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-300 rounded-md p-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-3 py-2 border-0 outline-none placeholder-gray-400 focus:ring-0 bg-transparent text-base"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Mobile Number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Special Request"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 text-base"
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#7B0C14] text-white text-base font-medium rounded-none shadow-none border-0"
                  >
                    Submit Details
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'How to measure' && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">How to Measure</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">Measurement Tips</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium">1</span>
                      <p>Wear well-fitting undergarments while taking measurements</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                      <p>Keep the measuring tape parallel to the floor</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium">3</span>
                      <p>Don't pull the tape too tight - it should be snug but comfortable</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium">4</span>
                      <p>Ask someone to help you for more accurate measurements</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-medium">5</span>
                      <p>Stand straight and breathe normally while measuring</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <video
                    className="w-full h-full min-h-[300px]"
                    controls
                    preload="metadata"
                  >
                    <source src="/video/measurement.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Save Measurements
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomSizeModal;
