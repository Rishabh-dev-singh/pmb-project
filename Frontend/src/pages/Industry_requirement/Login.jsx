import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

function IndustryLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: 6, // Form ko thoda aur upar kiya
        background: "linear-gradient(-45deg, #0f3c6e, #1f6ed4, #4f46e5, #000000)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 15s ease infinite",
        paddingBottom: 4
      }}
    >
      <style>{`@keyframes gradientBG { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>

      <Container maxWidth="xs">
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box sx={{ width: 50, height: 50, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            <Typography variant="h5" fontWeight="800" color="#0f3c6e">IN</Typography>
          </Box>

          <Typography variant="h5" fontWeight="700" color="white" mb={0.5}>Industry Portal</Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={2.5}>Sign in to manage your requirements.</Typography>

          <Box component="form" sx={{ width: "100%" }}>
            <TextField
              margin="dense" fullWidth label="Industry Email Address" name="email"
              sx={{ input: { color: "white" }, "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } }, "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" } }}
            />
            <TextField
              margin="dense" fullWidth name="password" label="Password" type={showPassword ? "text" : "password"}
              InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleClickShowPassword} sx={{color: "rgba(255,255,255,0.5)"}}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }}
              sx={{ input: { color: "white" }, "& .MuiOutlinedInput-root": { borderRadius: "10px", "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } }, "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" }, mb: 2.5 }}
            />
            <Button fullWidth variant="contained" sx={{ py: 1.2, borderRadius: "10px", fontWeight: "bold", background: "linear-gradient(45deg, #6366f1, #4f46e5)" }}>
              Secure Login
            </Button>
          </Box>

          {/* Professional Registration Text */}
          <Typography variant="caption" color="rgba(255,255,255,0.7)" mt={3} sx={{ fontStyle: "italic" }}>
            For registration, please contact the PMB team.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default IndustryLogin;