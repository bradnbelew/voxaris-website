import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import WhyVoxaris from "./pages/WhyVoxaris";
import Demo from "./pages/Demo";
import BookDemo from "./pages/BookDemo";
import SolutionsAgencies from "./pages/SolutionsAgencies";
import SolutionsDealerships from "./pages/SolutionsDealerships";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/why-voxaris" element={<WhyVoxaris />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/solutions/agencies" element={<SolutionsAgencies />} />
          <Route path="/solutions/dealerships" element={<SolutionsDealerships />} />
          <Route path="/pricing" element={<Pricing />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
