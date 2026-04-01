import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";

// Icons (Using Emojis for zero-dependency/no-error loading)
// If icons are installed, replace with <BadgeIcon /> and <LockIcon />
function EmployeeLogin() {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("PMB Employee Login Data:", formData);
  };

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh" }}>
     

      <Container
        maxWidth="lg"
        sx={{
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // Mobile pe column, desktop pe row
            width: "100%",
            maxWidth: "1000px",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >
          {/* --- LEFT PANEL: BRANDING --- */}
          <Box
            sx={{
              flex: 1.2,
              background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 4, md: 8 },
              position: "relative",
            }}
          >
            {/* Background Decorative Circle */}
            <Box
              sx={{
                position: "absolute",
                top: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
              }}
            />

            <Typography
              variant="h3"
              sx={{ mb: 2, fontWeight: 900, textAlign: "center", letterSpacing: -1 }}
            >
              PMB <span style={{ color: "#4caf50" }}>Portal</span>
            </Typography>
            <Typography
              variant="h6"
              sx={{ textAlign: "center", opacity: 0.9, fontWeight: 300, mb: 4 }}
            >
              Efficiency in Finance, <br /> Excellence in Service.
            </Typography>

            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                p: 2,
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                🔒 Secure Employee Access Area
              </Typography>
            </Box>
          </Box>

          {/* --- RIGHT PANEL: LOGIN FORM --- */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 800, color: "#1a237e" }}>
              Employee Login
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: "text.secondary" }}>
              Please enter your credentials to continue.
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Employee ID"
                name="employeeId"
                required
                fullWidth
                placeholder="E-10023"
                sx={{ mb: 3 }}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🪪</InputAdornment>
                  ),
                  sx: { borderRadius: "12px" },
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                required
                fullWidth
                sx={{ mb: 1 }}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🔑</InputAdornment>
                  ),
                  sx: { borderRadius: "12px" },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mb: 3,
                  color: "primary.main",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Forgot Password?
              </Typography>

              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  height: 54,
                  fontSize: 17,
                  fontWeight: 700,
                  borderRadius: "12px",
                  textTransform: "none",
                  background: "linear-gradient(90deg, #1a237e, #0d47a1)",
                  boxShadow: "0 10px 20px rgba(26, 35, 126, 0.3)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 25px rgba(26, 35, 126, 0.4)",
                    background: "#1a237e",
                  },
                }}
              >
                Access Portal
              </Button>
            </form>

            <Typography
              variant="caption"
              align="center"
              sx={{ mt: 4, color: "text.disabled", fontSize: "0.75rem" }}
            >
              © 2026 PMB Agri & Leasing Corporation <br />
              Authorized Access Only
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default EmployeeLogin;