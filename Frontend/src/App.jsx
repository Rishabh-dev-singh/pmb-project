import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import AdminLogin from "./pages/Admin_Login_Page";
import EmployeeLogin from "./pages/Employee_login";
import EmployeeDashboard from "./pages/EmployeeDashboard"; // 🔥 ADD THIS
import About from "./pages/About";
import Career from "./pages/Career";
import LoanType from "./pages/Loan_Type";
import AgroProduct from "./pages/AgroProduct";

function App() {
  return (
    <BrowserRouter>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh"
        }}
      >

        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <Box sx={{ flex: 1 }}>

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/inquiry" element={<Inquiry />} />

            <Route path="/admin-login" element={<AdminLogin />} />

            <Route path="/employee-login" element={<EmployeeLogin />} />

            {/* 🔥 IMPORTANT ROUTE */}
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

            <Route path="/careers" element={<Career />} />

            <Route path="/about" element={<About />} />

            <Route path="/loan-type" element={<LoanType />} />

            <Route path="/agro-product" element={<AgroProduct />} />

          </Routes>

        </Box>

        {/* FOOTER */}
        <Footer />

      </Box>
    </BrowserRouter>
  );
}

export default App;