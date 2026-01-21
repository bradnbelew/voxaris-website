import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CVIProvider } from "@/components/cvi";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import WhyVoxaris from "./pages/WhyVoxaris";
import Technology from "./pages/Technology";
import Demo from "./pages/Demo";
import BookDemo from "./pages/BookDemo";
import SolutionsAgencies from "./pages/SolutionsAgencies";
import SolutionsDealerships from "./pages/SolutionsDealerships";
import SolutionsContractors from "./pages/SolutionsContractors";
import SolutionsLawFirms from "./pages/SolutionsLawFirms";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import CommandCenter from "./pages/dashboard/CommandCenter";
import HiringHall from "./pages/dashboard/HiringHall";
import MyStaff from "./pages/dashboard/MyStaff";
import AgentEditor from "./pages/dashboard/AgentEditor";
import AgentsPage from "./pages/dashboard/AgentsPage";
import Integrations from "./pages/dashboard/Integrations";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CVIProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/why-voxaris" element={<WhyVoxaris />} />
              <Route path="/technology" element={<Technology />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/book-demo" element={<BookDemo />} />
              <Route path="/solutions/agencies" element={<SolutionsAgencies />} />
              <Route path="/solutions/dealerships" element={<SolutionsDealerships />} />
              <Route path="/solutions/contractors" element={<SolutionsContractors />} />
              <Route path="/solutions/law-firms" element={<SolutionsLawFirms />} />
              
              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout><CommandCenter /></DashboardLayout>} />
              <Route path="/dashboard/hiring-hall" element={<DashboardLayout><HiringHall /></DashboardLayout>} />
              <Route path="/dashboard/my-staff" element={<DashboardLayout><MyStaff /></DashboardLayout>} />
              <Route path="/dashboard/agents" element={<DashboardLayout><AgentsPage /></DashboardLayout>} />
              <Route path="/dashboard/agents/:id" element={<DashboardLayout><AgentEditor /></DashboardLayout>} />
              <Route path="/dashboard/integrations" element={<DashboardLayout><Integrations /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CVIProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
