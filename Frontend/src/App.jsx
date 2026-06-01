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

/* NEW IMPORTS */
import Software_Services from "./pages/Software_Services";
import Finance_Services from "./pages/Finance_Services";
import Consultancy from "./pages/Consultancy";

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
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <Box sx={{ flex: 1 }}>
          <Routes>

            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* INQUIRY */}
            <Route
              path="/inquiry"
              element={<Inquiry />}
            />

            {/* ADMIN */}
            <Route
              path="/admin-login"
              element={<AdminLogin />}
            />

            {/* EMPLOYEE */}
            <Route
              path="/employee-login"
              element={<EmployeeLogin />}
            />

            <Route
              path="/employee-dashboard"
              element={<EmployeeDashboard />}
            />

            {/* ADD LEAD */}
            <Route
              path="/add-lead"
              element={<AddLead />}
            />

            {/* MAIN SERVICES PAGE */}
            <Route
              path="/services"
              element={<Services />}
            />

            {/* SOFTWARE SERVICES */}
            <Route
              path="/software-services"
              element={<Software_Services />}
            />

            {/* FINANCE SERVICES */}
            <Route
              path="/finance-services"
              element={<Finance_Services />}
            />

            {/* CONSULTANCY */}
            <Route
              path="/consultancy-services"
              element={<Consultancy />}
            />

            {/* CAREER */}
            <Route
              path="/careers"
              element={<Career />}
            />

            {/* ABOUT */}
            <Route
              path="/about"
              element={<About />}
            />

            {/* LOAN */}
            <Route
              path="/loan-type"
              element={<LoanType />}
            />

            {/* AGRO */}
            <Route
              path="/agro-product"
              element={<AgroProduct />}
            />

          </Routes>
        </Box>

        {/* FOOTER */}
        <Footer />
      </Box>
    </BrowserRouter>
  );
}

export default App;