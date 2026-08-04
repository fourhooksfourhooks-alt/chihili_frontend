import React from "react";

export default function HelpCenter() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            Contact Support
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Get help with your orders and account
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Contact Us →
          </button>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">FAQ</h3>
          <p className="text-gray-600 text-sm mb-4">
            Find answers to common questions
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View FAQ →
          </button>
        </div>
      </div>
    </div>
  );
}
