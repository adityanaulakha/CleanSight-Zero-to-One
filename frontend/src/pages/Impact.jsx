import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Recycle,
  Users,
  Globe,
  TrendingUp,
  Award,
  MapPin,
  Calendar,
  Target,
  Leaf,
  Droplets,
  Wind,
  Sun,
  ArrowRight
} from 'lucide-react';

const Impact = () => {
  const globalStats = [
    {
      icon: Recycle,
      number: "125,000",
      unit: "Tons",
      label: "Waste Diverted",
      description: "Total waste diverted from landfills through our platform",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Users,
      number: "50,000+",
      unit: "People",
      label: "Active Contributors",
      description: "Community members actively reporting and cleaning",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Globe,
      number: "500+",
      unit: "Cities",
      label: "Cities Covered",
      description: "Cities across the globe using CleanSight",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Award,
      number: "1M+",
      unit: "Reports",
      label: "Reports Submitted",
      description: "Total waste reports submitted by our community",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const environmentalImpact = [
    {
      icon: Leaf,
      title: "Carbon Footprint Reduced",
      value: "2,500 tons CO₂",
      description: "Equivalent to removing 500 cars from roads for a year"
    },
    {
      icon: Droplets,
      title: "Water Bodies Protected",
      value: "150+ locations",
      description: "Rivers, lakes, and coastal areas kept clean"
    },
    {
      icon: Wind,
      title: "Air Quality Improved",
      value: "85% reduction",
      description: "In particulate matter from waste burning"
    },
    {
      icon: Sun,
      title: "Renewable Energy",
      value: "500 MWh",
      description: "Generated from processed organic waste"
    }
  ];

  const citySuccess = [
    {
      city: "Bangalore",
      country: "India",
      reports: 12500,
      improvement: "45% cleaner",
      population: "12M",
      image: "🏙️"
    },
    {
      city: "Jakarta",
      country: "Indonesia", 
      reports: 8900,
      improvement: "38% cleaner",
      population: "10M",
      image: "🌆"
    },
    {
      city: "São Paulo",
      country: "Brazil",
      reports: 7600,
      improvement: "42% cleaner", 
      population: "22M",
      image: "🏢"
    },
    {
      city: "Lagos",
      country: "Nigeria",
      reports: 6800,
      improvement: "35% cleaner",
      population: "15M", 
      image: "🌇"
    }
  ];

  const timeline = [
    {
      year: "2022",
      title: "Platform Launch",
      description: "CleanSight launched in 5 pilot cities",
      metric: "1,000 users"
    },
    {
      year: "2023", 
      title: "Rapid Expansion",
      description: "Expanded to 50 cities across 10 countries",
      metric: "25,000 users"
    },
    {
      year: "2024",
      title: "Global Impact",
      description: "500+ cities, major environmental milestones achieved",
      metric: "50,000+ users"
    },
    {
      year: "2025",
      title: "Future Vision",
      description: "Targeting 1,000 cities and carbon neutrality",
      metric: "100,000+ users"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/20">
              🌍 Global Environmental Impact
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Collective Impact
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              See how communities worldwide are using CleanSight to create measurable environmental change and build cleaner, more sustainable cities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Global Statistics */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {globalStats.map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-shadow">
                    <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                          <Icon className="h-8 w-8" />
                        </div>
                      </div>
                      
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        {stat.label}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Environmental Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real measurable improvements to our environment through community action
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {environmentalImpact.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <Icon className="h-8 w-8 text-green-600" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {item.value}
                      </div>
                      
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* City Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cities around the world achieving remarkable cleanliness improvements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {citySuccess.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="text-6xl text-center mb-4">{city.image}</div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {city.city}
                    </h3>
                    <p className="text-gray-600 mb-4">{city.country}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Reports</span>
                        <span className="font-semibold">{city.reports.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Population</span>
                        <span className="font-semibold">{city.population}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {city.improvement}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From startup to global impact - the CleanSight timeline
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-blue-600"></div>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-1/2"></div>
                  
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full border-4 border-white shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="w-1/2 px-8">
                    <Card className="shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {item.metric}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of the Solution
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community and help create a cleaner, more sustainable world for future generations.
            </p>

            <Link to="/register">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
              >
                <Target className="h-5 w-5 mr-2" />
                Start Making Impact
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Impact;