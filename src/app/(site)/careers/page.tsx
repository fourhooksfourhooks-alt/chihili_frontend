"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, MapPin, Clock, Users, Heart, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const CareersPage = () => {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null
  });

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const jobOpenings = [
    {
      id: 1,
      title: "Fashion Designer",
      department: "Design",
      location: "Bhubaneswar, Odisha",
      type: "Full-time",
      experience: "2-4 years",
      description: "We're looking for a creative fashion designer with expertise in traditional Indian textiles and modern design aesthetics.",
      requirements: [
        "Bachelor's degree in Fashion Design or related field",
        "2-4 years of experience in fashion design",
        "Strong knowledge of traditional Indian textiles",
        "Proficiency in design software (Adobe Creative Suite, CLO 3D)",
        "Understanding of garment construction and production processes"
      ],
      responsibilities: [
        "Create innovative designs blending traditional and contemporary styles",
        "Develop seasonal collections and product lines",
        "Collaborate with artisans and production teams",
        "Research fashion trends and customer preferences",
        "Oversee design development from concept to production"
      ]
    },
    {
      id: 2,
      title: "Artisan Coordinator",
      department: "Production",
      location: "Remote/Field Work",
      type: "Full-time",
      experience: "1-3 years",
      description: "Join our team to work directly with skilled artisans across Odisha, ensuring quality and preserving traditional techniques.",
      requirements: [
        "Experience working with artisan communities",
        "Knowledge of traditional textile techniques",
        "Strong communication skills in Odia and English",
        "Willingness to travel frequently",
        "Bachelor's degree preferred"
      ],
      responsibilities: [
        "Coordinate with artisan groups for production",
        "Ensure quality standards and timely delivery",
        "Provide training on new techniques and designs",
        "Document traditional crafting processes",
        "Support artisan welfare programs"
      ]
    },
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: "Health & Wellness",
      description: "Comprehensive medical insurance and wellness programs"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Work-Life Balance",
      description: "Flexible working hours and remote work options"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Team Culture",
      description: "Collaborative environment celebrating creativity and diversity"
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Growth Opportunities",
      description: "Career development programs and skill enhancement workshops"
    }
  ];

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("Application submitted successfully! We'll get back to you soon.");
    setApplicationForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      coverLetter: "",
      resume: null
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of our mission to preserve and promote Odia heritage through fashion
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Why Work With Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Work With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-50">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Current Openings</h2>
          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.experience}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{job.description}</p>
                    </div>
                    <div className="lg:ml-6">
                      <button
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                        className="bg-secondary1 text-black px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        {selectedJob === job.id ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                  
                  {selectedJob === job.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-600">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Responsibilities</h4>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-gray-600">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-secondary rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Apply Now</h2>
          <form onSubmit={handleApplicationSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicationForm.name}
                  onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
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
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
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
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Applied For *
                </label>
                <select
                  required
                  value={applicationForm.position}
                  onChange={(e) => setApplicationForm({...applicationForm, position: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Position</option>
                  {jobOpenings.map((job) => (
                    <option key={job.id} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience *
              </label>
              <select
                required
                value={applicationForm.experience}
                onChange={(e) => setApplicationForm({...applicationForm, experience: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                required
                rows={6}
                value={applicationForm.coverLetter}
                onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                placeholder="Tell us why you'd be a great fit for this role..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume *
              </label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplicationForm({...applicationForm, resume: e.target.files?.[0] || null})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Please upload PDF, DOC, or DOCX files only</p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;