import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EmployeeLogin() {
  const navigate = useNavigate();

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

  // 🔥 LOGIN FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        emp_id: formData.employeeId,
        password: formData.password,
      });

      // 🔍 DEBUG (VERY IMPORTANT)
      console.log("FULL API RESPONSE:", res.data);

      if (res.data.status === "success") {

        // ✅ SAVE ALL DATA (IMPORTANT FIX)
        localStorage.setItem("emp_id", res.data.emp_id);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("department", res.data.department);
        localStorage.setItem("designation", res.data.designation);

        alert("Login Successful ✅");

        // ✅ Redirect
        navigate("/employee-dashboard");

      } else {
        alert("Invalid ID or Password ❌");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Server Error ❌");
    }
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
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            maxWidth: "1000px",
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}
        >

          {/* LEFT PANEL */}
          <Box
            sx={{
              flex: 1.2,
              background: "linear-gradient(135deg, #1a237e, #0d47a1)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 4, md: 8 },
            }}
          >
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 900 }}>
              PMB <span style={{ color: "#4caf50" }}>Portal</span>
            </Typography>

            <Typography variant="h6" sx={{ textAlign: "center", opacity: 0.9 }}>
              Secure Employee Login System 🔒
            </Typography>
          </Box>

          {/* RIGHT PANEL */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
              Employee Login
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Employee ID"
                name="employeeId"
                fullWidth
                required
                sx={{ mb: 3 }}
                value={formData.employeeId}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🪪</InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                required
                sx={{ mb: 3 }}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🔑</InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: 50,
                  fontWeight: 700,
                  borderRadius: "10px",
                }}
              >
                Login
              </Button>
            </form>
          </Box>

        </Box>
      </Container>
    </Box>
  );
}

export default EmployeeLogin;