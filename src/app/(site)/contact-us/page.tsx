"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Headphones,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

const ContactUsPage = () => {
  const router = useRouter();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    orderNumber: "",
    message: ""
  });

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8 text-primary" />,
      title: "Call Us",
      description: "Speak with our customer service team",
      contact: "+91 98765 43210",
      availability: "Mon-Sat, 9 AM - 7 PM",
      action: "tel:+919876543210"
    },
    {
      icon: <Mail className="w-8 h-8 text-primary" />,
      title: "Email Us",
      description: "Send us your queries and feedback",
      contact: "hello@chihili.com",
      availability: "24/7 Response within 24 hours",
      action: "mailto:hello@chihili.com"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-primary" />,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      availability: "Mon-Sat, 10 AM - 6 PM",
      action: "#"
    },
    {
      icon: <Headphones className="w-8 h-8 text-primary" />,
      title: "WhatsApp Support",
      description: "Quick support via WhatsApp",
      contact: "+91 98765 43210",
      availability: "Mon-Sat, 9 AM - 7 PM",
      action: "https://wa.me/919876543210"
    }
  ];

  const officeLocations = [
    {
      title: "Warehouse & Production",
      address: "789, Industrial Area, Mancheswar, Bhubaneswar, Odisha 751010",
      phone: "+91 98765 43212",
      email: "production@chihili.com",
      hours: "Monday - Saturday: 8:00 AM - 6:00 PM"
    }
  ];

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items with original tags. Custom orders are non-returnable unless there's a manufacturing defect."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days. Custom orders may take 2-4 weeks depending on complexity."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. International shipping takes 7-14 business days. Additional customs duties may apply based on your country's regulations."
    },
    {
      question: "Can I track my order?",
      answer: "Yes, once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order on our website or the courier's website."
    },
    {
      question: "Do you offer custom sizing?",
      answer: "Yes, we offer custom sizing for most of our products. Please provide your measurements during checkout or contact our design team for assistance."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Thank you for contacting us! We'll get back to you within 24 hours.");
    setContactForm({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      orderNumber: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBack}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're here to help! Reach out to us for any questions, concerns, or feedback
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {method.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <a
                  href={method.action}
                  className="text-primary font-medium hover:underline block mb-2"
                >
                  {method.contact}
                </a>
                <p className="text-xs text-gray-500">{method.availability}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={contactForm.category}
                    onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Custom Design">Custom Design</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                    <option value="Media & Press">Media & Press</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number (if applicable)
                  </label>
                  <input
                    type="text"
                    value={contactForm.orderNumber}
                    onChange={(e) => setContactForm({...contactForm, orderNumber: e.target.value})}
                    placeholder="CHI-2024-XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Please describe your inquiry in detail..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary1 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-secondary1 text-black py-3 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Office Locations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visit Our Offices</h2>
            <div className="space-y-6">
              {officeLocations.map((location, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{location.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{location.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary mr-3" />
                      <a href={`tel:${location.phone}`} className="text-gray-600 hover:text-primary">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary mr-3" />
                      <a href={`mailto:${location.email}`} className="text-gray-600 hover:text-primary">
                        {location.email}
                      </a>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 whitespace-pre-line">{location.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                    <FileText className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 ml-8">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Find Us</h2>
          <p className="text-gray-600 mb-6">Our main office is located in the heart of Bhubaneswar</p>
          <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Interactive map coming soon</p>
              <p className="text-sm text-gray-400 mt-2">
                123, Fashion Street, Saheed Nagar, Bhubaneswar, Odisha 751007
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;