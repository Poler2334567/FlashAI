import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Download, Eye, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataStore, CheatSheet } from "@/services/dataStore";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CheatSheets = () => {
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<CheatSheet | null>(null);

  useEffect(() => {
    setCheatSheets(dataStore.getCheatSheets());
  }, []);

  const getColorForSubject = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'from-blue-500 to-blue-600',
      'Physics': 'from-purple-500 to-purple-600',
      'Chemistry': 'from-pink-500 to-pink-600',
      'Biology': 'from-green-500 to-green-600',
      'History': 'from-orange-500 to-orange-600',
      'English': 'from-red-500 to-red-600',
      'Computer Science': 'from-cyan-500 to-cyan-600',
    };
    return colors[subject] || 'from-gray-500 to-gray-600';
  };

  const handleDownload = (sheet: CheatSheet) => {
    const blob = new Blob([sheet.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sheet.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (cheatSheets.length === 0) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 w-full min-w-0">
            <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-semibold">My Cheat Sheets</h1>
            </header>
            
            <main className="flex-1 overflow-auto p-6 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="glass-card rounded-3xl p-12">
                  <FileText className="h-20 w-20 mx-auto mb-6 text-gray-400" />
                  <h2 className="text-2xl font-semibold mb-4">No Cheat Sheets Yet</h2>
                  <p className="text-gray-600 mb-8">
                    Upload your study materials to generate AI-powered cheat sheets automatically.
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold">My Cheat Sheets</h1>
              <p className="text-sm text-gray-600">{cheatSheets.length} cheat sheet{cheatSheets.length !== 1 ? 's' : ''}</p>
            </div>
            <Link to="/upload">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload More
              </Button>
            </Link>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cheatSheets.map((sheet) => (
                  <div key={sheet.id} className="glass-card rounded-3xl overflow-hidden glass-hover">
                    <div className={`h-32 bg-gradient-to-br ${getColorForSubject(sheet.subject)} flex items-center justify-center`}>
                      <FileText className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{sheet.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span>{sheet.subject}</span>
                        <span>{sheet.keyPoints.length} key points</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        Created {new Date(sheet.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedSheet(sheet)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                          onClick={() => handleDownload(sheet)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      <Dialog open={!!selectedSheet} onOpenChange={() => setSelectedSheet(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-strong">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedSheet?.title}</DialogTitle>
          </DialogHeader>
          <div className="prose max-w-none">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {selectedSheet?.subject}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {selectedSheet?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default CheatSheets;