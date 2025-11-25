interface CheatSheet {
  id: string;
  title: string;
  subject: string;
  content: string;
  sourceFiles: string[];
  createdAt: Date;
  keyPoints: string[];
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
  sourceFiles: string[];
  createdAt: Date;
  completedAt?: Date;
  score?: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface FlashCard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReview: Date;
  lastReviewed?: Date;
  reviewCount: number;
  correctCount: number;
}

interface UserStats {
  totalCheatSheets: number;
  totalQuizzes: number;
  totalProblems: number;
  studyStreak: number;
  lastStudyDate: Date;
  totalFlashcardsReviewed: number;
  flashcardsReviewedToday: number;
  dailyGoal: number;
}

class DataStore {
  private cheatSheets: CheatSheet[] = [];
  private quizzes: Quiz[] = [];
  private flashCards: FlashCard[] = [];
  private stats: UserStats = {
    totalCheatSheets: 0,
    totalQuizzes: 0,
    totalProblems: 0,
    studyStreak: 0,
    lastStudyDate: new Date(),
    totalFlashcardsReviewed: 0,
    flashcardsReviewedToday: 0,
    dailyGoal: 20
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('flashai_data');
    if (stored) {
      const data = JSON.parse(stored);
      this.cheatSheets = data.cheatSheets || [];
      this.quizzes = data.quizzes || [];
      this.flashCards = data.flashCards || [];
      this.stats = data.stats || this.stats;
      
      // Convert date strings back to Date objects
      this.cheatSheets.forEach(sheet => {
        sheet.createdAt = new Date(sheet.createdAt);
      });
      this.quizzes.forEach(quiz => {
        quiz.createdAt = new Date(quiz.createdAt);
        if (quiz.completedAt) quiz.completedAt = new Date(quiz.completedAt);
      });
      this.flashCards.forEach(card => {
        card.nextReview = new Date(card.nextReview);
        if (card.lastReviewed) card.lastReviewed = new Date(card.lastReviewed);
      });
      this.stats.lastStudyDate = new Date(this.stats.lastStudyDate);
    }
  }

  private saveToStorage() {
    localStorage.setItem('flashai_data', JSON.stringify({
      cheatSheets: this.cheatSheets,
      quizzes: this.quizzes,
      flashCards: this.flashCards,
      stats: this.stats
    }));
  }

  // Cheat Sheets
  addCheatSheet(sheet: Omit<CheatSheet, 'id' | 'createdAt'>) {
    const newSheet: CheatSheet = {
      ...sheet,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.cheatSheets.unshift(newSheet);
    this.stats.totalCheatSheets++;
    this.saveToStorage();
    return newSheet;
  }

  getCheatSheets(): CheatSheet[] {
    return this.cheatSheets;
  }

  getCheatSheet(id: string): CheatSheet | undefined {
    return this.cheatSheets.find(sheet => sheet.id === id);
  }

  // Quizzes
  addQuiz(quiz: Omit<Quiz, 'id' | 'createdAt'>) {
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.quizzes.unshift(newQuiz);
    this.saveToStorage();
    return newQuiz;
  }

  getQuizzes(): Quiz[] {
    return this.quizzes;
  }

  completeQuiz(id: string, score: number) {
    const quiz = this.quizzes.find(q => q.id === id);
    if (quiz) {
      quiz.completedAt = new Date();
      quiz.score = score;
      this.stats.totalQuizzes++;
      this.updateStudyStreak();
      this.saveToStorage();
    }
  }

  // Flashcards
  addFlashCards(cards: Omit<FlashCard, 'id' | 'nextReview' | 'reviewCount' | 'correctCount'>[]) {
    const newCards = cards.map(card => ({
      ...card,
      id: Date.now().toString() + Math.random(),
      nextReview: new Date(),
      reviewCount: 0,
      correctCount: 0
    }));
    this.flashCards.push(...newCards);
    this.saveToStorage();
    return newCards;
  }

  getTodaysFlashCards(): FlashCard[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.flashCards.filter(card => card.nextReview <= new Date());
  }

  reviewFlashCard(id: string, difficulty: 'easy' | 'medium' | 'hard') {
    const card = this.flashCards.find(c => c.id === id);
    if (card) {
      card.lastReviewed = new Date();
      card.reviewCount++;
      
      if (difficulty === 'easy') {
        card.correctCount++;
        card.nextReview = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      } else if (difficulty === 'medium') {
        card.nextReview = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
      } else {
        card.nextReview = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
      }
      
      this.stats.totalFlashcardsReviewed++;
      this.stats.flashcardsReviewedToday++;
      this.updateStudyStreak();
      this.saveToStorage();
    }
  }

  // Stats
  getStats(): UserStats {
    return { ...this.stats };
  }

  incrementProblems() {
    this.stats.totalProblems++;
    this.updateStudyStreak();
    this.saveToStorage();
  }

  private updateStudyStreak() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastStudy = new Date(this.stats.lastStudyDate);
    lastStudy.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change
    } else if (daysDiff === 1) {
      // Consecutive day
      this.stats.studyStreak++;
    } else {
      // Streak broken
      this.stats.studyStreak = 1;
    }
    
    this.stats.lastStudyDate = new Date();
  }

  resetDailyStats() {
    this.stats.flashcardsReviewedToday = 0;
    this.saveToStorage();
  }
}

export const dataStore = new DataStore();
export type { CheatSheet, Quiz, QuizQuestion, FlashCard, UserStats };