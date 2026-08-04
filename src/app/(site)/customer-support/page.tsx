"use client";

import { useState } from "react";
import { ChevronRight, MapPin, Phone, Mail } from "lucide-react";

export default function CustomerSupportPage() {
  const [openFaq, setOpenFaq] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const faqs = [
    {
      id: 0,
      question: "What is a Payment Gateway?",
      answer: "",
    },
    {
      id: 1,
      question:
        "Do I need to pay to Chihill even when there is no transaction going on in my business?",
      answer:
        "No, you do not need to pay Chihill where there is no transaction happening. With one of the lowest transaction charges in the industry, pay only when you get paid!",
    },
    {
      id: 2,
      question: "What platforms does Chihill payment gateway support?",
      answer: "",
    },
    {
      id: 3,
      question: "Does Chihill provide international payments support?",
      answer: "",
    },
    {
      id: 4,
      question:
        "Is there any setup fee or annual maintainance fee that I need to pay regularly?",
      answer: "",
    },
  ];

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Message sent successfully!");
  };

  return (
    <div className="min-h-screen font-lato">
      {/* Header Section */}
      <div className="text-center py-12 sm:py-16 lg:py-24 px-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8 sm:mb-10 lg:mb-12">
          How can we help?
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-0">
          <input
            type="text"
            placeholder="Search Returns, Orders, anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="bg-primary1 text-white px-6 py-3 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-primary1/90 transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-12 sm:mb-16 lg:mb-20">
          Frequently Asked Questions
        </h2>

        {/* Mobile/Tablet FAQ Layout */}
        <div className="lg:hidden space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className={`px-4 py-4 cursor-pointer transition-all ${
                  openFaq === faq.id ? "bg-secondary" : "bg-white"
                }`}
                onClick={() => setOpenFaq(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                        openFaq === faq.id ? "bg-primary" : "bg-primary/50"
                      }`}
                    ></div>
                    <span className="text-sm sm:text-base text-gray-800 font-medium">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                      openFaq === faq.id
                        ? "text-primary rotate-90"
                        : "text-primary/50"
                    }`}
                  />
                </div>
              </div>
              {openFaq === faq.id && (
                <div className="px-4 pb-4 bg-secondary">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed ml-6 sm:ml-7">
                    {faq.answer ||
                      "Click on a question to see the answer here."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop FAQ Layout */}
        <div className="hidden lg:flex items-center justify-end gap-8 min-h-[50vh] w-full relative">
          {/* FAQ List */}
          <div className="w-1/2 flex flex-col justify-center absolute left-20">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`px-4 py-6 cursor-pointer transition-all ${
                  openFaq === faq.id ? "bg-secondary" : "bg-white"
                }`}
                onClick={() => setOpenFaq(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        openFaq === faq.id ? "bg-primary" : "bg-primary/50"
                      }`}
                    ></div>
                    <span className="text-gray-800 font-medium">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 ${
                      openFaq === faq.id ? "text-primary" : "text-primary/50"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Answer Panel */}
          <div className="bg-secondary rounded-lg p-6 w-1/2 min-h-[50vh] flex flex-col justify-start">
            <div className="ml-20 mt-8">
              <h3 className="font-semibold text-gray-800 mb-4">
                {faqs[openFaq]?.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faqs[openFaq]?.answer ||
                  "Click on a question to see the answer here."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact and Get in Touch Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Us */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
              Contact Us
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10">
              Questions, comments, or suggestions? Simply fill in the form and
              we'll be in touch shortly.
            </p>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary1 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">
                    1055 Arthur ave Elk Groot, 67.
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    New Palmas South Carolina.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-800">
                  +1 234 678 9108 99
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm sm:text-base text-gray-800">
                  Contact@chihill.com
                </span>
              </div>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">
                  Customer Support
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Our support team is available around the clock to address any
                  concerns or queries you may have.
                </p>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">
                  Feedback and Suggestions
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  We value your feedback and are continuously working to improve
                  Chihill. Your input is crucial in shaping the future of
                  Chihill.
                </p>
              </div>
            </div>
          </div>

          {/* Get in Touch Form */}
          <div className="order-1 lg:order-2 bg-secondary p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">
              Get in Touch
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number*"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              />

              <textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm sm:text-base"
              ></textarea>

              <button
                onClick={handleSubmit}
                className="w-full bg-primary1 text-white py-2 sm:py-3 rounded-md hover:bg-primary transition-colors font-medium text-sm sm:text-base"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}