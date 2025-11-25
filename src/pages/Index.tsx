import { Link } from 'react-router-dom';
import { Brain, FileText, Camera, Calendar, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Cheat Sheets',
      description: 'Upload notes and get AI-generated cheat sheets instantly'
    },
    {
      icon: Brain,
      title: 'Practice Quizzes',
      description: 'Auto-generated quizzes from your study materials'
    },
    {
      icon: Camera,
      title: 'Problem Solver',
      description: 'Photo any problem for step-by-step solutions'
    },
    {
      icon: Calendar,
      title: 'Spaced Repetition',
      description: 'Daily review system for long-term retention'
    }
  ];

  const pricingFeatures = [
    'Unlimited cheat sheet generation',
    'Unlimited practice quizzes',
    'Instant problem solving',
    'Spaced repetition system',
    'PDF & image uploads',
    'Priority support'
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-strong fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              FlashAI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="glass-strong rounded-3xl p-12 mb-12">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Study Smarter with AI
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Transform your notes into cheat sheets, practice quizzes, and get instant solutions to any problem.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-6">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
                <feature.icon className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Pricing Section */}
          <div className="glass-strong rounded-3xl p-12 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <div className="text-5xl font-bold text-primary mb-2">$8.99<span className="text-2xl text-gray-600">/month</span></div>
            <p className="text-gray-600 mb-8">Everything you need to ace your exams</p>
            
            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              {pricingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;