import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, TrendingUp, CheckCircle, Upload as UploadIcon } from "lucide-react";
import { dataStore, FlashCard } from "@/services/dataStore";
import { Link } from "react-router-dom";

const SpacedRepetition = () => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState(dataStore.getStats());

  useEffect(() => {
    loadFlashCards();
  }, []);

  const loadFlashCards = () => {
    const cards = dataStore.getTodaysFlashCards();
    setFlashCards(cards);
    setStats(dataStore.getStats());
  };

  const handleRating = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (flashCards.length === 0) return;
    
    const card = flashCards[currentCard];
    dataStore.reviewFlashCard(card.id, difficulty);
    
    if (currentCard < flashCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      // Reload to get updated cards
      loadFlashCards();
      setCurrentCard(0);
      setShowAnswer(false);
    }
  };

  const retentionRate = stats.totalFlashcardsReviewed > 0 
    ? Math.round((flashCards.reduce((sum, card) => sum + card.correctCount, 0) / stats.totalFlashcardsReviewed) * 100)
    : 0;

  if (flashCards.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-semibold">Spaced Repetition</h1>
                <p className="text-sm text-gray-600">Daily review for long-term retention</p>
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-3xl p-6">
                    <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-2xl font-bold">{stats.studyStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="glass-card rounded-3xl p-6">
                    <Brain className="h-8 w-8 text-purple-500 mb-2" />
                    <div className="text-2xl font-bold">{stats.totalFlashcardsReviewed}</div>
                    <div className="text-sm text-gray-600">Cards Reviewed</div>
                  </div>
                  <div className="glass-card rounded-3xl p-6">
                    <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-2xl font-bold">{retentionRate}%</div>
                    <div className="text-sm text-gray-600">Retention Rate</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="glass-card rounded-3xl p-12">
                    <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500" />
                    <h2 className="text-2xl font-semibold mb-4">All Done for Today! 🎉</h2>
                    <p className="text-gray-600 mb-8">
                      You've reviewed all your flashcards for today. Great work! Come back tomorrow for more.
                    </p>
                    <Link to="/upload">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        <UploadIcon className="mr-2 h-5 w-5" />
                        Upload More Materials
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const card = flashCards[currentCard];
  const progress = ((stats.flashcardsReviewedToday / stats.dailyGoal) * 100).toFixed(0);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">Spaced Repetition</h1>
              <p className="text-sm text-gray-600">Daily review for long-term retention</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-3xl p-6">
                  <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.studyStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="glass-card rounded-3xl p-6">
                  <Brain className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.totalFlashcardsReviewed}</div>
                  <div className="text-sm text-gray-600">Cards Reviewed</div>
                </div>
                <div className="glass-card rounded-3xl p-6">
                  <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{retentionRate}%</div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
              </div>

              {/* Flashcard */}
              <div className="glass-card rounded-3xl p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary">{card.subject}</span>
                    <span className="text-sm text-gray-600">Card {currentCard + 1} of {flashCards.length}</span>
                  </div>
                  <div className="flex gap-2">
                    {flashCards.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          index <= currentCard ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="min-h-[300px] flex flex-col items-center justify-center text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-6">
                    {showAnswer ? 'Answer' : 'Question'}
                  </h2>
                  <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                    {showAnswer ? card.answer : card.question}
                  </p>
                </div>

                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-gray-600 mb-4">How well did you know this?</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleRating('hard')}
                        variant="outline"
                        className="border-red-300 hover:bg-red-50 flex flex-col h-auto py-4"
                      >
                        <span className="font-semibold">Hard</span>
                        <span className="text-xs text-gray-500 mt-1">Review in 1 day</span>
                      </Button>
                      <Button
                        onClick={() => handleRating('medium')}
                        variant="outline"
                        className="border-yellow-300 hover:bg-yellow-50 flex flex-col h-auto py-4"
                      >
                        <span className="font-semibold">Medium</span>
                        <span className="text-xs text-gray-500 mt-1">Review in 3 days</span>
                      </Button>
                      <Button
                        onClick={() => handleRating('easy')}
                        variant="outline"
                        className="border-green-300 hover:bg-green-50 flex flex-col h-auto py-4"
                      >
                        <span className="font-semibold">Easy</span>
                        <span className="text-xs text-gray-500 mt-1">Review in 7 days</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Today's Progress */}
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Today's Progress</h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cards reviewed</span>
                    <span className="font-semibold">{stats.flashcardsReviewedToday} / {stats.dailyGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, Number(progress))}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SpacedRepetition;