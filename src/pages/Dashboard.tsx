import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Brain, Camera, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { dataStore } from "@/services/dataStore";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(dataStore.getStats());
  const [recentSheets, setRecentSheets] = useState(dataStore.getCheatSheets().slice(0, 3));

  useEffect(() => {
    setStats(dataStore.getStats());
    setRecentSheets(dataStore.getCheatSheets().slice(0, 3));
  }, []);

  const statCards = [
    { title: 'Cheat Sheets', value: stats.totalCheatSheets.toString(), icon: FileText, color: 'text-blue-500' },
    { title: 'Quizzes Taken', value: stats.totalQuizzes.toString(), icon: Brain, color: 'text-purple-500' },
    { title: 'Problems Solved', value: stats.totalProblems.toString(), icon: Camera, color: 'text-pink-500' },
    { title: 'Study Streak', value: `${stats.studyStreak} day${stats.studyStreak !== 1 ? 's' : ''}`, icon: Calendar, color: 'text-green-500' },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, {user?.name}! 👋</h1>
              <p className="text-sm text-muted-foreground">Here's your learning progress</p>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                  <div key={index} className="glass-card rounded-3xl p-6 glass-hover">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      {stat.value !== '0' && <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-3xl p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/upload" className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:scale-105 transition-transform">
                    <FileText className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Upload Notes</div>
                  </Link>
                  <Link to="/quiz" className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:scale-105 transition-transform">
                    <Brain className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Take Quiz</div>
                  </Link>
                  <Link to="/problem-solver" className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 text-white hover:scale-105 transition-transform">
                    <Camera className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Solve Problem</div>
                  </Link>
                  <Link to="/spaced-repetition" className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white hover:scale-105 transition-transform">
                    <Calendar className="h-6 w-6 mb-2" />
                    <div className="font-semibold">Daily Review</div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              {recentSheets.length > 0 && (
                <div className="glass-card rounded-3xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Cheat Sheets</h2>
                  <div className="space-y-3">
                    {recentSheets.map((sheet) => (
                      <Link 
                        key={sheet.id} 
                        to="/cheat-sheets"
                        className="flex items-center justify-between p-4 rounded-2xl glass-card glass-hover"
                      >
                        <div>
                          <div className="font-semibold">{sheet.title}</div>
                          <div className="text-sm text-gray-600">{sheet.subject}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(sheet.createdAt).toLocaleDateString()}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;