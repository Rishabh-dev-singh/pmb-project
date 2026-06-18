import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  IconButton, 
  InputAdornment, 
  alpha,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  LockOutlined, 
  BadgeOutlined 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../api"; 

function EmployeeLogin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // Premium Midnight Aurora Gradient
      background: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)",
      padding: 2,
      overflow: "hidden",
      position: "relative"
    }}>
      {/* Dynamic Glowing Orbs for Luxury Vibe */}
      <Box sx={{ position: "absolute", width: {xs: 300, md: 500}, height: {xs: 300, md: 500}, borderRadius: "50%", background: "#38bdf8", filter: "blur(150px)", opacity: 0.15, top: "-10%", left: "-10%", animation: "pulse 6s infinite alternate" }} />
      <Box sx={{ position: "absolute", width: {xs: 300, md: 500}, height: {xs: 300, md: 500}, borderRadius: "50%", background: "#818cf8", filter: "blur(150px)", opacity: 0.15, bottom: "-10%", right: "-10%", animation: "pulse 8s infinite alternate-reverse" }} />

      {/* Glassmorphism Card */}
      <Box sx={{
        width: "100%", 
        maxWidth: 440, 
        padding: { xs: 4, md: 6 }, 
        borderRadius: "32px",
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
        textAlign: "center", 
        color: "white",
        position: "relative",
        zIndex: 1
      }}>
        
        {/* Sleek Typography */}
        <Typography variant="h3" sx={{ 
          fontWeight: 900, 
          mb: 1, 
          letterSpacing: "-1px", 
          background: "linear-gradient(to right, #ffffff, #94a3b8)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent" 
        }}>
          PMB CRM
        </Typography>
        
        {/* Security / Trust text */}
        <Typography variant="subtitle2" sx={{ 
          opacity: 0.6, 
          mb: 5, 
          letterSpacing: "3px", 
          fontWeight: 600,
          textTransform: "uppercase"
        }}>
          SECURE WORKSPACE
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Employee ID Field */}
          <TextField
            fullWidth 
            variant="outlined" 
            placeholder="Employee ID"
            onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
            sx={{ 
              mb: 3, 
              "& .MuiOutlinedInput-root": { 
                color: "white", 
                borderRadius: "16px", 
                background: "rgba(255, 255, 255, 0.04)", 
                transition: "all 0.3s ease",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)", borderWidth: "1.5px" }, 
                "&:hover": { background: "rgba(255, 255, 255, 0.06)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#38bdf8", boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)" } 
              } 
            }}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><BadgeOutlined sx={{color: "#38bdf8"}}/></InputAdornment> 
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth 
            type={showPassword ? "text" : "password"} 
            placeholder="Password"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            sx={{ 
              mb: 5, 
              "& .MuiOutlinedInput-root": { 
                color: "white", 
                borderRadius: "16px", 
                background: "rgba(255, 255, 255, 0.04)", 
                transition: "all 0.3s ease",
                "& fieldset": { borderColor: "rgba(255,255,255,0.1)", borderWidth: "1.5px" }, 
                "&:hover": { background: "rgba(255, 255, 255, 0.06)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&.Mui-focused fieldset": { borderColor: "#38bdf8", boxShadow: "0 0 15px rgba(56, 189, 248, 0.2)" } 
              } 
            }}
            InputProps={{ 
              startAdornment: <InputAdornment position="start"><LockOutlined sx={{color: "#38bdf8"}}/></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ 
                      color: showPassword ? "#38bdf8" : "#64748b",
                      transition: "color 0.3s ease"
                    }}
                  >
                    {/* PERFECT EYE TOGGLE */}
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Luxury Glowing Button */}
          <Button 
            type="submit" 
            fullWidth 
            disabled={loading}
            sx={{
              py: 2, 
              borderRadius: "16px",
              background: "linear-gradient(90deg, #0284c7, #4f46e5)",
              color: "white", 
              fontWeight: 800, 
              fontSize: "1.1rem",
              letterSpacing: "1px",
              boxShadow: "0 10px 25px -5px rgba(56, 189, 248, 0.4)",
              "&:hover": { 
                background: "linear-gradient(90deg, #0369a1, #4338ca)",
                transform: "translateY(-3px)", 
                boxShadow: "0 20px 35px -5px rgba(56, 189, 248, 0.6)" 
              },
              "&:active": {
                transform: "translateY(1px)"
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {loading ? <CircularProgress size={26} color="inherit" thickness={5} /> : "SIGN IN"}
          </Button>
        </form>
      </Box>

      {/* Optional: Add CSS Keyframes for subtle background breathing effect */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.1; }
            100% { transform: scale(1.1); opacity: 0.2; }
          }
        `}
      </style>
    </Box>
  );
}

export default EmployeeLogin;