import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Marketing Pages
import Index from "./pages/Index";
import {
  HomePage,
  SolutionDealerships,
  SolutionContractors,
  SolutionDirectMail,
  Technology,
  Demo as MarketingDemo,
  TalkingPostcard
} from "./pages/marketing";
import HowItWorks from "./pages/HowItWorks";
import WhyVoxaris from "./pages/WhyVoxaris";
import BookDemo from "./pages/BookDemo";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Pages
import RoofingLeads from "./pages/dashboard/RoofingLeads";
import AgentsPage from "./pages/dashboard/AgentsPage";
import AgentEditor from "./pages/dashboard/AgentEditor";
import AgentTest from "./pages/dashboard/AgentTest";
import CommandCenter from "./pages/dashboard/CommandCenter";
import Developers from "./pages/dashboard/Developers";
import DashboardHiringHall from "./pages/dashboard/HiringHall";
import Integrations from "./pages/dashboard/Integrations";
import MyStaff from "./pages/dashboard/MyStaff";
import Settings from "./pages/dashboard/Settings";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import DealerManagement from "./pages/admin/DealerManagement";
import FailedJobs from "./pages/admin/FailedJobs";
import SystemHealth from "./pages/admin/SystemHealth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Marketing/Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/why-voxaris" element={<WhyVoxaris />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/demo" element={<MarketingDemo />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/talking-postcard" element={<TalkingPostcard />} />

          {/* Solution Pages */}
          <Route path="/solutions/dealerships" element={<SolutionDealerships />} />
          <Route path="/solutions/contractors" element={<SolutionContractors />} />
          <Route path="/solutions/direct-mail" element={<SolutionDirectMail />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<RoofingLeads />} />
          <Route path="/dashboard/leads" element={<RoofingLeads />} />
          <Route path="/dashboard/agents" element={<AgentsPage />} />
          <Route path="/dashboard/agents/new" element={<AgentEditor />} />
          <Route path="/dashboard/agents/:id/edit" element={<AgentEditor />} />
          <Route path="/dashboard/agents/:id/test" element={<AgentTest />} />
          <Route path="/dashboard/command-center" element={<CommandCenter />} />
          <Route path="/dashboard/developers" element={<Developers />} />
          <Route path="/dashboard/hiring-hall" element={<DashboardHiringHall />} />
          <Route path="/dashboard/integrations" element={<Integrations />} />
          <Route path="/dashboard/my-staff" element={<MyStaff />} />
          <Route path="/dashboard/settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dealers" element={<DealerManagement />} />
          <Route path="/admin/failed-jobs" element={<FailedJobs />} />
          <Route path="/admin/system-health" element={<SystemHealth />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
