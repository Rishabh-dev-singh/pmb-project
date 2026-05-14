import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Backend URL
const BASE_URL = "https://pmb.finance";

function EmployeeLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    password: "",
  });

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // API Request to login
      const res = await axios.post(`${BASE_URL}/api/login/`, {
        username: formData.employeeId, 
        password: formData.password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      // Save Tokens and Profile Data to localStorage
      if (res.data.access) {
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        
        // Save user profile details sent from backend
        localStorage.setItem("employeeName", res.data.name);
        localStorage.setItem("designation", res.data.designation);
        localStorage.setItem("department", res.data.department);
        localStorage.setItem("employeeId", formData.employeeId);
        
        alert("Login Successful! ✅");
        navigate("/employee-dashboard");
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setErrorMsg("Login Failed. Please check your ID or Password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="sm">
        <Box sx={{ p: 4, bgcolor: "#fff", borderRadius: "20px", boxShadow: 5 }}>
          <Typography variant="h4" mb={3} fontWeight="bold" textAlign="center">
            Employee Login
          </Typography>

          {errorMsg && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {errorMsg}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Employee ID"
              name="employeeId"
              fullWidth
              required
              sx={{ mb: 2 }}
              value={formData.employeeId}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">🪪</InputAdornment>,
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
}

export default EmployeeLogin;