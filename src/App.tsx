
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthScreen from "./components/auth/AuthScreen";
import { fetchMe, clearToken, User } from "./lib/api";

const queryClient = new QueryClient();

function AppRoot() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl btn-grad flex items-center justify-center text-3xl animate-pulse">💬</div>
          <p className="text-muted-foreground text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index user={user} onLogout={() => { clearToken(); setUser(null); }} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoot />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;