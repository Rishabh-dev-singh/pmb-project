import React, { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress, IconButton, InputAdornment, alpha } from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, BadgeOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

function EmployeeLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // FIX 1: 'username' ki jagah 'employee_id' use karein
  const [formData, setFormData] = useState({ employee_id: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("login/", formData);
      navigate("/employee-dashboard");
    } catch (err) {
      alert("Invalid Credentials!");
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
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
      padding: 2,
      overflow: "hidden"
    }}>
      <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#38bdf8", filter: "blur(120px)", opacity: 0.15, top: -100, left: -100 }} />
      <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#818cf8", filter: "blur(120px)", opacity: 0.15, bottom: -100, right: -100 }} />

      <Box sx={{
        width: "100%", maxWidth: 420, padding: 5, borderRadius: "40px",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)",
        textAlign: "center", color: "white"
      }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: "-2px", background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          PMB Portal
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.7, mb: 5, letterSpacing: "1px" }}>SECURE ACCESS</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth variant="outlined" placeholder="Employee ID"
            // FIX 2: 'username' ki jagah 'employee_id' update karein
            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { color: "white", borderRadius: "16px", background: alpha("#fff", 0.05), "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#38bdf8" } } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{color: "#38bdf8"}}/></InputAdornment> }}
          />

          <TextField
            fullWidth type={showPassword ? "text" : "password"} placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ mb: 5, "& .MuiOutlinedInput-root": { color: "white", borderRadius: "16px", background: alpha("#fff", 0.05), "& fieldset": { borderColor: "rgba(255,255,255,0.1)" }, "&:hover fieldset": { borderColor: "#38bdf8" } } }}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><LockOutlined sx={{color: "#38bdf8"}}/></InputAdornment>,
              endAdornment: <IconButton onClick={() => setShowPassword(!showPassword)}><Visibility sx={{color: "#94a3b8"}}/></IconButton>
            }}
          />

          <Button type="submit" fullWidth sx={{
            py: 2, borderRadius: "16px",
            background: "linear-gradient(90deg, #38bdf8, #818cf8)",
            color: "white", fontWeight: 700, fontSize: "1rem",
            boxShadow: "0 10px 20px rgba(56, 189, 248, 0.3)",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0 15px 30px rgba(56, 189, 248, 0.5)" },
            transition: "all 0.3s ease"
          }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
export default EmployeeLogin;