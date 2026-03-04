import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Marketing Pages
import Index from "./pages/Index";
import {
  HomePage,
  SolutionDealerships,
  SolutionContractors,
  SolutionHospitality,
  SolutionDirectMail,
  SolutionWhiteLabel,
  Technology,
  Demo as MarketingDemo,
  TalkingPostcard,
  TalkingPostcardDemo,
  BlogIndex,
  BlogPost,
} from "./pages/marketing";
import HowItWorks from "./pages/HowItWorks";
import WhyVoxaris from "./pages/WhyVoxaris";
import BookDemo from "./pages/BookDemo";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { BusinessCardAgent } from "./pages/marketing/BusinessCardAgent";

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
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/why-voxaris" element={<WhyVoxaris />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/demo" element={<MarketingDemo />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/talking-postcard" element={<TalkingPostcard />} />
          <Route path="/talking-postcard/demo" element={<TalkingPostcardDemo />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Business Card Funnels */}
          <Route path="/ethan" element={<BusinessCardAgent persona="ethan" />} />
          <Route path="/mike" element={<BusinessCardAgent persona="mike" />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* Solution Pages */}
          <Route path="/solutions/dealerships" element={<SolutionDealerships />} />
          <Route path="/solutions/hospitality" element={<SolutionHospitality />} />
          <Route path="/solutions/contractors" element={<SolutionContractors />} />
          <Route path="/solutions/direct-mail" element={<SolutionDirectMail />} />
          <Route path="/solutions/white-label" element={<SolutionWhiteLabel />} />

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
