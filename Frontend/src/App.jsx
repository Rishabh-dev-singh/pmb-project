import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import AdminLogin from "./pages/Admin_Login_Page";
import EmployeeLogin from "./pages/Employee_login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import About from "./pages/About";
import Career from "./pages/Career";
import LoanType from "./pages/Loan_Type";
import AgroProduct from "./pages/AgroProduct";
import AddLead from "./pages/AddLead";
import Services from "./pages/Services";
import Software_Services from "./pages/Software_Services";
import Finance_Services from "./pages/Finance_Services";
import Consultancy from "./pages/Consultancy";
import PrivateRoute from "./pages/PrivateRoute";
import IndustryLogin from "./pages/Industry_requirement/WelcomePage";
// 1. Industry Dashboard Import karein
import IndustryDashboard from "./pages/Industry_requirement/IndustryDashboard";
import RequirementForm from "./pages/Industry_requirement/RequirementForm";
function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        <Box sx={{ flex: 1 }}>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/services" element={<Services />} />
            <Route path="/software-services" element={<Software_Services />} />
            <Route path="/finance-services" element={<Finance_Services />} />
            <Route path="/consultancy-services" element={<Consultancy />} />
            <Route path="/careers" element={<Career />} />
            <Route path="/about" element={<About />} />
            <Route path="/loan-type" element={<LoanType />} />
            <Route path="/agro-product" element={<AgroProduct />} />
            
            {/* INDUSTRY ROUTES */}
             <Route path="/consultancy" element={<IndustryLogin />}/>
            <Route path="/industry-dashboard" element={<IndustryDashboard />} />
            <Route path="/submit-requirement" element={<RequirementForm />}/>
            {/* PROTECTED ROUTES */}
            <Route
              path="/employee-dashboard"
              element={
                <PrivateRoute>
                  <EmployeeDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/add-lead"
              element={
                <PrivateRoute>
                  <AddLead />
                </PrivateRoute>
              }
            />
            
          </Routes>
        </Box>

        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;