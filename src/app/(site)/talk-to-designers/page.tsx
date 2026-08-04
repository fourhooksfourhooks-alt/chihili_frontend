"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const TalkToDesignersPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("consultation");
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    phone: "",
    consultationType: "",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    message: "",
    occasion: "",
    preferences: ""
  });

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const designers = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Lead Fashion Designer",
      specialization: "Traditional Odia Sarees & Lehengas",
      experience: "8+ years",
      image: "/profile.jpg",
      description: "Expert in handloom techniques and contemporary adaptations of traditional designs",
      expertise: ["Handloom Sarees", "Wedding Ensembles", "Festive Wear", "Custom Embroidery"]
    },
    {
      id: 2,
      name: "Anjali Das",
      title: "Contemporary Designer",
      specialization: "Fusion Wear & Modern Silhouettes",
      experience: "6+ years",
      image: "/profile.jpg",
      description: "Specializes in blending traditional crafts with modern fashion sensibilities",
      expertise: ["Fusion Wear", "Office Attire", "Party Dresses", "Casual Elegance"]
    },
    {
      id: 3,
      name: "Rahul Patel",
      title: "Artisan Specialist",
      specialization: "Traditional Crafts & Techniques",
      experience: "12+ years",
      image: "/profile.jpg",
      description: "Master craftsman with deep knowledge of Odia textile traditions",
      expertise: ["Ikat Weaving", "Applique Work", "Traditional Motifs", "Heritage Pieces"]
    }
  ];

  const consultationTypes = [
    {
      type: "Virtual Style Consultation",
      duration: "45 minutes",
      price: "₹1,500",
      description: "Video call consultation to discuss your style preferences and wardrobe needs",
      features: ["Personal style assessment", "Color analysis", "Wardrobe planning", "Product recommendations"]
    },
    {
      type: "Custom Design Consultation",
      duration: "60 minutes",
      price: "₹2,500",
      description: "In-depth consultation for custom outfit design and creation",
      features: ["Design concept development", "Fabric selection guidance", "Measurements consultation", "Timeline planning"]
    },
    {
      type: "Wedding Collection Planning",
      duration: "90 minutes",
      price: "₹5,000",
      description: "Comprehensive planning for your wedding wardrobe and trousseau",
      features: ["Complete wardrobe planning", "Multi-outfit coordination", "Family outfit suggestions", "Budget planning"]
    },
    {
      type: "Heritage Restoration Consultation",
      duration: "60 minutes",
      price: "₹3,000",
      description: "Expert advice on restoring and modernizing heirloom pieces",
      features: ["Condition assessment", "Restoration techniques", "Modernization options", "Care instructions"]
    }
  ];

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Consultation request submitted successfully! Our team will contact you within 24 hours.");
    setConsultationForm({
      name: "",
      email: "",
      phone: "",
      consultationType: "",
      preferredDate: "",
      preferredTime: "",
      budget: "",
      message: "",
      occasion: "",
      preferences: ""
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Talk to Our Designers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized style advice and custom design solutions from our expert team
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab("consultation")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "consultation"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Book Consultation
            </button>
            <button
              onClick={() => setActiveTab("designers")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "designers"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Meet Our Designers
            </button>
          </div>
        </div>

        {/* Consultation Tab */}
        {activeTab === "consultation" && (
          <div>
            {/* Consultation Types */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose Your Consultation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {consultationTypes.map((consultation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{consultation.type}</h3>
                      <div className="text-2xl font-bold text-primary mb-1">{consultation.price}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {consultation.duration}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{consultation.description}</p>
                    <ul className="space-y-2">
                      {consultation.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Consultation Form */}
            <div className="bg-secondary rounded-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Book Your Consultation</h2>
              <form onSubmit={handleConsultationSubmit} className="max-w-3xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={consultationForm.name}
                      onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={consultationForm.email}
                      onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={consultationForm.phone}
                      onChange={(e) => setConsultationForm({...consultationForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type *
                    </label>
                    <select
                      required
                      value={consultationForm.consultationType}
                      onChange={(e) => setConsultationForm({...consultationForm, consultationType: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Consultation Type</option>
                      {consultationTypes.map((type, index) => (
                        <option key={index} value={type.type}>{type.type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={consultationForm.preferredDate}
                      onChange={(e) => setConsultationForm({...consultationForm, preferredDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      required
                      value={consultationForm.preferredTime}
                      onChange={(e) => setConsultationForm({...consultationForm, preferredTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Time</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range
                    </label>
                    <select
                      value={consultationForm.budget}
                      onChange={(e) => setConsultationForm({...consultationForm, budget: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Budget</option>
                      <option value="Under ₹10,000">Under ₹10,000</option>
                      <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                      <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="Above ₹1,00,000">Above ₹1,00,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion
                    </label>
                    <select
                      value={consultationForm.occasion}
                      onChange={(e) => setConsultationForm({...consultationForm, occasion: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Occasion</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Festival">Festival</option>
                      <option value="Party">Party</option>
                      <option value="Office">Office Wear</option>
                      <option value="Casual">Casual Wear</option>
                      <option value="Special Event">Special Event</option>
                      <option value="Traditional Ceremony">Traditional Ceremony</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style Preferences & Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={consultationForm.preferences}
                    onChange={(e) => setConsultationForm({...consultationForm, preferences: e.target.value})}
                    placeholder="Tell us about your style preferences, color choices, specific requirements..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message
                  </label>
                  <textarea
                    rows={3}
                    value={consultationForm.message}
                    onChange={(e) => setConsultationForm({...consultationForm, message: e.target.value})}
                    placeholder="Any additional information or specific questions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Consultation
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Designers Tab */}
        {activeTab === "designers" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Expert Designers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {designers.map((designer) => (
                <div key={designer.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-64">
                    <Image
                      src={designer.image}
                      alt={designer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{designer.name}</h3>
                    <p className="text-primary font-medium mb-2">{designer.title}</p>
                    <p className="text-gray-600 text-sm mb-4">{designer.experience} • {designer.specialization}</p>
                    <p className="text-gray-600 mb-4">{designer.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise:</h4>
                      <div className="flex flex-wrap gap-2">
                        {designer.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActiveTab("consultation")}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalkToDesignersPage;