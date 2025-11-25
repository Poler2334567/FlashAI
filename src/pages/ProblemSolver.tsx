import { useState, useCallback } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { aiService } from '@/services/aiService';
import { dataStore } from '@/services/dataStore';

const ProblemSolver = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setSolution(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    maxFiles: 1
  });

  const handleSolve = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    
    try {
      const solutionText = await aiService.solveProblem(image);
      setSolution(solutionText);
      dataStore.incrementProblems();
    } catch (error) {
      console.error('Error solving problem:', error);
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
            <h1 className="text-2xl font-semibold">Problem Solver</h1>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl font-semibold mb-4">Upload Problem Image</h2>
                <p className="text-gray-600 mb-6">
                  Take a photo or upload an image of any math, physics, or chemistry problem for instant step-by-step solutions powered by AI.
                </p>

                {!image ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
                      isDragActive 
                        ? 'border-primary bg-primary/5 scale-[1.02]' 
                        : 'border-gray-300 hover:border-primary hover:bg-white/30'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-lg font-semibold text-primary">Drop image here...</p>
                    ) : (
                      <>
                        <p className="text-lg font-semibold mb-2">Upload problem image</p>
                        <p className="text-gray-600 mb-4">or click to browse</p>
                        <p className="text-sm text-gray-500">Supports JPG, PNG images</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-3xl overflow-hidden glass-card p-4">
                      <img src={image} alt="Problem" className="w-full h-auto rounded-2xl" />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setImage(null);
                          setSolution(null);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Different Image
                      </Button>
                      <Button
                        onClick={handleSolve}
                        disabled={isProcessing}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            AI is solving...
                          </>
                        ) : (
                          'Solve Problem'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {solution && (
                <div className="glass-card rounded-3xl p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <h2 className="text-xl font-semibold">Step-by-Step Solution</h2>
                  </div>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {solution}
                    </div>
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

export default ProblemSolver;