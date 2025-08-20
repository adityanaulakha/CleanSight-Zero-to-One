import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Camera,
  MapPin,
  Trophy,
  Gift,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Video,
  FileText,
  Headphones
} from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Star,
      description: 'Learn the basics of CleanSight'
    },
    {
      id: 'reporting',
      title: 'Reporting Waste',
      icon: Camera,
      description: 'How to submit and manage reports'
    },
    {
      id: 'rewards',
      title: 'Rewards & Points',
      icon: Gift,
      description: 'Understanding the reward system'
    },
    {
      id: 'community',
      title: 'Community',
      icon: Users,
      description: 'Engaging with other users'
    },
    {
      id: 'account',
      title: 'Account & Settings',
      icon: MapPin,
      description: 'Managing your profile and preferences'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: AlertCircle,
      description: 'Common issues and solutions'
    }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I get started with CleanSight?',
        answer: 'Getting started is easy! Simply sign up for an account, complete your profile, and start reporting waste in your area. You\'ll immediately begin earning points for your contributions.'
      },
      {
        question: 'Is CleanSight free to use?',
        answer: 'Yes, CleanSight is completely free to use for all community members. There are no hidden fees or premium subscriptions required.'
      },
      {
        question: 'What types of waste can I report?',
        answer: 'You can report all types of waste including plastic litter, food waste, construction debris, overflowing bins, illegal dumping, and hazardous materials.'
      },
      {
        question: 'Do I need to download an app?',
        answer: 'CleanSight works perfectly in your web browser on any device. While we don\'t have a dedicated app yet, our mobile web experience is fully optimized.'
      }
    ],
    'reporting': [
      {
        question: 'How do I submit a waste report?',
        answer: 'Navigate to the Report section, take or upload a photo of the waste, add location details, select the waste type, and submit. Our AI will help identify waste categories automatically.'
      },
      {
        question: 'What makes a good waste report?',
        answer: 'A good report includes a clear photo, accurate location information, correct waste categorization, and any additional context that might be helpful for cleanup crews.'
      },
      {
        question: 'How long does it take for reports to be processed?',
        answer: 'Most reports are reviewed and processed within 24-48 hours. Urgent reports (health hazards) are prioritized and processed faster.'
      },
      {
        question: 'Can I edit or delete my reports?',
        answer: 'You can edit reports within 24 hours of submission if they haven\'t been assigned yet. Contact support if you need to modify processed reports.'
      }
    ],
    'rewards': [
      {
        question: 'How do I earn points?',
        answer: 'You earn points by submitting verified waste reports (50 points), having reports marked as cleaned (bonus 25 points), participating in community events, and referring new users.'
      },
      {
        question: 'What can I redeem points for?',
        answer: 'Points can be redeemed for eco-friendly products, discount coupons, plant saplings, cleanup event tickets, and exclusive CleanSight merchandise.'
      },
      {
        question: 'Do points expire?',
        answer: 'Points remain valid for 12 months from the date they were earned. You\'ll receive reminders before points are set to expire.'
      },
      {
        question: 'How do I check my points balance?',
        answer: 'Your current points balance is always visible in the header of your dashboard and on the Rewards page.'
      }
    ],
    'community': [
      {
        question: 'How can I connect with other users?',
        answer: 'Use the Community section to share updates, join discussions, participate in challenges, and connect with local environmental groups.'
      },
      {
        question: 'Can I organize cleanup events?',
        answer: 'Yes! Community members can create and organize cleanup events. These events earn bonus points for all participants.'
      },
      {
        question: 'How do I join the leaderboard?',
        answer: 'You\'re automatically added to leaderboards once you submit your first report. Rankings are based on points earned and community contributions.'
      },
      {
        question: 'What are community guidelines?',
        answer: 'We maintain a positive, supportive environment. Be respectful, share constructive content, and focus on environmental solutions. Full guidelines are in your account settings.'
      }
    ],
    'account': [
      {
        question: 'How do I update my profile?',
        answer: 'Go to Settings > Profile to update your name, photo, location preferences, and notification settings.'
      },
      {
        question: 'Can I change my email address?',
        answer: 'Yes, you can update your email in Settings > Account. You\'ll need to verify the new email address.'
      },
      {
        question: 'How do I delete my account?',
        answer: 'Account deletion is available in Settings > Privacy. Note that this action is permanent and will remove all your data and points.'
      },
      {
        question: 'What data do you collect?',
        answer: 'We collect only necessary data for the service: location for reports, photos for verification, and basic profile information. See our Privacy Policy for details.'
      }
    ],
    'troubleshooting': [
      {
        question: 'Why isn\'t my location being detected?',
        answer: 'Make sure location services are enabled for your browser. You can also manually enter the address if GPS detection fails.'
      },
      {
        question: 'My photo won\'t upload. What should I do?',
        answer: 'Check your internet connection and ensure the photo is under 10MB. Try using a different image format (JPG, PNG) or compress the image.'
      },
      {
        question: 'I\'m not receiving notification emails',
        answer: 'Check your spam folder and ensure notifications are enabled in Settings. Add our email domain to your contacts.'
      },
      {
        question: 'The map isn\'t loading properly',
        answer: 'Try refreshing the page or clearing your browser cache. Make sure location services are enabled and you have a stable internet connection.'
      }
    ]
  };

  const quickActions = [
    {
      title: 'Submit Your First Report',
      description: 'Start making impact today',
      icon: Camera,
      action: 'Go to Report',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Watch Tutorial Videos',
      description: 'Quick video guides',
      icon: Video,
      action: 'Watch Now',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Contact Support',
      description: '24/7 help available',
      icon: Headphones,
      action: 'Get Help',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const contactOptions = [
    {
      type: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      available: 'Available 24/7',
      color: 'bg-blue-500'
    },
    {
      type: 'Email Support',
      description: 'Send us your questions and feedback',
      icon: Mail,
      available: 'Response within 24 hours',
      color: 'bg-green-500'
    },
    {
      type: 'Phone Support',
      description: 'Speak directly with our team',
      icon: Phone,
      available: 'Mon-Fri 9AM-6PM',
      color: 'bg-purple-500'
    }
  ];

  const filteredFAQs = searchQuery 
    ? Object.values(faqs).flat().filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs[selectedCategory] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Find answers, get support, and learn how to make the most of CleanSight
            </p>

            {/* Search karte hai Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg border-0 shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${action.color} text-white rounded-full mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {action.description}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          if (action.action === 'Go to Report') {
                            window.location.href = '/citizen/report';
                          } else if (action.action === 'Watch Now') {
                            alert('Tutorial Videos\n\n🎬 Available tutorials:\n• How to report garbage\n• Using the map feature\n• Earning and redeeming rewards\n• Community features\n• Profile management\n\n[Video player would open here]');
                          } else if (action.action === 'Get Help') {
                            document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        {action.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Help Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Help Topics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isActive = selectedCategory === category.id;
                      
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{category.title}</div>
                            <div className="text-xs opacity-75">{category.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-6 w-6 text-blue-500" />
                      {searchQuery ? 'Search Results' : categories.find(c => c.id === selectedCategory)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredFAQs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            {expandedFAQ === index ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          
                          {expandedFAQ === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-4 pb-4"
                            >
                              <div className="pt-2 border-t border-gray-100">
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}

                      {filteredFAQs.length === 0 && searchQuery && (
                        <div className="text-center py-8">
                          <div className="text-gray-400 text-6xl mb-4">🔍</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No results found
                          </h3>
                          <p className="text-gray-600">
                            Try different keywords or browse by category
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or issues you might have.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${option.color} text-white rounded-full mb-4`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {option.type}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {option.description}
                      </p>
                      
                      <Badge variant="outline" className="mb-4">
                        {option.available}
                      </Badge>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (option.type === 'Live Chat') {
                            alert('Starting Live Chat...\n\n💬 Connecting you to our support team.\nPlease wait while we find the next available agent.\n\n[Chat widget would open here]');
                          } else if (option.type === 'Email Support') {
                            window.location.href = 'mailto:support@cleansight.com?subject=CleanSight Support Request';
                          } else if (option.type === 'Phone Support') {
                            alert('Phone Support\n\n📞 Call us at: +1-800-CLEAN-01\n\nAvailable: Monday-Friday, 9AM-6PM\n\nFor urgent issues outside business hours, please use live chat or email support.');
                          }
                        }}
                      >
                        Contact Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input type="email" placeholder="your@email.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <Input placeholder="How can we help?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Describe your issue or question..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Help;