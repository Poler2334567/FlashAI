import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { dataStore } from "@/services/dataStore";

const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [stats, setStats] = useState(dataStore.getStats());

  useEffect(() => {
    setStats(dataStore.getStats());
  }, []);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold">Account Settings</h1>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Profile Section */}
              <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                </div>

                {user?.isPremium && (
                  <div className="flex items-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 mb-6">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary">Premium Member</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Security Section */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-semibold mb-6">Security</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>

                  <Button variant="outline">
                    Update Password
                  </Button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="glass-card rounded-3xl p-8">
                <h3 className="text-xl font-semibold mb-6">Your Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.totalCheatSheets}</div>
                    <div className="text-sm text-gray-600">Cheat Sheets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.totalQuizzes}</div>
                    <div className="text-sm text-gray-600">Quizzes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.totalProblems}</div>
                    <div className="text-sm text-gray-600">Problems</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stats.studyStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
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

export default Account;