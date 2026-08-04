"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Users, Target, Eye, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const AboutUsPage = () => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "Founder & CEO",
      image: "/profile.jpg",
      description: "Passionate about preserving Odia heritage through fashion"
    },
    {
      name: "Rahul Patel",
      role: "Creative Director",
      image: "/profile.jpg",
      description: "Expert in traditional Odia textiles and modern design"
    },
    {
      name: "Anjali Das",
      role: "Head of Design",
      image: "/profile.jpg",
      description: "Specializes in contemporary interpretations of classic styles"
    },
    {
      name: "Suresh Kumar",
      role: "Quality Manager",
      image: "/profile.jpg",
      description: "Ensures every piece meets our high standards"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Heritage Preservation",
      description: "We are committed to preserving and promoting the rich cultural heritage of Odisha through our designs."
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Community Support",
      description: "We work closely with local artisans and craftspeople to support traditional textile communities."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards in fabric quality, craftsmanship, and customer service."
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: "Innovation",
      description: "We blend traditional techniques with modern design sensibilities to create timeless pieces."
    }
  ];

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Chihili</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Celebrating the rich heritage of Odia fashion while embracing modern elegance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Chihili was born from a deep love for Odia culture and a vision to bring traditional
                craftsmanship to the modern world. Founded in 2020, we started as a small initiative
                to preserve and promote the beautiful textile traditions of Odisha.
              </p>
              <p>
                Our journey began when our founder, inspired by her grandmother's handwoven sarees,
                realized the need to create a bridge between traditional artisans and contemporary
                fashion enthusiasts. Today, we work with over 200 skilled artisans across Odisha.
              </p>
              <p>
                Every piece in our collection tells a story - of ancient techniques passed down through
                generations, of skilled hands that weave dreams into fabric, and of a culture that
                continues to thrive in the modern world.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/saree_mix.jpg"
              alt="Traditional Odia textiles"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-secondary p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              To preserve and promote Odia textile heritage by creating beautiful, high-quality
              fashion pieces that honor traditional craftsmanship while meeting contemporary
              style needs. We aim to provide sustainable livelihoods to artisan communities
              and make Odia fashion accessible to the world.
            </p>
          </div>
          <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-8 rounded-lg">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-primary mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-gray-600">
              To become the leading platform for authentic Odia fashion globally, where traditional
              artistry meets modern elegance. We envision a future where Odia textiles are celebrated
              worldwide, and every purchase contributes to preserving our rich cultural heritage.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* Statistics */}
        <div className="bg-secondary rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-600">Skilled Artisans</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Unique Designs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4+</div>
              <div className="text-gray-600">Years of Heritage</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Journey</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of our mission to preserve Odia heritage. Explore our collection and discover
            the beauty of traditional craftsmanship reimagined for the modern world.
          </p>
          <button
            onClick={() => router.push('/categoryPage')}
            className="bg-secondary1 text-black px-8 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            Explore Our Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;