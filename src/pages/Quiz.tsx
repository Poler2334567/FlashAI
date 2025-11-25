import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Brain, Upload as UploadIcon } from "lucide-react";
import { dataStore, Quiz as QuizType } from "@/services/dataStore";
import { Link } from "react-router-dom";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const allQuizzes = dataStore.getQuizzes();
    setQuizzes(allQuizzes);
    
    // Auto-select first incomplete quiz
    const incompleteQuiz = allQuizzes.find(q => !q.completedAt);
    if (incompleteQuiz) {
      setSelectedQuiz(incompleteQuiz);
    }
  }, []);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (!selectedQuiz) return;

    if (selectedAnswer === selectedQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const finalScore = selectedAnswer === selectedQuiz.questions[currentQuestion].correctAnswer ? score + 1 : score;
      dataStore.completeQuiz(selectedQuiz.id, finalScore);
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizzes(dataStore.getQuizzes());
  };

  if (quizzes.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">Practice Quiz</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="glass-card rounded-3xl p-12">
                  <Brain className="h-20 w-20 mx-auto mb-6 text-gray-400" />
                  <h2 className="text-2xl font-semibold mb-4">No Quizzes Available</h2>
                  <p className="text-gray-600 mb-8">
                    Upload your study materials to generate AI-powered practice quizzes automatically.
                  </p>
                  <Link to="/upload">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <UploadIcon className="mr-2 h-5 w-5" />
                      Upload Materials
                    </Button>
                  </Link>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!selectedQuiz) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">Select a Quiz</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="glass-card rounded-3xl p-6 glass-hover cursor-pointer" onClick={() => setSelectedQuiz(quiz)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                        <p className="text-gray-600">{quiz.subject} • {quiz.questions.length} questions</p>
                      </div>
                      {quiz.completedAt ? (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{quiz.score}/{quiz.questions.length}</div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                      ) : (
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                          Start Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">Quiz Results</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <div className="glass-card rounded-3xl p-12 text-center max-w-md">
                <Brain className="h-20 w-20 mx-auto mb-6 text-primary" />
                <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-bold text-primary mb-4">
                  {score}/{selectedQuiz.questions.length}
                </div>
                <div className="text-2xl text-gray-600 mb-8">
                  {percentage}%
                </div>
                <p className="text-xl text-gray-600 mb-8">
                  {percentage === 100 ? 'Perfect score! 🎉' : 
                   percentage >= 80 ? 'Excellent work! 🌟' :
                   percentage >= 60 ? 'Good job! 👏' : 
                   'Keep practicing! 💪'}
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={resetQuiz}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Back to Quizzes
                  </Button>
                  <Link to="/spaced-repetition" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      Review with Flashcards
                    </Button>
                  </Link>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const question = selectedQuiz.questions[currentQuestion];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{selectedQuiz.title}</h1>
              <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {selectedQuiz.questions.length}</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-3xl p-8">
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    {selectedQuiz.questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          index <= currentQuestion ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-semibold mb-8">{question.question}</h2>

                <div className="space-y-3 mb-8">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full p-4 rounded-2xl text-left transition-all ${
                        selectedAnswer === index
                          ? 'bg-primary text-white scale-[1.02]'
                          : 'glass-card glass-hover'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          selectedAnswer === index ? 'bg-white text-primary' : 'bg-gray-200'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div className={`p-4 rounded-2xl mb-6 ${
                    selectedAnswer === question.correctAnswer 
                      ? 'bg-green-100 border border-green-300' 
                      : 'bg-red-100 border border-red-300'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === question.correctAnswer ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Correct!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-800">Incorrect</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{question.explanation}</p>
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {currentQuestion < selectedQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;