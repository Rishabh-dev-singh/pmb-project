import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, BadgeOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

function EmployeeLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // YAHAN CHANGE KIYA HAI: "/login/" ki jagah sirf "login/" rakha hai
      // Taaki api.js ke baseURL ke sath milkar ye "https://pmb.finance/api/login/" ban jaye
      await api.post("login/", formData);
      navigate("/employee-dashboard");
    } catch (err) {
      // Error handling behtar ki hai taaki debugging aasan ho
      if (err.response && err.response.status === 401) {
        alert("Wrong ID or Password!");
      } else {
        alert("Server Error! Please check console for details.");
        console.error("Login Error Details:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)", // Deep Space Background
      padding: 2
    }}>
      <Box sx={{
        width: "100%",
        maxWidth: 400,
        padding: 4,
        borderRadius: "30px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)", // Glass Effect
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        color: "white"
      }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-1px" }}>
          PMB <span style={{ color: "#38bdf8" }}>Portal</span>
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.6, mb: 4 }}>Access your workspace securely.</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Employee ID"
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            sx={{ mb: 2, "& .MuiOutlinedInput-root": { color: "white", borderRadius: "12px", background: "rgba(255,255,255,0.05)" } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{color: "#94a3b8"}}/></InputAdornment> }}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { color: "white", borderRadius: "12px", background: "rgba(255,255,255,0.05)" } }}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><LockOutlined sx={{color: "#94a3b8"}}/></InputAdornment>,
              endAdornment: <IconButton onClick={() => setShowPassword(!showPassword)}><Visibility sx={{color: "#94a3b8"}}/></IconButton>
            }}
          />

          <Button type="submit" fullWidth sx={{
            py: 1.5,
            borderRadius: "12px",
            background: "linear-gradient(90deg, #38bdf8 0%, #818cf8 100%)",
            color: "white",
            fontWeight: 700,
            "&:hover": { filter: "brightness(1.2)" }
          }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Secure Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default EmployeeLogin;