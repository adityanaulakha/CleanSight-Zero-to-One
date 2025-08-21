import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logoImage from '@/assets/Logo.png';
import logoImage2 from '@/assets/logo2.png';
import {
  Camera, MapPin, Trophy, Users, Recycle, Star, ArrowRight, CheckCircle,
  Globe, Smartphone, Award, TrendingUp, Heart, Shield, Zap, Play,
  ChevronDown, Sparkles, Target, BarChart3, Leaf, MessageSquare,
  Calendar, Clock, Verified, Building2, TrendingUp as TrendUp
} from 'lucide-react';

const LandingPageNew = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Auto-cycle testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Camera,
      title: "AI-Powered Detection",
      description: "Advanced computer vision instantly categorizes waste types with 99.2% accuracy",
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      stats: "99.2% accuracy"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Live dashboards show community impact and environmental progress metrics",
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
      stats: "Live updates"
    },
    {
      icon: Target,
      title: "Gamified Engagement",
      description: "Earn points, unlock achievements, and compete on leaderboards for impact",
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
      stats: "50+ rewards"
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with eco-warriors and participate in coordinated cleanup initiatives",
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
      stats: "150k+ users"
    }
  ];

  const stats = [
    { 
      number: "150K+", 
      label: "Waste Reports", 
      icon: Camera,
      description: "Community submissions",
      trend: "+23% monthly"
    },
    { 
      number: "89K+", 
      label: "Tons Diverted", 
      icon: Recycle,
      description: "From landfills",
      trend: "+31% quarterly"
    },
    { 
      number: "45K+", 
      label: "Active Citizens", 
      icon: Users,
      description: "Making impact",
      trend: "+12% weekly"
    },
    { 
      number: "5+", 
      label: "Cities Connected", 
      icon: Globe,
      description: "Growing network",
      trend: "Expanding fast"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Environmental Scientist",
      content: "CleanSight's AI accuracy and community engagement metrics are unprecedented in waste management technology.",
      rating: 5,
      avatar: "👩‍🔬",
      company: "IIT Delhi",
      verified: true
    },
    {
      name: "Rajesh Kumar",
      role: "City Planning Director",
      content: "40% improvement in waste reporting accuracy since implementing CleanSight across our municipality.",
      rating: 5,
      avatar: "👨‍💼",
      company: "Smart Cities Mission",
      verified: true
    },
    {
      name: "Maya Patel",
      role: "Community Leader",
      content: "Gamification doubled our cleanup participation. Our volunteers are more engaged than ever before.",
      rating: 5,
      avatar: "👩‍🌾",
      company: "EcoWarriors NGO",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 25, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-yellow-400/15 to-orange-500/15 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-6 py-3 text-sm font-medium shadow-xl">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered • Real-Time • Community-Driven
              </Badge>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.9]"
            >
              Transform Cities with{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Waste
                </span>
              </span>
              <br />
              <span className="text-gray-700">Management</span>
            </motion.h1>
            
            {/* Enhanced Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Join <span className="text-green-600 font-bold">150,000+</span> eco-warriors using AI-powered waste detection, 
              real-time community impact tracking, and gamified environmental action across <span className="text-blue-600 font-bold">5+ cities</span>.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                onClick={() => window.location.href = '/register'}
              >
                <Smartphone className="h-6 w-6 mr-3" />
                Start Your Impact Journey
                <ArrowRight className="h-6 w-6 ml-3" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-12 py-6 text-xl font-semibold border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 rounded-2xl backdrop-blur-sm bg-white/70"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="h-6 w-6 mr-3" />
                Explore Features
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg">
                <Award className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700">99.2% AI Accuracy</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg">
                <Globe className="h-8 w-8 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700">5+ Cities</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-lg">
                <Clock className="h-8 w-8 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">24/7 AI Assistant Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center cursor-pointer text-gray-600"
              onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="text-sm mb-2 font-medium">Discover Impact</span>
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Impact, Real Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our community is transforming waste management worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="h-10 w-10 text-green-500" />
                    <Badge variant="outline" className="text-xs font-medium">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Maximum Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets community action for unprecedented environmental results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`p-8 rounded-3xl ${feature.gradient} border border-white/50 shadow-xl`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {feature.title}
                        </h3>
                        <Badge className="bg-white/70 text-gray-700">
                          {feature.stats}
                        </Badge>
                      </div>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Leaders Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what environmental scientists, city planners, and community leaders say about CleanSight
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      {testimonial.verified && <Verified className="h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logoImage2} alt="CleanSight" className="w-44 w-10 object-contain" />
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Transforming waste management through AI-powered detection, 
                community engagement, and real-time impact tracking.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <div className="space-y-3 text-gray-400">
                <Link to="/register" className="block hover:text-white transition-colors">Get Started</Link>
                <Link to="/help" className="block hover:text-white transition-colors">Help Center</Link>
                <a href="#features" className="block hover:text-white transition-colors">Features</a>
                <a href="#stats" className="block hover:text-white transition-colors">Impact</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Connect</h4>
              <div className="space-y-3 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Community</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Support</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 CleanSight. Transforming cities, one report at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageNew;
