import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  InputAdornment
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AgricultureIcon from "@mui/icons-material/Agriculture";

import { useNavigate } from "react-router-dom";

function LoanInquiry() {
  const navigate = useNavigate();

  const [loanData, setLoanData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [agroData, setAgroData] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const primaryIndigo = "#1f2a7c";
  const successGreen = "#2e7d32";

  // =========================
  // LOAN SUBMIT (Sahi Address: /api/)
  // =========================
  const handleLoanSubmit = async () => {
    if (loanData.name.trim() === "" || loanData.phone.trim() === "") {
      alert("Please fill Name and Mobile Number");
      return;
    }

    try {
      // Yahan localhost hata diya hai taaki server par chale
      const response = await fetch("/api/inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: loanData.name,
          mobile: loanData.phone,
          email: loanData.email
        })
      });

      const data = await response.json();
      localStorage.setItem("lead_id", data.id);
      navigate("/loan-type");
    } catch (error) {
      console.error("Loan Error:", error);
      alert("Connection Error. Please check your internet.");
    }
  };

  // =========================
  // AGRO SUBMIT (Sahi Address: /api/)
  // =========================
  const handleAgroSubmit = async () => {
    if (agroData.name.trim() === "" || agroData.phone.trim() === "") {
      alert("Please fill Name and Mobile Number");
      return;
    }

    try {
      // Yahan bhi localhost hata diya gaya hai
      const response = await fetch("/api/agro-inquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: agroData.name,
          mobile: agroData.phone,
          email: agroData.email
        })
      });

      const data = await response.json();
      localStorage.setItem("agri_id", data.id);
      navigate("/agro-product");
    } catch (error) {
      console.error("Agro Error:", error);
      alert("Connection Error. Please try again.");
    }
  };

  // =========================
  // UI STYLES
  // =========================
  const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    padding: "30px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
    transition: "0.35s",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 40px 70px rgba(0,0,0,0.35)"
    }
  };

  const inputStyle = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: "#fff",
      height: "50px",
      "&:hover fieldset": {
        borderColor: "#1f2a7c"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1f2a7c"
      }
    }
  };

  const buttonStyle = {
    mt: 1,
    py: 1.4,
    fontWeight: "bold",
    borderRadius: "12px",
    fontSize: "16px",
    textTransform: "none",
    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
    "&:hover": {
      transform: "translateY(-2px)"
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#1a237e,#0d47a1)",
        display: "flex",
        alignItems: "center"
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center">
          {/* LOAN CARD */}
          <Grid item xs={12} md={5} display="flex" justifyContent="center">
            <Paper sx={cardStyle}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: primaryIndigo,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  mb: 2,
                  color: "#fff"
                }}
              >
                <AccountBalanceIcon />
              </Box>
              <Typography variant="h5" fontWeight="bold" color={primaryIndigo}>
                Loan Inquiry
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                PMB Financial Services Center
              </Typography>

              <TextField
                label="Full Name"
                fullWidth
                sx={inputStyle}
                value={loanData.name}
                onChange={(e) => setLoanData({ ...loanData, name: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Email Address"
                fullWidth
                sx={inputStyle}
                value={loanData.email}
                onChange={(e) => setLoanData({ ...loanData, email: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Mobile Number"
                fullWidth
                sx={inputStyle}
                value={loanData.phone}
                onChange={(e) => setLoanData({ ...loanData, phone: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleLoanSubmit}
                sx={{
                  ...buttonStyle,
                  background: primaryIndigo
                }}
              >
                Check Loan Options
              </Button>
            </Paper>
          </Grid>

          {/* AGRO CARD */}
          <Grid item xs={12} md={5} display="flex" justifyContent="center">
            <Paper sx={cardStyle}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: successGreen,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "auto",
                  mb: 2,
                  color: "#fff"
                }}
              >
                <AgricultureIcon />
              </Box>
              <Typography variant="h5" fontWeight="bold" color={successGreen}>
                Agri Inquiry
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                PMB Organic Products Center
              </Typography>

              <TextField
                label="Full Name"
                fullWidth
                sx={inputStyle}
                value={agroData.name}
                onChange={(e) => setAgroData({ ...agroData, name: e.target.value })}
              />
              <TextField
                label="Email Address"
                fullWidth
                sx={inputStyle}
                value={agroData.email}
                onChange={(e) => setAgroData({ ...agroData, email: e.target.value })}
              />
              <TextField
                label="Mobile Number"
                fullWidth
                sx={inputStyle}
                value={agroData.phone}
                onChange={(e) => setAgroData({ ...agroData, phone: e.target.value })}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleAgroSubmit}
                sx={{
                  ...buttonStyle,
                  background: successGreen
                }}
              >
                Browse Organic Products
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LoanInquiry;