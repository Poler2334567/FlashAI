import { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Check, Crown, CreditCard, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loadStripe } from '@stripe/stripe-js';

// Note: Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

const Subscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    'Unlimited cheat sheet generation',
    'Unlimited practice quizzes',
    'Instant problem solving with step-by-step solutions',
    'Spaced repetition system',
    'Upload unlimited PDFs and images',
    'Priority AI processing',
    'Export to PDF',
    'Priority customer support',
    'Ad-free experience',
    'Early access to new features'
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    
    // Simulate Stripe checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Subscription activated!",
      description: "Welcome to FlashAI Premium! 🎉",
    });
    
    setIsLoading(false);
    
    // In a real app, you would:
    // 1. Create a checkout session on your backend
    // 2. Redirect to Stripe checkout
    // const stripe = await stripePromise;
    // const { error } = await stripe.redirectToCheckout({ sessionId });
  };

  const handleManageSubscription = () => {
    toast({
      title: "Opening billing portal",
      description: "Redirecting to Stripe billing portal...",
    });
    
    // In a real app, redirect to Stripe customer portal
    // window.location.href = 'stripe_portal_url';
  };

  if (user?.isPremium) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">Subscription</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-2">You're a Premium Member!</h2>
                  <p className="text-gray-600 mb-6">Thank you for supporting FlashAI</p>
                  
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">$8.99/month</div>
                    <div className="text-sm text-gray-600">
                      Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 text-left">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold">Upgrade to Premium</h1>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-8">
                <div className="text-center mb-8">
                  <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-4xl font-bold mb-4">Unlock Your Full Potential</h2>
                  <p className="text-xl text-gray-600">
                    Get unlimited access to all FlashAI features
                  </p>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8 text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    $8.99<span className="text-2xl text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">Cancel anytime, no questions asked</p>
                </div>

                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/50">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Crown className="mr-2 h-5 w-5" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Subscription;