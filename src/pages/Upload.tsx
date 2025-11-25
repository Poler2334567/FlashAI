import { useState, useCallback } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useDropzone } from 'react-dropzone';
import { Upload as UploadIcon, FileText, Image, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { aiService } from '@/services/aiService';
import { dataStore } from '@/services/dataStore';

const Upload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    console.log('Files uploaded:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md']
    }
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate content using AI
      const generated = await aiService.processFiles(files);
      
      // Save to data store
      const cheatSheet = dataStore.addCheatSheet({
        title: generated.cheatSheet.title,
        subject: generated.cheatSheet.subject,
        content: generated.cheatSheet.content,
        keyPoints: generated.cheatSheet.keyPoints,
        sourceFiles: files.map(f => f.name)
      });

      const quiz = dataStore.addQuiz({
        title: generated.quiz.title,
        subject: generated.quiz.subject,
        questions: generated.quiz.questions,
        sourceFiles: files.map(f => f.name)
      });

      dataStore.addFlashCards(generated.flashCards);
      
      toast({
        title: "Processing complete! ✨",
        description: "Generated cheat sheet, quiz, and flashcards from your materials.",
      });
      
      setFiles([]);
      navigate('/cheat-sheets');
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Processing failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <header className="glass-strong sticky top-0 z-10 flex items-center gap-4 border-b border-white/20 px-6 py-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-semibold">Upload Study Materials</h1>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-semibold mb-4">Upload Your Notes</h2>
                <p className="text-gray-600 mb-6">
                  Upload lecture slides, PDFs, images of notes, or any study material. Our AI will analyze and generate personalized cheat sheets, practice quizzes, and flashcards.
                </p>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                    isDragActive 
                      ? 'border-primary bg-primary/5 scale-[1.02]' 
                      : 'border-gray-300 hover:border-primary hover:bg-white/30'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  {isDragActive ? (
                    <p className="text-lg font-semibold text-primary">Drop files here...</p>
                  ) : (
                    <>
                      <p className="text-lg font-semibold mb-2">Drag & drop files here</p>
                      <p className="text-gray-600 mb-4">or click to browse</p>
                      <p className="text-sm text-gray-500">Supports PDF, Images (JPG, PNG), and Text files</p>
                    </>
                  )}
                </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="font-semibold">Uploaded Files ({files.length})</h3>
                    {files.map((file, index) => (
                      <div key={index} className="glass-card rounded-2xl p-4 flex items-center gap-3 group glass-hover">
                        {file.type.startsWith('image/') ? (
                          <Image className="h-5 w-5 text-blue-500 flex-shrink-0" />
                        ) : (
                          <FileText className="h-5 w-5 text-purple-500 flex-shrink-0" />
                        )}
                        <span className="flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                        </button>
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleProcess}
                  disabled={isProcessing || files.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      AI is analyzing your materials...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="mr-2 h-5 w-5" />
                      Generate Study Materials
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Extracting content...</span>
                      <span>⚡</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Generating cheat sheet...</span>
                      <span>📝</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Creating practice quiz...</span>
                      <span>🧠</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Building flashcards...</span>
                      <span>🎴</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Upload;