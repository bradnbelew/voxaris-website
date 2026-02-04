import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CVIProvider } from "@/components/cvi";
import { AuthProvider } from "@/contexts/AuthContext";
import { VoiceProvider } from "@/components/voice/VoiceProvider";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import WhyVoxaris from "./pages/WhyVoxaris";
import BookDemo from "./pages/BookDemo";

// New Premium Marketing Pages
import {
  SolutionDealerships,
  SolutionLawFirms,
  SolutionContractors,
  SolutionAgencies,
  Technology,
  Demo,
} from "./pages/marketing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import CommandCenter from "./pages/dashboard/CommandCenter";
import HiringHall from "./pages/dashboard/HiringHall";
import MyStaff from "./pages/dashboard/MyStaff";
import AgentEditor from "./pages/dashboard/AgentEditor";
import AgentsPage from "./pages/dashboard/AgentsPage";
import AgentTest from "./pages/dashboard/AgentTest";
import Developers from "./pages/dashboard/Developers";
import Integrations from "./pages/dashboard/Integrations";
import Settings from "./pages/dashboard/Settings";
import RoofingLeads from "./pages/dashboard/RoofingLeads";
import NotFound from "./pages/NotFound";

// Admin Dashboard Pages
import { AdminDashboard, DealerManagement, SystemHealth, FailedJobs } from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <VoiceProvider>
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
              <Route path="/solutions/agencies" element={<SolutionAgencies />} />
              <Route path="/solutions/dealerships" element={<SolutionDealerships />} />
              <Route path="/solutions/contractors" element={<SolutionContractors />} />
              <Route path="/solutions/law-firms" element={<SolutionLawFirms />} />

              {/* Public Roofing Leads Dashboard (no auth required) */}
              <Route path="/roofing-leads" element={<RoofingLeads />} />

              {/* Auth Routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              
              {/* Dashboard Routes - Roofing Leads is the default dashboard */}
              <Route path="/dashboard" element={<DashboardLayout><RoofingLeads /></DashboardLayout>} />
              <Route path="/dashboard/hiring-hall" element={<DashboardLayout><HiringHall /></DashboardLayout>} />
              <Route path="/dashboard/my-staff" element={<DashboardLayout><MyStaff /></DashboardLayout>} />
              <Route path="/dashboard/agents" element={<DashboardLayout><AgentsPage /></DashboardLayout>} />
              <Route path="/dashboard/agents/:id" element={<DashboardLayout><AgentEditor /></DashboardLayout>} />
              <Route path="/dashboard/agent-test" element={<DashboardLayout><AgentTest /></DashboardLayout>} />
              <Route path="/dashboard/developers" element={<DashboardLayout><Developers /></DashboardLayout>} />
              <Route path="/dashboard/integrations" element={<DashboardLayout><Integrations /></DashboardLayout>} />
              <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />

              {/* Roofing Leads Dashboard */}
              <Route path="/dashboard/roofing-leads" element={<DashboardLayout><RoofingLeads /></DashboardLayout>} />

              {/* Admin Routes */}
              <Route path="/dashboard/admin" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
              <Route path="/dashboard/admin/dealers" element={<DashboardLayout><DealerManagement /></DashboardLayout>} />
              <Route path="/dashboard/admin/health" element={<DashboardLayout><SystemHealth /></DashboardLayout>} />
              <Route path="/dashboard/admin/dlq" element={<DashboardLayout><FailedJobs /></DashboardLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CVIProvider>
      </VoiceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
